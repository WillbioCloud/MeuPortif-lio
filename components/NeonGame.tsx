import React, { useRef, useEffect, useState } from 'react';
import { Maximize2, Minimize2, Play, Heart, Shield, Zap, Crosshair, ChevronsUp, Activity, Plus, Flame, Smartphone } from 'lucide-react';
import { translations } from '../translations';
import { Language } from '../types';

interface NeonGameProps {
  language: Language;
}

// === TIPOS E CONFIGURAÇÕES ===
const FPS = 60;
type DropType = 'rapidfire' | 'damage' | 'health' | 'shield' | 'laser';
type BossBuffType = 'multishot' | 'electric' | 'ricochet' | 'speed';
type AllBuffs = DropType | BossBuffType;

interface Bullet {
    x: number; y: number; vx: number; vy: number;
    type: 'normal' | 'electric' | 'ricochet' | 'enemy';
    damage: number;
    bounces?: number;
    id: number;
}

interface Enemy {
    id: number;
    x: number; y: number; w: number; h: number;
    targetY: number; startX: number;
    hp: number; maxHp: number;
    type: 'basic' | 'shooter' | 'tank' | 'boss';
    vx: number; vy: number;
    lastShot?: number;
    electrifiedTimer: number;
    // Final Boss Specifics
    isFinalBoss?: boolean;
    bossStage?: 1 | 2 | 3;
    invulnerable?: boolean;
    sucking?: boolean; // Animation state
}

interface Drop {
    id: number; x: number; y: number; type: DropType; vy: number;
}

interface Particle {
    x: number; y: number; vx: number; vy: number;
    life: number; color: string;
    isSuck?: boolean; // Partícula sendo sugada pelo boss
}

interface FloatingText {
    x: number; y: number; text: string; color: string; life: number; vy: number;
}

interface GameState {
    player: {
        x: number; y: number; w: number; h: number; vx: number; vy: number;
        hp: number; maxHp: number; shield: number; maxShield: number;
        speed: number; fireRate: number; damage: number; multishot: number;
        bulletType: 'normal' | 'electric' | 'ricochet' | 'laser';
    };
    bullets: Bullet[];
    enemies: Enemy[];
    drops: Drop[];
    particles: Particle[];
    texts: FloatingText[];
    keys: { w: boolean, a: boolean, s: boolean, d: boolean, space: boolean, up: boolean, left: boolean, down: boolean, right: boolean };
    joystick: { active: boolean, originX: number, originY: number, curX: number, curY: number, vecX: number, vecY: number };
    touchShooting: boolean;
    lastShot: number;
    frames: number;
    wave: number;
    bossActive: boolean;
    bossCount: number;
    enemiesToSpawn: number[];
}

const NeonGame: React.FC<NeonGameProps> = ({ language }) => {
  const t = translations[language].game;
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bossWarning, setBossWarning] = useState<string | null>(null);
  const [buffSelection, setBuffSelection] = useState<BossBuffType[] | null>(null);
  const [wave, setWave] = useState(1);
  const [activeBuffs, setActiveBuffs] = useState<AllBuffs[]>([]);
  const [showRotateMessage, setShowRotateMessage] = useState(false);

  const gameState = useRef<GameState>({
    player: { x: 0, y: 0, w: 30, h: 30, vx: 0, vy: 0, hp: 5, maxHp: 5, shield: 0, maxShield: 2, speed: 5, fireRate: 300, damage: 1, multishot: 1, bulletType: 'normal' },
    bullets: [], enemies: [], drops: [], particles: [], texts: [],
    keys: { w: false, a: false, s: false, d: false, space: false, up: false, left: false, down: false, right: false },
    joystick: { active: false, originX: 0, originY: 0, curX: 0, curY: 0, vecX: 0, vecY: 0 },
    touchShooting: false,
    lastShot: 0, frames: 0, wave: 1, bossActive: false, bossCount: 0, enemiesToSpawn: []
  });

  const requestRef = useRef<number>();

  // === FUNÇÃO DE FULLSCREEN ROBUSTA ===
  const toggleFullscreen = async () => {
      if (!containerRef.current) return;
      
      try {
          if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
              // Tenta entrar em fullscreen (Suporte Cross-Browser)
              const el = containerRef.current as any;
              if (el.requestFullscreen) await el.requestFullscreen();
              else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen(); // iOS Safari
              else if (el.msRequestFullscreen) await el.msRequestFullscreen();
              
              // Tenta travar a orientação (Android funciona bem, iOS ignora as vezes)
              if (screen.orientation && (screen.orientation as any).lock) {
                  try {
                      await (screen.orientation as any).lock('landscape');
                  } catch (e) {
                      console.log('Orientation lock not supported/allowed on this device');
                  }
              }
              setIsFullscreen(true);
          } else {
              // Sair do fullscreen
              if (document.exitFullscreen) await document.exitFullscreen();
              else if ((document as any).webkitExitFullscreen) await (document as any).webkitExitFullscreen(); // iOS Safari
              
              if (screen.orientation && (screen.orientation as any).unlock) {
                  (screen.orientation as any).unlock();
              }
              setIsFullscreen(false);
          }
      } catch (err) {
          console.error("Erro ao alternar fullscreen:", err);
      }
  };

  // Monitorar mudanças reais de fullscreen (Botão voltar do Android ou ESC)
  useEffect(() => {
      const handleResize = () => {
          // Checa se está em portrait enquanto em fullscreen para mostrar aviso
          if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
             if (window.innerHeight > window.innerWidth) setShowRotateMessage(true);
             else setShowRotateMessage(false);
          } else {
             setShowRotateMessage(false);
          }

          if (containerRef.current && canvasRef.current) {
             canvasRef.current.width = containerRef.current.clientWidth;
             canvasRef.current.height = containerRef.current.clientHeight;
          }
      };

      const handleFullscreenChange = () => {
          const isFull = !!document.fullscreenElement || !!(document as any).webkitFullscreenElement;
          setIsFullscreen(isFull);
          if (!isFull) setShowRotateMessage(false);
          // Pequeno delay para garantir que o navegador redimensionou
          setTimeout(handleResize, 100);
      };

      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      window.addEventListener('resize', handleResize);
      
      return () => {
          document.removeEventListener('fullscreenchange', handleFullscreenChange);
          document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
          window.removeEventListener('resize', handleResize);
      };
  }, []);

  // === DESENHO ===
  const drawPlayerShip = (ctx: CanvasRenderingContext2D, p: GameState['player']) => {
    ctx.beginPath();
    ctx.moveTo(p.x + p.w/2, p.y); 
    ctx.lineTo(p.x + p.w, p.y + p.h); 
    ctx.lineTo(p.x + p.w/2, p.y + p.h - 10); 
    ctx.lineTo(p.x, p.y + p.h); 
    ctx.closePath();
    
    const color = p.shield > 0 ? '#00f3ff' : (p.bulletType === 'laser' ? '#ff0055' : '#00ff00');
    ctx.shadowBlur = p.bulletType === 'laser' ? 20 : 10;
    ctx.shadowColor = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = p.shield > 0 ? 'rgba(0, 243, 255, 0.2)' : 'rgba(0, 255, 0, 0.2)';
    ctx.fill();

    if (p.shield > 0) {
        ctx.beginPath(); ctx.arc(p.x + p.w/2, p.y + p.h/2, p.w, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(0, 243, 255, 0.5)`; ctx.lineWidth = 1; ctx.stroke();
    }
    if (p.shield >= 2) {
        ctx.beginPath(); ctx.arc(p.x + p.w/2, p.y + p.h/2, p.w + 8, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(0, 243, 255, 0.8)`; ctx.lineWidth = 2; ctx.stroke();
    }
  };

  const drawEnemyShip = (ctx: CanvasRenderingContext2D, e: Enemy) => {
    ctx.beginPath();
    if (e.electrifiedTimer > 0) {
        ctx.shadowColor = '#00f3ff'; ctx.strokeStyle = '#00f3ff';
        ctx.translate((Math.random()-0.5)*4, (Math.random()-0.5)*4);
    } else {
        const colors = { basic: '#ff003c', shooter: '#ff9900', tank: '#d900ff', boss: '#ff0000' };
        ctx.strokeStyle = colors[e.type] || '#fff';
        ctx.shadowColor = ctx.strokeStyle;
    }

    if (e.type === 'basic') {
        ctx.moveTo(e.x, e.y); ctx.lineTo(e.x+e.w, e.y); ctx.lineTo(e.x+e.w/2, e.y+e.h);
    } else if (e.type === 'shooter') {
        ctx.moveTo(e.x, e.y); ctx.lineTo(e.x+e.w/2, e.y+e.h/2); ctx.lineTo(e.x+e.w, e.y);
        ctx.lineTo(e.x+e.w*0.8, e.y+e.h); ctx.lineTo(e.x+e.w*0.2, e.y+e.h);
    } else if (e.type === 'tank') {
        ctx.moveTo(e.x+10, e.y); ctx.lineTo(e.x+e.w-10, e.y); ctx.lineTo(e.x+e.w, e.y+e.h/2);
        ctx.lineTo(e.x+e.w-10, e.y+e.h); ctx.lineTo(e.x+10, e.y+e.h); ctx.lineTo(e.x, e.y+e.h/2);
    }
    
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.stroke();
    
    if (e.electrifiedTimer > 0) ctx.setTransform(1, 0, 0, 1, 0, 0); 
  };

  const drawBoss = (ctx: CanvasRenderingContext2D, e: Enemy) => {
    if (e.electrifiedTimer > 0) {
        ctx.shadowColor = '#00f3ff'; ctx.strokeStyle = '#00f3ff';
    } else {
        ctx.shadowColor = '#ff0000'; ctx.strokeStyle = '#ff0000';
    }

    ctx.beginPath();
    if (e.isFinalBoss) {
        const cx = e.x + e.w/2, cy = e.y + e.h/2;
        ctx.shadowBlur = 30;
        ctx.moveTo(cx, e.y + e.h); 
        ctx.lineTo(e.x + e.w, cy); 
        ctx.lineTo(e.x + e.w - 20, e.y); 
        ctx.lineTo(cx, e.y + 20); 
        ctx.lineTo(e.x + 20, e.y); 
        ctx.lineTo(e.x, cy); 
        ctx.closePath();
        
        ctx.stroke();
        ctx.fillStyle = e.sucking ? '#fff' : '#330000';
        ctx.beginPath(); ctx.arc(cx - 30, cy, 10, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 30, cy, 10, 0, Math.PI*2); ctx.fill();
        
        const barW = e.w;
        const stage = e.bossStage || 1;
        const hpPct = e.hp / e.maxHp;
        const barColor = stage === 1 ? '#00ff00' : (stage === 2 ? '#ffff00' : '#ff0000');
        
        ctx.fillStyle = '#330000'; ctx.fillRect(e.x, e.y - 30, barW, 8);
        ctx.fillStyle = barColor; ctx.fillRect(e.x, e.y - 30, hpPct * barW, 8);
        
        ctx.fillStyle = '#000';
        ctx.fillRect(e.x + barW*0.33, e.y - 30, 2, 8);
        ctx.fillRect(e.x + barW*0.66, e.y - 30, 2, 8);
    } else {
        ctx.moveTo(e.x + e.w/2, e.y + e.h); ctx.lineTo(e.x + e.w, e.y + e.h/3);
        ctx.lineTo(e.x + e.w - 20, e.y); ctx.lineTo(e.x + 20, e.y); ctx.lineTo(e.x, e.y + e.h/3);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = '#330000'; ctx.fillRect(e.x, e.y - 20, e.w, 6);
        ctx.fillStyle = '#ff0000'; ctx.fillRect(e.x, e.y - 20, (e.hp/e.maxHp)*e.w, 6);
    }
  };

  const drawDrop = (ctx: CanvasRenderingContext2D, d: Drop) => {
      ctx.shadowBlur = 10; ctx.lineWidth = 2; ctx.beginPath();
      if (d.type === 'laser') {
          ctx.shadowColor = '#ff0055'; ctx.strokeStyle = '#fff'; ctx.fillStyle = '#ff0055';
          ctx.arc(d.x, d.y, 15, 0, Math.PI*2); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(d.x-5, d.y-8); ctx.lineTo(d.x+5, d.y-8); ctx.lineTo(d.x, d.y+10); ctx.stroke();
      } else {
          if (d.type === 'health') { ctx.fillStyle = '#ff0055'; ctx.shadowColor = '#ff0055'; ctx.arc(d.x, d.y, 10, 0, Math.PI*2); ctx.fill(); ctx.fillStyle='#fff'; ctx.fillRect(d.x-3, d.y-8, 6, 16); ctx.fillRect(d.x-8, d.y-3, 16, 6); }
          else if (d.type === 'shield') { ctx.strokeStyle = '#00f3ff'; ctx.shadowColor = '#00f3ff'; ctx.arc(d.x, d.y, 12, 0, Math.PI*2); ctx.stroke(); ctx.fillStyle='rgba(0,243,255,0.3)'; ctx.fill(); }
          else if (d.type === 'rapidfire') { ctx.fillStyle = '#ffff00'; ctx.shadowColor = '#ffff00'; ctx.moveTo(d.x-5, d.y-10); ctx.lineTo(d.x+5, d.y); ctx.lineTo(d.x-5, d.y); ctx.lineTo(d.x+5, d.y+10); ctx.fill(); }
          else if (d.type === 'damage') { ctx.fillStyle = '#ff5500'; ctx.shadowColor = '#ff5500'; ctx.moveTo(d.x, d.y-10); ctx.lineTo(d.x+8, d.y+5); ctx.lineTo(d.x-8, d.y+5); ctx.fill(); }
      }
  };

  // === LÓGICA DE JOGO ===

  const initGame = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    gameState.current = {
        ...gameState.current,
        player: { 
            x: canvas.width / 2, y: canvas.height - 100, w: 30, h: 30, 
            vx: 0, vy: 0, hp: 5, maxHp: 5, shield: 0, maxShield: 2,
            speed: 5, fireRate: 300, damage: 1, multishot: 1, bulletType: 'normal' 
        },
        bullets: [], enemies: [], drops: [], particles: [], texts: [],
        frames: 0, wave: 0, bossActive: false, bossCount: 0, enemiesToSpawn: []
    };
    
    setScore(0);
    setWave(1);
    setActiveBuffs([]);
    setGameOver(false);
    setGameWon(false);
    setIsPlaying(true);
    setBuffSelection(null);
    startWave(1);
  };

  const startWave = (waveNum: number) => {
      gameState.current.wave = waveNum;
      setWave(waveNum);
      
      if (waveNum % 3 === 0) {
          const isFinal = waveNum >= 9; // Wave 9 = Final Boss
          setBossWarning(isFinal ? t.finalBossWarning : t.bossWarning);
          setTimeout(() => {
              setBossWarning(null);
              spawnBoss(isFinal);
          }, 3000);
      } else {
          const count = 5 + waveNum * 2;
          const queue: number[] = [];
          for(let i=0; i<count; i++) {
              const rand = Math.random();
              let type = 0;
              if (waveNum > 4 && rand > 0.7) type = 2; // Tank
              else if (waveNum > 2 && rand > 0.5) type = 1; // Shooter
              queue.push(type);
          }
          gameState.current.enemiesToSpawn = queue;
      }
  };

  const spawnBoss = (isFinal: boolean) => {
      if(!canvasRef.current) return;
      gameState.current.bossActive = true;
      gameState.current.bossCount++;

      // Boss HP Scaling
      const hpMult = isFinal ? 80 : 30; 
      const w = isFinal ? 200 : 160;
      
      gameState.current.enemies.push({
          id: Math.random(),
          x: canvasRef.current.width / 2 - w/2, y: -150,
          w: w, h: isFinal ? 180 : 120, targetY: 50, startX: canvasRef.current.width / 2 - w/2,
          hp: 200 + (gameState.current.wave * hpMult), 
          maxHp: 200 + (gameState.current.wave * hpMult),
          type: 'boss', isFinalBoss: isFinal, bossStage: 1,
          vx: 0, vy: 0, lastShot: 0, electrifiedTimer: 0, invulnerable: false
      });

      // Boss 2: Spawna ajuda imediatamente
      if (!isFinal && gameState.current.bossCount === 2) {
         spawnMinionsForBoss();
      }
  };

  const spawnMinionsForBoss = (isAggressive = false) => {
      if (!canvasRef.current) return;
      if (isAggressive) {
          // Fase 3 do Final Boss: Tanks mirando no player
          for(let i=0; i<3; i++) spawnFormation(2); // Tanks
          // E alguns shooters para atrapalhar
          for(let i=0; i<2; i++) spawnFormation(1); // Shooters
      } else {
          // Padrão Boss 2
          for(let i=0; i<2; i++) spawnFormation(2); 
          for(let i=0; i<2; i++) spawnFormation(1); 
      }
  };

  const spawnFormation = (typeIdx: number) => {
      if(!canvasRef.current) return;
      const w = canvasRef.current.width;
      const type = (['basic', 'shooter', 'tank'] as const)[typeIdx];
      const size = type === 'tank' ? 50 : 30;
      const hp = type === 'tank' ? 10 : (type === 'shooter' ? 3 : 1);
      const row = Math.floor(Math.random() * 3);
      
      gameState.current.enemies.push({
          id: Math.random(),
          x: Math.random() * (w - size), y: -50,
          targetY: 50 + (row * 60), startX: Math.random() * (w - size),
          w: size, h: size, hp, maxHp: hp, type, vx: 0, vy: 0, electrifiedTimer: 0
      });
  };

  const spawnBullet = (x: number, y: number, isEnemy: boolean, angleOffset = 0) => {
      const state = gameState.current;
      const speed = isEnemy ? 6 : 12;
      const type = isEnemy ? 'enemy' : state.player.bulletType;
      
      // Mira preditiva simples para inimigos agressivos
      let vx = Math.sin(angleOffset) * speed;
      let vy = isEnemy ? speed : -speed;

      state.bullets.push({
          id: Math.random(),
          x, y,
          vx: vx,
          vy: vy,
          type: type === 'laser' ? 'normal' : type, 
          damage: isEnemy ? 10 : state.player.damage,
          bounces: type === 'ricochet' ? 2 : 0
      });
  };

  // Helper para tiro mirando no player
  const spawnAimedBullet = (x: number, y: number) => {
      const state = gameState.current;
      const dx = (state.player.x + state.player.w/2) - x;
      const dy = (state.player.y + state.player.h/2) - y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const speed = 7;
      
      state.bullets.push({
          id: Math.random(),
          x, y,
          vx: (dx/dist) * speed,
          vy: (dy/dist) * speed,
          type: 'enemy',
          damage: 10,
          bounces: 0
      });
  }

  const spawnDrop = (x: number, y: number, forcedType?: DropType) => {
      if (!forcedType && Math.random() > 0.2) return; 

      let type: DropType = forcedType || 'rapidfire';
      if (!forcedType) {
        const rand = Math.random();
        if (rand < 0.3) type = 'rapidfire';
        else if (rand < 0.6) type = 'damage';
        else if (rand < 0.8) type = 'shield';
        else type = 'health';
      }

      gameState.current.drops.push({ id: Math.random(), x, y, type, vy: 2 });
  };

  const applyDropBuff = (buff: DropType) => {
      const p = gameState.current.player;
      switch(buff) {
          case 'health': 
            if (p.hp < p.maxHp) { p.hp++; addFloatingText(p.x, p.y, '+1 HP', '#ff0055'); }
            else addFloatingText(p.x, p.y, 'MAX HP', '#fff'); break;
          case 'shield': 
            if (p.shield < p.maxShield) { p.shield++; addFloatingText(p.x, p.y, 'SHIELD UP', '#00f3ff'); }
            else addFloatingText(p.x, p.y, 'MAX SHIELD', '#fff'); break;
          case 'rapidfire': p.fireRate = Math.max(50, p.fireRate - 20); addFloatingText(p.x, p.y, 'SPEED UP', '#ffff00'); break;
          case 'damage': p.damage += 0.5; addFloatingText(p.x, p.y, 'DMG UP', '#ff5500'); break;
          case 'laser': 
            p.bulletType = 'laser'; 
            p.damage = 0.5; 
            p.fireRate = 0; 
            addFloatingText(p.x, p.y, 'LASER BEAM!', '#ff0055'); 
            break;
      }
  };

  const applyBossBuff = (buff: BossBuffType) => {
      const p = gameState.current.player;
      setActiveBuffs(prev => [...prev, buff]);
      switch(buff) {
          case 'multishot': p.multishot++; break;
          case 'electric': p.bulletType = 'electric'; break;
          case 'ricochet': p.bulletType = 'ricochet'; break;
          case 'speed': p.speed += 2; break;
      }
      setBuffSelection(null); startWave(gameState.current.wave + 1);
  };

  const createExplosion = (x: number, y: number, color: string, count = 10) => {
      for (let i = 0; i < count; i++) {
          gameState.current.particles.push({
              x, y, vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10, life: 1.0, color
          });
      }
  };

  const addFloatingText = (x: number, y: number, text: string, color: string) => {
      gameState.current.texts.push({ x, y, text, color, life: 1.0, vy: -1 });
  };

  // === UPDATE LOOP ===
  const update = () => {
      if (!canvasRef.current || buffSelection || gameWon) return; 
      const canvas = canvasRef.current;
      const state = gameState.current;
      state.frames++;

      // Spawner logic
      if (state.enemiesToSpawn.length > 0 && state.frames % 40 === 0) {
          const next = state.enemiesToSpawn.shift();
          if (next !== undefined) spawnFormation(next);
      } else if (state.enemiesToSpawn.length === 0 && state.enemies.length === 0 && !state.bossActive) {
          if (state.wave % 3 !== 0) startWave(state.wave + 1);
      }

      // Player Move
      state.player.vx = 0; state.player.vy = 0;
      if (state.keys.a || state.keys.left) state.player.vx = -state.player.speed;
      if (state.keys.d || state.keys.right) state.player.vx = state.player.speed;
      if (state.keys.w || state.keys.up) state.player.vy = -state.player.speed;
      if (state.keys.s || state.keys.down) state.player.vy = state.player.speed;
      if (state.joystick.active) { state.player.vx = state.joystick.vecX * state.player.speed; state.player.vy = state.joystick.vecY * state.player.speed; }
      state.player.x = Math.max(0, Math.min(canvas.width - state.player.w, state.player.x + state.player.vx));
      state.player.y = Math.max(0, Math.min(canvas.height - state.player.h, state.player.y + state.player.vy));

      // Shooting
      const now = Date.now();
      const isShooting = state.keys.space || state.touchShooting;
      
      if (isShooting) {
          if (state.player.bulletType === 'laser') {
              if (state.frames % 5 === 0) { 
                  state.enemies.forEach(e => {
                      if (e.x < state.player.x + state.player.w && e.x + e.w > state.player.x) {
                          e.hp -= state.player.damage * 2;
                          createExplosion(e.x + Math.random()*e.w, e.y + e.h, '#ff0055', 1);
                          checkEnemyDeath(e);
                      }
                  });
              }
          } else if (now - state.lastShot > state.player.fireRate) {
              const spread = 0.2;
              for(let i=0; i<state.player.multishot; i++) {
                 const angle = (i - (state.player.multishot-1)/2) * spread;
                 state.bullets.push({ id: Math.random(), x: state.player.x + state.player.w/2, y: state.player.y, vx: Math.sin(angle)*12, vy: -12, type: state.player.bulletType, damage: state.player.damage, bounces: state.player.bulletType === 'ricochet' ? 2 : 0 });
              }
              state.lastShot = now;
          }
      }

      // Bullets
      for (let i = state.bullets.length - 1; i >= 0; i--) {
          const b = state.bullets[i];
          b.x += b.vx; b.y += b.vy;
          if (b.type === 'ricochet' && b.bounces! > 0 && (b.x <= 0 || b.x >= canvas.width)) { b.vx = -b.vx; b.bounces!--; }
          if (b.y < -50 || b.y > canvas.height + 50) state.bullets.splice(i, 1);
      }

      // Drops
      for (let i = state.drops.length - 1; i >= 0; i--) {
          const d = state.drops[i];
          d.y += d.vy;
          if (d.x > state.player.x && d.x < state.player.x + state.player.w && d.y > state.player.y && d.y < state.player.y + state.player.h) {
              applyDropBuff(d.type); state.drops.splice(i, 1);
          } else if (d.y > canvas.height) state.drops.splice(i, 1);
      }

      // Enemies
      for (let i = state.enemies.length - 1; i >= 0; i--) {
          const e = state.enemies[i];
          
          if (e.type === 'boss') {
              if (e.y < e.targetY) e.y += 2;
              e.x = e.startX + Math.sin(state.frames / 60) * 100;

              // == FINAL BOSS LOGIC ==
              if (e.isFinalBoss) {
                  const pct = e.hp / e.maxHp;
                  
                  // Phase 2 Transition
                  if (pct < 0.66 && e.bossStage === 1) {
                      e.bossStage = 2; e.invulnerable = true; setTimeout(() => e.invulnerable=false, 2000);
                      spawnMinionsForBoss(false);
                  }
                  
                  // Phase 3 Transition (Sucking & Laser)
                  if (pct < 0.33 && e.bossStage === 2) {
                      e.bossStage = 3; 
                      e.invulnerable = true; 
                      e.sucking = true; 
                      
                      // Limpar buffs VISUALMENTE na UI
                      setActiveBuffs([]); 
                      
                      // Resetar status do player
                      state.player.bulletType = 'normal'; 
                      state.player.multishot = 1;
                      state.player.speed = 5;

                      // ANIMAÇÃO DE SUGAR: Partículas saem do player e vão para o boss
                      for(let k=0; k<30; k++) {
                          const px = state.player.x + state.player.w/2;
                          const py = state.player.y + state.player.h/2;
                          const bx = e.x + e.w/2;
                          const by = e.y + e.h/2;
                          
                          // Vetor direção
                          const dx = bx - px;
                          const dy = by - py;
                          const dist = Math.sqrt(dx*dx + dy*dy);
                          
                          state.particles.push({
                              x: px + (Math.random()-0.5)*40, 
                              y: py + (Math.random()-0.5)*40, 
                              vx: (dx/dist) * 15, // Alta velocidade em direção ao boss
                              vy: (dy/dist) * 15, 
                              life: 1.5, // Vida suficiente para chegar lá
                              color: '#00f3ff', 
                              isSuck: true
                          });
                      }
                      
                      setTimeout(() => {
                          e.sucking = false;
                          e.invulnerable = false;
                          spawnDrop(e.x + e.w/2, e.y + e.h, 'laser'); 
                          spawnMinionsForBoss(true); // Minions agressivos
                      }, 2000);
                  }

                  // Shooting Logic Final Boss
                  if (state.frames % 50 === 0 && !e.invulnerable && !e.sucking) {
                      // Fase 1 & 2: Padrão
                      spawnBullet(e.x + e.w/2, e.y + e.h, true, 0); 
                      spawnBullet(e.x, e.y + e.h, true, -0.2); 
                      spawnBullet(e.x + e.w, e.y + e.h, true, 0.2);

                      // Fase 3: Tiro rapido mirado
                      if (e.bossStage === 3) {
                          spawnAimedBullet(e.x + e.w/2, e.y + e.h);
                      }
                  }

              } else {
                  // == NORMAL BOSS LOGIC (1 & 2) ==
                  
                  // Tiro triplo básico a cada X frames
                  if (state.frames % 50 === 0) {
                      spawnBullet(e.x + e.w/2, e.y + e.h, true, Math.sin(state.frames/20));
                      spawnBullet(e.x + e.w/2, e.y + e.h, true, -Math.sin(state.frames/20));
                      spawnBullet(e.x + e.w/2, e.y + e.h, true, 0);
                  }
                  // Ataque especial em anel (Restaurado)
                  if (state.frames % 120 === 0) {
                       for(let k=0; k<8; k++) spawnBullet(e.x + e.w/2, e.y + e.h/2, true, (Math.PI*2/8)*k);
                  }
              }

          } else {
              // Basic Enemies Behavior
              if (e.y < e.targetY) {
                  e.y += 3;
              } else {
                  e.x += Math.sin((state.frames + e.id*100) / 40) * 2;
                  if (e.x < 0) e.x = 0;
                  if (e.x > canvas.width - e.w) e.x = canvas.width - e.w;
              }
              
              // Shooters Normais
              if (e.type === 'shooter' && Math.random() < 0.02) {
                  spawnBullet(e.x + e.w/2, e.y + e.h, true);
              }
              
              // Tanks & Minions Fase 3 Boss (Mais agressivos)
              if (e.type === 'tank' && Math.random() < 0.03) {
                  // Se estamos na fase final (Boss ativo), eles miram
                  if (state.bossActive && state.enemies.find(en => en.isFinalBoss)?.bossStage === 3) {
                       spawnAimedBullet(e.x + e.w/2, e.y + e.h);
                  } else {
                       // Comportamento padrão (V)
                       spawnBullet(e.x + e.w/2, e.y + e.h, true, 0.2);
                       spawnBullet(e.x + e.w/2, e.y + e.h, true, -0.2);
                  }
              }
          }

          if (!e.invulnerable) {
            const playerBullets = state.bullets.filter(b => b.type !== 'enemy');
            for (let b of playerBullets) {
                if (b.x > e.x && b.x < e.x + e.w && b.y > e.y && b.y < e.y + e.h) {
                    e.hp -= b.damage;
                    createExplosion(b.x, b.y, '#ffff00', 3);
                    if (b.type === 'electric') {
                        e.electrifiedTimer = 120;
                    }
                    const bIdx = state.bullets.indexOf(b); if (bIdx > -1) state.bullets.splice(bIdx, 1);
                    checkEnemyDeath(e);
                    break; 
                }
            }
          }

          if (!e.invulnerable && state.player.x < e.x + e.w && state.player.x + state.player.w > e.x && state.player.y < e.y + e.h && state.player.h + state.player.y > e.y) {
              takeDamage();
              createExplosion(state.player.x, state.player.y, '#ff0000', 10);
              if (e.type !== 'boss') state.enemies.splice(i, 1);
          }
      }

      function checkEnemyDeath(e: Enemy) {
          if (e.hp <= 0) {
              createExplosion(e.x + e.w/2, e.y + e.h/2, e.type==='boss'?'#ff0000':'#ff003c', 15);
              if (e.type !== 'boss') spawnDrop(e.x + e.w/2, e.y + e.h/2);
              
              const idx = state.enemies.indexOf(e);
              if (idx > -1) state.enemies.splice(idx, 1);
              
              addFloatingText(e.x, e.y, '+100', '#fff');
              setScore(s => s + (e.type === 'boss' ? 5000 : 100));

              if (e.type === 'boss') {
                  state.bossActive = false;
                  if (gameState.current.bossCount >= 3) {
                      setGameWon(true); setIsPlaying(false);
                  } else {
                      const options: BossBuffType[] = [];
                      const pool: BossBuffType[] = ['multishot', 'electric', 'ricochet', 'speed'];
                      while(options.length < 3) { const rand = pool[Math.floor(Math.random()*pool.length)]; if(!options.includes(rand)) options.push(rand); }
                      setBuffSelection(options);
                  }
              }
          }
      }

      state.enemies.forEach(e => {
          if (e.electrifiedTimer > 0) {
              e.electrifiedTimer--;
              if (e.electrifiedTimer % 20 === 0) {
                  e.hp -= 1;
                  state.enemies.forEach(n => { if(n.id !== e.id && Math.hypot(n.x-e.x, n.y-e.y) < 200) { n.hp -= 1; n.electrifiedTimer = 30; } });
                  checkEnemyDeath(e);
              }
          }
      });

      state.bullets.filter(b => b.type === 'enemy').forEach((b, i) => {
          if (b.x > state.player.x && b.x < state.player.x + state.player.w && b.y > state.player.y && b.y < state.player.y + state.player.h) {
              takeDamage();
              const idx = state.bullets.indexOf(b); if (idx > -1) state.bullets.splice(idx, 1);
          }
      });

      state.particles.forEach(p => { 
          p.x += p.vx; 
          p.y += p.vy; 
          
          // Efeito de sucção: Partículas diminuem conforme chegam no boss
          if (p.isSuck) {
              p.life -= 0.03; 
          } else {
              p.life -= 0.05; 
          }
      });
      state.particles = state.particles.filter(p => p.life > 0);
      state.texts.forEach(t => { t.y += t.vy; t.life -= 0.02; });
      state.texts = state.texts.filter(t => t.life > 0);
  };

  const takeDamage = () => {
      const p = gameState.current.player;
      if (p.shield > 0) { p.shield--; addFloatingText(p.x, p.y, 'BLOCKED', '#00f3ff'); }
      else { p.hp--; addFloatingText(p.x, p.y, '-1 HP', '#ff0000'); if (p.hp <= 0) { setGameOver(true); setIsPlaying(false); } }
  };

  const draw = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const state = gameState.current;

      ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'; ctx.lineWidth = 1;
      const offset = (state.frames * 2) % 40;
      for(let y=offset; y<canvas.height; y+=40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

      if (state.player.bulletType === 'laser' && (state.keys.space || state.touchShooting)) {
          ctx.shadowBlur = 20; ctx.shadowColor = '#ff0055'; ctx.fillStyle = '#ff0055';
          ctx.fillRect(state.player.x + state.player.w/2 - 5, 0, 10, state.player.y);
          ctx.fillStyle = '#fff'; ctx.fillRect(state.player.x + state.player.w/2 - 2, 0, 4, state.player.y);
      }

      drawPlayerShip(ctx, state.player);
      state.enemies.forEach(e => {
          if (e.type === 'boss') drawBoss(ctx, e);
          else drawEnemyShip(ctx, e);
          if (e.electrifiedTimer > 0) {
              state.enemies.forEach(n => { if(n.id !== e.id && Math.hypot(n.x-e.x, n.y-e.y) < 200) { ctx.beginPath(); ctx.moveTo(e.x+e.w/2, e.y+e.h/2); ctx.lineTo(n.x+n.w/2, n.y+n.h/2); ctx.strokeStyle = '#00f3ff'; ctx.lineWidth = 2; ctx.stroke(); } });
          }
      });
      state.drops.forEach(d => drawDrop(ctx, d));
      state.bullets.forEach(b => {
          ctx.shadowColor = b.type === 'enemy' ? '#ff0000' : (b.type === 'electric' ? '#00f3ff' : '#ffff00');
          ctx.fillStyle = ctx.shadowColor; ctx.fillRect(b.x-2, b.y, 4, 10);
      });
      state.particles.forEach(p => {
          ctx.shadowColor = p.color; ctx.fillStyle = p.color; ctx.globalAlpha = p.life;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.isSuck ? 3 : 2, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1;
      });
      state.texts.forEach(txt => { ctx.fillStyle = txt.color; ctx.font = '12px monospace'; ctx.fillText(txt.text, txt.x, txt.y); });
      if (state.joystick.active) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'; ctx.beginPath(); ctx.arc(state.joystick.originX, state.joystick.originY, 40, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = 'rgba(0, 243, 255, 0.5)'; ctx.beginPath(); ctx.arc(state.joystick.curX, state.joystick.curY, 15, 0, Math.PI*2); ctx.fill();
      }
  };

  const loop = () => { if (isPlaying && !buffSelection && !gameWon) { update(); draw(); requestRef.current = requestAnimationFrame(loop); } };
  useEffect(() => { if (isPlaying) requestRef.current = requestAnimationFrame(loop); return () => cancelAnimationFrame(requestRef.current!); }, [isPlaying, buffSelection, gameWon]);

  useEffect(() => {
    const kd = (e: KeyboardEvent) => { 
        const k = gameState.current.keys;
        if(e.code==='KeyW'||e.code==='ArrowUp') k.w=true; 
        if(e.code==='KeyA'||e.code==='ArrowLeft') k.a=true; 
        if(e.code==='KeyS'||e.code==='ArrowDown') k.s=true; 
        if(e.code==='KeyD'||e.code==='ArrowRight') k.d=true; 
        if(e.code==='Space') k.space=true; 
    };
    const ku = (e: KeyboardEvent) => { 
        const k = gameState.current.keys;
        if(e.code==='KeyW'||e.code==='ArrowUp') k.w=false; 
        if(e.code==='KeyA'||e.code==='ArrowLeft') k.a=false; 
        if(e.code==='KeyS'||e.code==='ArrowDown') k.s=false; 
        if(e.code==='KeyD'||e.code==='ArrowRight') k.d=false; 
        if(e.code==='Space') k.space=false; 
    };
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    const rs = () => { if(containerRef.current && canvasRef.current) { canvasRef.current.width = containerRef.current.clientWidth; canvasRef.current.height = containerRef.current.clientHeight; }};
    window.addEventListener('resize', rs); rs();
    const hs = localStorage.getItem('neonHighScore'); if(hs) setHighScore(parseInt(hs));
    return () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); window.removeEventListener('resize', rs); };
  }, []);

  const handleTouch = (e: React.TouchEvent, type: 'start'|'move'|'end') => {
      if (type === 'start') e.preventDefault();
      const rect = canvasRef.current!.getBoundingClientRect();
      const touches = e.changedTouches;
      const j = gameState.current.joystick;
      for(let i=0; i<touches.length; i++) {
          const t = touches[i]; const x = t.clientX - rect.left; const y = t.clientY - rect.top;
          if (type === 'start') { if (x < rect.width/2) { j.active=true; j.originX=x; j.originY=y; j.curX=x; j.curY=y; } else gameState.current.touchShooting = true; }
          else if (type === 'move' && j.active && x < rect.width/2) { const max = 40; let dx = x - j.originX; let dy = y - j.originY; const dist = Math.sqrt(dx*dx + dy*dy); if (dist > max) { const a = Math.atan2(dy, dx); dx = Math.cos(a)*max; dy = Math.sin(a)*max; } j.curX = j.originX + dx; j.curY = j.originY + dy; j.vecX = dx/max; j.vecY = dy/max; }
          else if (type === 'end') { if (x < rect.width/2) { j.active=false; j.vecX=0; j.vecY=0; } else gameState.current.touchShooting = false; }
      }
  };

  const getBuffIcon = (type: AllBuffs) => {
      switch(type) {
          case 'damage': return <Crosshair size={16} className="text-red-500" />;
          case 'health': return <Heart size={16} className="text-pink-500" />;
          case 'shield': return <Shield size={16} className="text-blue-500" />;
          case 'electric': return <Zap size={16} className="text-yellow-400" />;
          case 'multishot': return <ChevronsUp size={16} className="text-green-500" />;
          case 'rapidfire': return <Activity size={16} className="text-yellow-300" />;
          case 'laser': return <Flame size={16} className="text-rose-500" />;
          default: return <Plus size={16} className="text-white" />;
      }
  };

  return (
    <div ref={containerRef} className={`relative rounded-xl overflow-hidden border border-neon-blue/20 bg-slate-950 shadow-[0_0_50px_rgba(0,243,255,0.05)] ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full h-[500px]'}`}>
      <canvas ref={canvasRef} className="block w-full h-full touch-none" onTouchStart={e => handleTouch(e, 'start')} onTouchMove={e => handleTouch(e, 'move')} onTouchEnd={e => handleTouch(e, 'end')} />
      <div className="absolute top-0 left-0 w-full p-4 pointer-events-none flex flex-col gap-2">
          <div className="flex justify-between items-start">
             <div className="flex gap-2">
                <div className="bg-slate-900/80 p-2 rounded border border-white/10 text-white font-mono text-xl">{score.toString().padStart(5,'0')}</div>
                <div className="bg-slate-900/80 p-2 rounded border border-white/10 text-neon-blue font-mono text-sm flex items-center gap-1">WAVE {wave}</div>
             </div>
             <div className="flex gap-2 pointer-events-auto">
                 <button onClick={toggleFullscreen} className="p-2 bg-slate-800 text-white rounded"><Maximize2 size={16} /></button>
             </div>
          </div>
          {activeBuffs.length > 0 && <div className="flex gap-1 flex-wrap">{activeBuffs.map((b, i) => <div key={i} className="bg-slate-800/80 p-1 rounded border border-white/5" title={t.buffs[b as keyof typeof t.buffs]}>{getBuffIcon(b)}</div>)}</div>}
      </div>
      
      {/* Mensagem de Rotação (Apenas mobile em portrait fullscreen) */}
      {showRotateMessage && (
          <div className="absolute inset-0 bg-slate-950/90 z-40 flex flex-col items-center justify-center text-center p-6 animate-in fade-in">
              <Smartphone size={64} className="text-neon-blue mb-4 animate-bounce" />
              <h2 className="text-2xl font-bold text-white mb-2">Gire seu celular</h2>
              <p className="text-slate-400">Para melhor experiência, jogue na horizontal.</p>
          </div>
      )}

      {bossWarning && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="bg-red-500/20 w-full py-4 text-center"><h2 className="text-4xl font-black text-red-500 animate-pulse tracking-widest">{bossWarning}</h2></div></div>}
      {buffSelection && <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center z-20 animate-in fade-in"><h2 className="text-3xl font-bold text-white mb-8">{t.chooseUpgrade}</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 w-full max-w-4xl">{buffSelection.map((buff, idx) => <button key={idx} onClick={() => applyBossBuff(buff)} className="bg-slate-900 border border-neon-blue/30 p-6 rounded-xl hover:bg-slate-800 hover:scale-105 transition-all group flex flex-col items-center gap-4"><div className="p-4 bg-slate-950 rounded-full group-hover:shadow-[0_0_20px_rgba(0,243,255,0.3)]">{getBuffIcon(buff)}</div><div className="text-xl font-bold text-white">{t.buffs[buff as keyof typeof t.buffs]}</div></button>)}</div></div>}
      {(!isPlaying || gameWon) && <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-10"><div className="text-center max-w-lg px-6">{gameWon ? <><h2 className="text-5xl font-bold text-neon-green mb-4 tracking-tighter">{t.gameWonTitle}</h2><div className="text-white text-lg mb-8 leading-relaxed font-mono border border-neon-green/30 p-6 rounded-lg bg-green-950/30">{t.gameWonMessage}</div><div className="text-2xl font-bold text-white mb-8">FINAL SCORE: {score}</div></> : <><h2 className="text-5xl font-bold text-white mb-4">{t.readyTitle}</h2>{gameOver && <div className="text-red-500 text-2xl font-bold mb-4">{t.gameOverTitle} - SCORE: {score}</div>}</>}<button onClick={initGame} className="px-8 py-4 bg-neon-blue text-black font-bold text-xl rounded hover:scale-105 transition-all w-full flex items-center justify-center gap-2"><Play size={24} fill="black" /> {gameOver || gameWon ? t.btnRetry : t.btnStart}</button></div></div>}
    </div>
  );
};

export default NeonGame;