import { LucideIcon } from "lucide-react";

export type Language = 'en' | 'pt';

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link?: string;
  videoUrl?: string; // Adicionado para suportar o vídeo
}

export interface Skill {
  name: string;
  level: number; // 0 to 100
  icon: string;
}

export interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface GameState {
  isPlaying: boolean;
  score: number;
  highScore: number;
  gameOver: boolean;
  lives: number;
}