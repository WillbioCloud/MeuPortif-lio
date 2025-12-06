import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, RotateCcw, Trophy, Heart, Zap } from 'lucide-react';
import { GameState } from '../types';

interface Entity {
  id: number;
  type: 'enemy' | 'chaser' | 'powerup';
  x: number;
  y: number;
  radius: number;
  color: string;
  velocity: { x: number; y: number };
  lifeTime?: number; // How long it has existed
  maxLifeTime?: number; // For chasers to explode
}

const NeonGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  
  // Game State
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    score: 0,
    highScore: 0,
    gameOver: false,
    lives: 3
  });

  // Refs for game loop (Mutable state for performance)
  const playerRef = useRef({ x: 0, y: 0, radius: 10, color: '#00f3ff', velocity: {x:0, y:0} });
  const mouseRef = useRef({ x: 0, y: 0 });
  const entitiesRef = useRef<Entity[]>([]);
  const particlesRef = useRef<{x: number, y: number, radius: number, color: string, velocity: {x:number, y:number}, life: number}[]>([]);
  
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const frameCountRef = useRef(0);
  const shakeRef = useRef(0); // Screen shake intensity
  const chaserActiveRef = useRef(false);
  const lastDamageTimeRef = useRef(0); // i-frames

  // Configuration
  const PLAYER_SPEED = 0.15;
  const STARTING_LIVES = 3;

  useEffect(() => {
    const savedScore = localStorage.getItem('neon-highscore');
    if (savedScore) {
      setGameState(prev => ({ ...prev, highScore: parseInt(savedScore) }));
    }
  }, []);

  const createExplosion = (x: number, y: number, color: string, count: number = 8) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x, y,
        radius: Math.random() * 4,
        color: color,
        velocity: {
          x: (Math.random() - 0.5) * 12,
          y: (Math.random() - 0.5) * 12
        },
        life: 1.0
      });
    }
  };

  const spawnEntity = (width: number, height: number, type: 'enemy' | 'chaser' | 'powerup') => {
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x = 0, y = 0;
    
    // Determine spawn position (edge of screen)
    switch(side) {
      case 0: x = Math.random() * width; y = -30; break;
      case 1: x = width + 30; y = Math.random() * height; break;
      case 2: x = Math.random() * width; y = height + 30; break;
      case 3: x = -30; y = Math.random() * height; break;
    }

    const angle = Math.atan2(height/2 - y, width/2 - x);
    const difficultyMultiplier = 1 + (scoreRef.current / 1000); // Speed scales with score

    if (type === 'chaser') {
      entitiesRef.current.push({
        id: Math.random(),
        type: 'chaser',
        x, y,
        radius: 20,
        color: '#ff0000', // Bright Red
        velocity: { x: 0, y: 0 }, // Velocity is calculated in update loop
        lifeTime: 0,
        maxLifeTime: 400 + Math.random() * 200 // Frames until explosion
      });
      chaserActiveRef.current = true;
      shakeRef.current = 5; // Initial rumble
    } else if (type === 'powerup') {
      entitiesRef.current.push({
        id: Math.random(),
        type: 'powerup',
        x, y,
        radius: 12,
        color: '#00ff9d', // Neon Green
        velocity: {
          x: Math.cos(angle) * 3,
          y: Math.sin(angle) * 3
        }
      });
    } else {
      // Normal Enemy
      const speed = (3 + Math.random() * 4) * difficultyMultiplier;
      entitiesRef.current.push({
        id: Math.random(),
        type: 'enemy',
        x, y,
        radius: 8 + Math.random() * 6,
        color: '#ff0055',
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        }
      });
    }
  };

  const update = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- 1. Screen Clear & Effects ---
    // Calculate Shake
    let shakeX = 0;
    let shakeY = 0;
    if (shakeRef.current > 0) {
      shakeX = (Math.random() - 0.5) * shakeRef.current;
      shakeY = (Math.random() - 0.5) * shakeRef.current;
      shakeRef.current *= 0.9; // Decay shake
      if (shakeRef.current < 0.5) shakeRef.current = 0;
    }

    ctx.save();
    ctx.translate(shakeX, shakeY);

    // Background Color Logic (Red tint if Chaser exists)
    const hasChaser = entitiesRef.current.some(e => e.type === 'chaser');
    if (hasChaser) {
      ctx.fillStyle = 'rgba(40, 0, 0, 0.2)'; // Bloody trail
    } else {
      ctx.fillStyle = 'rgba(5, 5, 7, 0.3)'; // Normal trail
    }
    ctx.fillRect(-10, -10, canvas.width + 20, canvas.height + 20);

    // --- 2. Player Logic ---
    const dx = mouseRef.current.x - playerRef.current.x;
    const dy = mouseRef.current.y - playerRef.current.y;
    playerRef.current.x += dx * PLAYER_SPEED;
    playerRef.current.y += dy * PLAYER_SPEED;

    // Draw Player
    const isInvulnerable = (Date.now() - lastDamageTimeRef.current) < 1000;
    ctx.beginPath();
    ctx.arc(playerRef.current.x, playerRef.current.y, playerRef.current.radius, 0, Math.PI * 2);
    ctx.fillStyle = isInvulnerable ? '#ffffff' : playerRef.current.color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = playerRef.current.color;
    ctx.fill();
    ctx.shadowBlur = 0;

    // --- 3. Spawner Logic ---
    frameCountRef.current++;
    const scoreMult = Math.floor(scoreRef.current / 500);
    const spawnRate = Math.max(15, 60 - scoreMult * 5); // Caps at 15 frames
    
    if (frameCountRef.current % spawnRate === 0) {
      spawnEntity(canvas.width, canvas.height, 'enemy');
    }
    
    // Spawn Chaser periodically (rarer)
    if (frameCountRef.current % 900 === 0 && scoreRef.current > 200) {
       spawnEntity(canvas.width, canvas.height, 'chaser');
    }

    // Spawn PowerUp rarely
    if (frameCountRef.current % 1200 === 0) {
       spawnEntity(canvas.width, canvas.height, 'powerup');
    }

    // --- 4. Entity Update & Collision ---
    for (let i = entitiesRef.current.length - 1; i >= 0; i--) {
      const ent = entitiesRef.current[i];
      
      // Move Logic
      if (ent.type === 'chaser') {
         // Tracking logic
         const angle = Math.atan2(playerRef.current.y - ent.y, playerRef.current.x - ent.x);
         const chaserSpeed = 2 + (scoreRef.current / 2000); // Gets faster
         ent.velocity.x = Math.cos(angle) * chaserSpeed;
         ent.velocity.y = Math.sin(angle) * chaserSpeed;
         
         ent.lifeTime = (ent.lifeTime || 0) + 1;
         
         // Chaser Explosion (Self-Destruct)
         if (ent.maxLifeTime && ent.lifeTime > ent.maxLifeTime) {
             createExplosion(ent.x, ent.y, '#ffaa00', 20);
             entitiesRef.current.splice(i, 1);
             scoreRef.current += 100; // Bonus for surviving
             shakeRef.current = 10;
             continue;
         }
      }

      ent.x += ent.velocity.x;
      ent.y += ent.velocity.y;

      // Draw
      ctx.beginPath();
      ctx.arc(ent.x, ent.y, ent.radius, 0, Math.PI * 2);
      
      if (ent.type === 'chaser') {
          // Pulsing Effect
          const pulse = Math.sin(frameCountRef.current * 0.2) * 4;
          ctx.shadowBlur = 20 + pulse;
          ctx.shadowColor = ent.color;
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.fillStyle = ent.color;
          ctx.stroke();
      } else if (ent.type === 'powerup') {
          ctx.shadowBlur = 15;
          ctx.shadowColor = ent.color;
          ctx.fillStyle = '#ffffff'; // White core
          ctx.fill();
          ctx.beginPath();
          ctx.arc(ent.x, ent.y, ent.radius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = ent.color; // Green ring
          ctx.stroke();
      } else {
          ctx.shadowBlur = 10;
          ctx.shadowColor = ent.color;
          ctx.fillStyle = ent.color;
      }
      
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'transparent';

      // Off-screen removal
      if (ent.x < -50 || ent.x > canvas.width + 50 || ent.y < -50 || ent.y > canvas.height + 50) {
        entitiesRef.current.splice(i, 1);
        if (ent.type !== 'chaser') scoreRef.current += 10;
      }

      // Collision Detection
      const dist = Math.hypot(playerRef.current.x - ent.x, playerRef.current.y - ent.y);
      if (dist < playerRef.current.radius + ent.radius) {
         
         if (ent.type === 'powerup') {
             // HEAL
             livesRef.current = Math.min(livesRef.current + 1, 5);
             scoreRef.current += 50;
             createExplosion(ent.x, ent.y, '#00ff9d', 10);
             entitiesRef.current.splice(i, 1);
             // Trigger React update for HUD
             setGameState(prev => ({ ...prev, lives: livesRef.current }));
         } else {
             // DAMAGE
             if (!isInvulnerable) {
                 livesRef.current -= 1;
                 shakeRef.current = 15;
                 lastDamageTimeRef.current = Date.now();
                 createExplosion(ent.x, ent.y, '#ff0055', 15);
                 entitiesRef.current.splice(i, 1); // Destroy enemy that hit us
                 
                 // Trigger React update for HUD
                 setGameState(prev => ({ ...prev, lives: livesRef.current }));
                 
                 if (livesRef.current <= 0) {
                     gameOver();
                     ctx.restore();
                     return;
                 }
             }
         }
      }
    }

    // --- 5. Particles Update ---
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      p.x += p.velocity.x;
      p.y += p.velocity.y;
      p.life -= 0.05;
      
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.globalAlpha = 1;

      if (p.life <= 0) particlesRef.current.splice(i, 1);
    }

    ctx.restore();
    requestRef.current = requestAnimationFrame(update);
  }, []);

  const startGame = () => {
    scoreRef.current = 0;
    livesRef.current = STARTING_LIVES;
    entitiesRef.current = [];
    particlesRef.current = [];
    frameCountRef.current = 0;
    
    setGameState(prev => ({ 
        ...prev, 
        isPlaying: true, 
        gameOver: false, 
        score: 0,
        lives: STARTING_LIVES 
    }));
    
    if (canvasRef.current) {
        playerRef.current.x = canvasRef.current.width / 2;
        playerRef.current.y = canvasRef.current.height / 2;
    }

    requestRef.current = requestAnimationFrame(update);
  };

  const gameOver = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    createExplosion(playerRef.current.x, playerRef.current.y, '#00f3ff', 30);
    
    // Final render to show explosion
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
             particlesRef.current.forEach(p => {
                 ctx.beginPath();
                 ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                 ctx.fillStyle = p.color;
                 ctx.fill();
            });
        }
    }

    const newHighScore = Math.max(gameState.highScore, scoreRef.current);
    localStorage.setItem('neon-highscore', newHighScore.toString());

    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      gameOver: true,
      score: scoreRef.current,
      highScore: newHighScore
    }));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!gameState.isPlaying || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Sync React State score occasionally to avoid lag, or just use ref for canvas and state for end screen
  // We used a hybrid approach. State updates only on life change or game over.
  // Let's add an interval to update the visible score in React if we want a HUD
  useEffect(() => {
     if (!gameState.isPlaying) return;
     const interval = setInterval(() => {
         setGameState(prev => ({ ...prev, score: scoreRef.current }));
     }, 100); // 10fps update for UI score
     return () => clearInterval(interval);
  }, [gameState.isPlaying]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        canvasRef.current.width = canvasRef.current.parentElement.offsetWidth;
        canvasRef.current.height = canvasRef.current.parentElement.offsetHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div id="game" className="relative w-full h-[600px] bg-slate-900 overflow-hidden rounded-xl border border-slate-800 shadow-2xl my-20 group select-none">
       {/* UI HUD */}
       <div className="absolute top-4 left-6 z-10 pointer-events-none flex flex-col gap-2">
            <h2 className="text-2xl font-bold font-mono text-neon-blue drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">NEON EVASION V2</h2>
            
            <div className="flex items-center gap-1">
                 {Array.from({ length: Math.max(0, gameState.lives) }).map((_, i) => (
                    <Heart key={i} className="w-6 h-6 text-red-500 fill-red-500 animate-pulse" />
                 ))}
                 {Array.from({ length: Math.max(0, 5 - gameState.lives) }).map((_, i) => (
                    <Heart key={`lost-${i}`} className="w-6 h-6 text-slate-700" />
                 ))}
            </div>
       </div>

      <div className="absolute top-4 right-6 z-10 flex flex-col items-end gap-1 pointer-events-none">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="font-mono text-white opacity-80">HI: {gameState.highScore}</span>
          </div>
          <div className="text-4xl font-bold font-mono text-white tracking-widest">
            {gameState.score.toString().padStart(5, '0')}
          </div>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-none active:cursor-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
             // Auto-pause or game over if mouse leaves? Let's just pause movement
        }}
      />

      {(!gameState.isPlaying) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20 transition-all duration-300">
          
          {gameState.gameOver && (
            <div className="mb-8 text-center">
              <h3 className="text-5xl font-bold text-red-500 mb-2 glitch-text">SYSTEM FAILURE</h3>
              <p className="text-2xl text-white font-mono mb-4">Final Score: {gameState.score}</p>
              
              <div className="flex gap-4 justify-center text-sm text-slate-400">
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> Dodge Red</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-neon-green"></div> Get Green</div>
              </div>
            </div>
          )}

          {!gameState.gameOver && (
             <div className="mb-8 text-center max-w-md">
                <div className="w-20 h-20 bg-neon-blue/20 rounded-full blur-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                <h2 className="text-3xl font-bold text-white mb-4 relative">READY PILOT?</h2>
                <div className="space-y-2 text-slate-300 text-sm font-mono bg-slate-800/50 p-6 rounded-lg border border-white/10">
                    <p className="flex items-center gap-2"><div className="w-2 h-2 bg-neon-blue rounded-full"></div> Move cursor to evade.</p>
                    <p className="flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> Avoid <span className="text-red-400">Chasers</span> (they explode).</p>
                    <p className="flex items-center gap-2"><div className="w-2 h-2 bg-neon-green rounded-full"></div> Collect <span className="text-neon-green">Energy</span> for extra life.</p>
                </div>
           </div>
          )}

          <button
            onClick={startGame}
            className="group relative px-10 py-5 bg-transparent border-2 border-neon-blue text-neon-blue font-bold tracking-widest text-lg hover:bg-neon-blue hover:text-black transition-all duration-300 overflow-hidden rounded"
          >
            <div className="absolute inset-0 bg-neon-blue/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10 flex items-center gap-3">
              {gameState.gameOver ? <RotateCcw size={24} /> : <Play size={24} />}
              {gameState.gameOver ? 'REBOOT SYSTEM' : 'INITIATE'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default NeonGame;