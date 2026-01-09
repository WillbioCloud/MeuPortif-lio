import React, { useEffect, useRef, useState } from 'react';
import { translations } from '../translations';
import { Language } from '../types';

interface NeonGameProps {
  language: Language;
}

// Tipos internos do jogo
interface Entity {
  x: number;
  y: number;
  radius: number;
}

interface Player extends Entity {
  color: string;
  angle: number;
}

interface Enemy extends Entity {
  id: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  speed: number;
}

interface Orb extends Entity {
  id: number;
  type: 'score' | 'ammo' | 'buff';
  vx: number;
  vy: number;
  life: number;
}

interface Bullet extends Entity {
  id: number;
  vx: number;
  vy: number;
  life: number;
}

interface Particle extends Entity {
  id: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const NeonGame: React.FC<NeonGameProps> = ({ language }) => {
  const t = translations[language].game;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [ammo, setAmmo] = useState(20); // Começa com 20 balas
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Refs para estado mutável dentro do loop de animação
  const gameState = useRef({
    player: { x: 0, y: 0, radius: 12, color: '#ffffff', angle: 0 },
    enemies: [] as Enemy[],
    orbs: [] as Orb[],
    bullets: [] as Bullet[],
    particles: [] as Particle[],
    score: 0,
    ammo: 20,
    frames: 0,
    buffActive: false,
    buffTimer: 0,
    mouse: { x: 0, y: 0 },
    difficultyMultiplier: 1
  });

  // Sons sintéticos (Web Audio API)
  const audioCtx = useRef<AudioContext | null>(null);

  const playSound = (type: 'shoot' | 'hit' | 'collect' | 'gameover' | 'buff') => {
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = audioCtx.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    
    if (type === 'shoot') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'hit') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'collect') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(1200, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'buff') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(800, now + 0.5);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  };

  const createExplosion = (x: number, y: number, color: string, count: number = 8) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      gameState.current.particles.push({
        id: Math.random(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        radius: Math.random() * 3 + 1,
        color
      });
    }
  };

  const spawnEnemy = (canvas: HTMLCanvasElement) => {
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x = 0, y = 0;
    const padding = 50;

    switch(side) {
      case 0: x = Math.random() * canvas.width; y = -padding; break;
      case 1: x = canvas.width + padding; y = Math.random() * canvas.height; break;
      case 2: x = Math.random() * canvas.width; y = canvas.height + padding; break;
      case 3: x = -padding; y = Math.random() * canvas.height; break;
    }

    // Dificuldade escala com o tempo
    const mult = gameState.current.difficultyMultiplier;
    
    gameState.current.enemies.push({
      id: Math.random(),
      x,
      y,
      vx: 0,
      vy: 0,
      radius: 15 + (Math.random() * 10),
      hp: 3 * mult, // HP aumenta com o tempo
      maxHp: 3 * mult,
      speed: (1.5 + Math.random()) * (1 + (mult * 0.1)) // Velocidade aumenta
    });
  };

  // Função de Tiro
  const shoot = () => {
    if (gameState.current.ammo <= 0 && !gameState.current.buffActive) return;

    const { player, enemies } = gameState.current;
    
    // Encontrar inimigo mais próximo (Auto-Aim leve)
    let target = null;
    let minDist = Infinity;

    enemies.forEach(enemy => {
      const dx = enemy.x - player.x;
      const dy = enemy.y - player.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < minDist) {
        minDist = dist;
        target = enemy;
      }
    });

    let angle = 0;
    if (target && minDist < 400) { // Mira automática se < 400px
      angle = Math.atan2(target.y - player.y, target.x - player.x);
    } else {
      // Se não tiver inimigo perto, atira na direção do movimento ou mouse
      // Simplesmente atira para cima se parado, ou direção aleatória
      angle = gameState.current.player.angle; 
    }

    // Consumir munição (se não tiver buff)
    if (!gameState.current.buffActive) {
      gameState.current.ammo--;
      setAmmo(gameState.current.ammo);
    }

    const speed = 12;
    gameState.current.bullets.push({
      id: Math.random(),
      x: player.x,
      y: player.y,
      radius: 4,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 60 // frames de vida
    });

    playSound('shoot');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajuste de tamanho
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = isFullscreen ? window.innerHeight : 500;
        
        // Centralizar player no reset
        if (!isPlaying) {
          gameState.current.player.x = canvas.width / 2;
          gameState.current.player.y = canvas.height / 2;
        }
      }
    };
    window.addEventListener('resize', resize);
    resize();

    let animationFrameId: number;

    const render = () => {
      // Limpar tela com rastro (motion trail)
      ctx.fillStyle = 'rgba(5, 5, 7, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isPlaying) {
        const state = gameState.current;
        state.frames++;
        
        // Aumentar dificuldade a cada 10 segundos (600 frames)
        if (state.frames % 600 === 0) {
          state.difficultyMultiplier += 0.2;
        }

        // Lógica do Buff
        if (state.buffActive) {
            state.buffTimer--;
            state.player.color = `hsl(${state.frames * 10}, 100%, 70%)`; // Rainbow effect
            if (state.buffTimer <= 0) {
                state.buffActive = false;
                state.player.color = '#ffffff';
            }
        }

        // Movimento do Jogador (Seguir mouse com delay suave)
        const dx = state.mouse.x - state.player.x;
        const dy = state.mouse.y - state.player.y;
        state.player.x += dx * 0.08;
        state.player.y += dy * 0.08;
        state.player.angle = Math.atan2(dy, dx); // Guarda angulo do movimento

        // --- ATUALIZAÇÃO DE ENTIDADES ---

        // 1. Balas
        for (let i = state.bullets.length - 1; i >= 0; i--) {
          const b = state.bullets[i];
          b.x += b.vx;
          b.y += b.vy;
          b.life--;

          // Desenhar Bala
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fillStyle = state.buffActive ? '#ffd700' : '#00f3ff';
          ctx.shadowBlur = 10;
          ctx.shadowColor = ctx.fillStyle;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Colisão Bala vs Inimigo
          for (let j = state.enemies.length - 1; j >= 0; j--) {
            const e = state.enemies[j];
            const dist = Math.hypot(b.x - e.x, b.y - e.y);
            if (dist < e.radius + b.radius) {
                // Hit!
                playSound('hit');
                createExplosion(b.x, b.y, '#00f3ff', 3);
                e.hp -= state.buffActive ? 5 : 1; // Dano triplo com buff
                state.bullets.splice(i, 1); // Remove bala
                
                // Piscar inimigo
                ctx.fillStyle = '#fff';
                ctx.fill();

                if (e.hp <= 0) {
                    // Inimigo morreu
                    createExplosion(e.x, e.y, '#ff0055', 12);
                    state.enemies.splice(j, 1);
                    state.score += 50;
                    setScore(state.score);

                    // Chance de dropar BUFF (10%) ou ORBE (30%)
                    const rand = Math.random();
                    if (rand < 0.1) {
                         state.orbs.push({ id: Math.random(), x: e.x, y: e.y, type: 'buff', vx: 0, vy: 0, life: 600 });
                    } else if (rand < 0.4) {
                         // Dropa munição
                         state.orbs.push({ id: Math.random(), x: e.x, y: e.y, type: 'ammo', vx: 0, vy: 0, life: 400 });
                    }
                }
                break; // Bala bateu em um, para de checar outros
            }
          }

          if (b.life <= 0) state.bullets.splice(i, 1);
        }

        // 2. Inimigos
        // Spawn rate based on difficulty
        const spawnRate = Math.max(20, 60 - (state.difficultyMultiplier * 5));
        if (state.frames % Math.floor(spawnRate) === 0) spawnEnemy(canvas);

        state.enemies.forEach((enemy, index) => {
          // Perseguir player
          const angle = Math.atan2(state.player.y - enemy.y, state.player.x - enemy.x);
          enemy.x += Math.cos(angle) * enemy.speed;
          enemy.y += Math.sin(angle) * enemy.speed;

          // Desenhar Inimigo
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#ff0055';
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#ff0055';
          ctx.fill();
          ctx.shadowBlur = 0;
          
          // Barra de Vida
          if (enemy.hp < enemy.maxHp) {
            ctx.fillStyle = 'red';
            ctx.fillRect(enemy.x - 10, enemy.y - 20, 20, 3);
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(enemy.x - 10, enemy.y - 20, 20 * (enemy.hp / enemy.maxHp), 3);
          }

          // Colisão com Player (Game Over se não tiver invencivel)
          const dist = Math.hypot(state.player.x - enemy.x, state.player.y - enemy.y);
          if (dist < state.player.radius + enemy.radius) {
             if (state.buffActive) {
                 // Player atropela inimigo com buff
                 createExplosion(enemy.x, enemy.y, '#ff0055', 10);
                 state.enemies.splice(index, 1);
                 playSound('hit');
             } else {
                 setGameOver(true);
                 setIsPlaying(false);
                 playSound('gameover');
                 if (state.score > highScore) setHighScore(state.score);
             }
          }
        });

        // 3. Orbes (Score, Ammo, Buff)
        // Spawn natural de pontos
        if (state.frames % 100 === 0) {
            state.orbs.push({
                id: Math.random(),
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                type: 'score', // Verde normal
                vx: 0, vy: 0, life: 300
            });
        }

        for (let i = state.orbs.length - 1; i >= 0; i--) {
            const orb = state.orbs[i];
            
            ctx.beginPath();
            ctx.arc(orb.x, orb.y, 8, 0, Math.PI * 2);
            
            if (orb.type === 'ammo') {
                ctx.fillStyle = '#00f3ff'; // Ciano (Munição)
                ctx.shadowColor = '#00f3ff';
            } else if (orb.type === 'buff') {
                ctx.fillStyle = '#ffd700'; // Dourado (Buff)
                ctx.shadowColor = '#ffd700';
            } else {
                ctx.fillStyle = '#00ff9d'; // Verde (Score)
                ctx.shadowColor = '#00ff9d';
            }
            
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Texto indicativo
            if (orb.type === 'ammo') {
                 ctx.fillStyle = 'white';
                 ctx.font = '8px monospace';
                 ctx.fillText('AMMO', orb.x - 10, orb.y - 12);
            }

            // Colisão com Player
            const dist = Math.hypot(state.player.x - orb.x, state.player.y - orb.y);
            if (dist < state.player.radius + 15) {
                playSound('collect');
                
                if (orb.type === 'score') {
                    state.score += 10;
                    createExplosion(orb.x, orb.y, '#00ff9d', 5);
                } else if (orb.type === 'ammo') {
                    state.ammo += 10;
                    if (state.ammo > 50) state.ammo = 50; // Cap de munição
                    setAmmo(state.ammo);
                    createExplosion(orb.x, orb.y, '#00f3ff', 5);
                } else if (orb.type === 'buff') {
                    state.buffActive = true;
                    state.buffTimer = 600; // 10 segundos
                    playSound('buff');
                    createExplosion(orb.x, orb.y, '#ffd700', 15);
                }
                
                setScore(state.score);
                state.orbs.splice(i, 1);
            }
        }

        // 4. Partículas
        for (let i = state.particles.length - 1; i >= 0; i--) {
           const p = state.particles[i];
           p.x += p.vx;
           p.y += p.vy;
           p.life -= 0.05;
           
           ctx.globalAlpha = p.life;
           ctx.beginPath();
           ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
           ctx.fillStyle = p.color;
           ctx.fill();
           ctx.globalAlpha = 1;

           if (p.life <= 0) state.particles.splice(i, 1);
        }

        // 5. Player
        ctx.beginPath();
        ctx.arc(state.player.x, state.player.y, state.player.radius, 0, Math.PI * 2);
        ctx.fillStyle = state.player.color;
        ctx.shadowBlur = state.buffActive ? 30 : 20;
        ctx.shadowColor = state.player.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Mira do Player
        if (state.ammo > 0 || state.buffActive) {
             ctx.beginPath();
             ctx.arc(state.player.x, state.player.y, state.player.radius + 5, 0, Math.PI * 2 * (state.ammo / 50));
             ctx.strokeStyle = '#00f3ff';
             ctx.lineWidth = 2;
             ctx.stroke();
        }

      } else {
        // Tela de Menu / Game Over (desenha fundo estático animado)
        // ... (lógica simples de partículas flutuantes se quiser)
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      if (audioCtx.current) audioCtx.current.close();
    };
  }, [isPlaying, isFullscreen]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      gameState.current.mouse.x = e.clientX - rect.left;
      gameState.current.mouse.y = e.clientY - rect.top;
    }
  };

  const handleClick = () => {
     if (isPlaying) {
        shoot();
     }
  };

  const startGame = () => {
    gameState.current = {
      player: { x: canvasRef.current!.width / 2, y: canvasRef.current!.height / 2, radius: 12, color: '#ffffff', angle: 0 },
      enemies: [],
      orbs: [],
      bullets: [],
      particles: [],
      score: 0,
      ammo: 20,
      frames: 0,
      buffActive: false,
      buffTimer: 0,
      mouse: { x: 0, y: 0 },
      difficultyMultiplier: 1
    };
    setScore(0);
    setAmmo(20);
    setGameOver(false);
    setIsPlaying(true);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      canvasRef.current?.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  return (
    <div className="relative w-full h-[500px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl group cursor-crosshair">
      <canvas
        ref={canvasRef}
        className="block w-full h-full touch-none"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseDown={(e) => {
             // Previne seleção de texto ao clicar rápido
             if(e.detail > 1) e.preventDefault(); 
        }}
      />
      
      {/* HUD */}
      {isPlaying && (
        <div className="absolute top-4 left-4 right-4 flex justify-between font-mono text-sm pointer-events-none select-none">
          <div className="flex gap-4">
              <span className="text-neon-green drop-shadow-lg">SCORE: {score.toString().padStart(6, '0')}</span>
              <span className={`${gameState.current.buffActive ? 'text-yellow-400 animate-pulse' : 'text-neon-blue'}`}>
                 AMMO: {gameState.current.buffActive ? '∞' : ammo}
              </span>
          </div>
          <span className="text-slate-400">HI: {highScore.toString().padStart(6, '0')}</span>
        </div>
      )}

      {/* Buff Alert */}
      {isPlaying && gameState.current.buffActive && (
          <div className="absolute top-12 w-full text-center pointer-events-none">
              <span className="text-yellow-400 font-bold tracking-widest text-xl animate-bounce drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">
                  OVERCHARGE ACTIVE!
              </span>
          </div>
      )}

      {/* Menus */}
      {(!isPlaying || gameOver) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10 p-6 text-center">
          <h3 className={`text-4xl md:text-6xl font-bold mb-2 ${gameOver ? 'text-red-500' : 'text-white'}`}>
            {gameOver ? t.gameOverTitle : t.readyTitle}
          </h3>
          
          {gameOver && (
            <p className="text-xl mb-6 font-mono text-neon-green">
              {t.gameOverScore}: {score}
            </p>
          )}

          <div className="flex flex-col gap-2 mb-8 text-sm text-slate-300 max-w-xs mx-auto">
             <div className="flex items-center gap-2 justify-center">
                <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_red]"></span>
                <span>{t.instructionAvoid} / Shoot</span>
             </div>
             <div className="flex items-center gap-2 justify-center">
                <span className="w-3 h-3 rounded-full bg-neon-green shadow-[0_0_10px_#00ff9d]"></span>
                <span>{t.instructionCollect} Points</span>
             </div>
             <div className="flex items-center gap-2 justify-center">
                <span className="w-3 h-3 rounded-full bg-neon-blue shadow-[0_0_10px_#00f3ff]"></span>
                <span>Blue = Ammo</span>
             </div>
             <div className="flex items-center gap-2 justify-center">
                <span className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_10px_gold]"></span>
                <span>Gold = Overcharge Buff</span>
             </div>
             <p className="mt-2 text-xs opacity-70">
                Click to Shoot • Mouse to Move
             </p>
          </div>

          <button 
            onClick={startGame}
            className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-neon-blue hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {gameOver ? t.btnRetry : t.btnStart}
          </button>
          
          {!isFullscreen && (
            <button 
                onClick={toggleFullscreen}
                className="mt-4 text-xs text-slate-500 hover:text-white underline"
            >
                {t.fullscreen}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NeonGame;