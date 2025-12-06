import { Code2, Globe, Cpu, Palette, Database, Rocket } from 'lucide-react';
import { Project, Service, Skill } from './types';

export const NAV_LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Work', href: '#projects' },
  { name: 'Play', href: '#game' },
  { name: 'Contact', href: '#contact' },
];

export const SKILLS: Skill[] = [
  { name: 'React / Next.js', level: 95, icon: '⚛️' },
  { name: 'TypeScript', level: 90, icon: '📘' },
  { name: 'Node.js', level: 85, icon: '🟢' },
  { name: 'Tailwind CSS', level: 98, icon: '🎨' },
  { name: 'WebGL / Three.js', level: 70, icon: '🧊' },
  { name: 'PostgreSQL', level: 80, icon: '🐘' },
];

export const SERVICES: Service[] = [
  {
    title: 'Frontend Engineering',
    description: 'Building pixel-perfect, performant, and accessible user interfaces using modern React ecosystems.',
    icon: Code2
  },
  {
    title: 'Full Stack Solutions',
    description: 'End-to-end web application development with robust APIs and scalable database architectures.',
    icon: Globe
  },
  {
    title: 'Creative Interaction',
    description: 'Immersive web experiences with WebGL, animations, and micro-interactions.',
    icon: Palette
  }
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Nebula Dashboard',
    description: 'A futuristic analytics dashboard for crypto trading with real-time WebSocket data visualization.',
    tags: ['React', 'D3.js', 'WebSockets', 'Tailwind'],
    imageUrl: 'https://picsum.photos/600/400?random=1'
  },
  {
    id: '2',
    title: 'Aether Commerce',
    description: 'Headless e-commerce solution with AI-powered product recommendations and 3D product previews.',
    tags: ['Next.js', 'Stripe', 'Three.js', 'Node.js'],
    imageUrl: 'https://picsum.photos/600/400?random=2'
  },
  {
    id: '3',
    title: 'Chronos Task',
    description: 'AI-driven productivity tool that automatically schedules tasks based on energy levels.',
    tags: ['TypeScript', 'OpenAI API', 'Firebase', 'PWA'],
    imageUrl: 'https://picsum.photos/600/400?random=3'
  }
];
