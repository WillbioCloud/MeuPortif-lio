import { Code2, Globe, Palette } from 'lucide-react';
import { Project, Service } from './types';

// ... (interfaces mantidas iguais) ...
interface TranslationData {
  // ... mantenha as interfaces anteriores iguais ...
  nav: {
    home: string;
    about: string;
    work: string;
    play: string;
    contact: string;
    cta: string;
  };
  hero: {
    badge: string;
    titleStart: string;
    titleHighlight: string;
    titleEnd: string;
    subtitle: string;
    ctaProject: string;
    ctaAbout: string;
    scroll: string;
  };
  about: {
    title: string;
    p1: string;
    p2: string;
    statExp: string;
    statExpLabel: string;
    statProj: string;
    statProjLabel: string;
  };
  skills: {
    title: string;
    subtitle: string;
  };
  projects: {
    title: string;
    ctaView: string;
    items: Project[];
  };
  services: {
    title: string;
    items: Service[];
  };
  game: {
    sectionTitle: string;
    sectionSubtitle: string;
    hudHi: string;
    gameOverTitle: string;
    gameOverScore: string;
    legendDodge: string;
    legendGet: string;
    readyTitle: string;
    instructionMove: string;
    instructionAvoid: string;
    instructionCollect: string;
    btnStart: string;
    btnRetry: string;
    fullscreen: string;
    exitFullscreen: string;
    pressEsc: string;
    entities: {
      chaser: string;
      energy: string;
    }
  };
  contact: {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    msgLabel: string;
    msgPlaceholder: string;
    btnSend: string;
  };
  footer: {
    rights: string;
  };
}

export const translations: Record<'en' | 'pt', TranslationData> = {
  en: {
    // ... (mantenha nav, hero, about, skills iguais) ...
    nav: {
      home: 'Home',
      about: 'About',
      work: 'Work',
      play: 'Play',
      contact: 'Contact',
      cta: "Let's Talk"
    },
    hero: {
      badge: 'AVAILABLE FOR FREELANCE WORK',
      titleStart: 'Building digital',
      titleHighlight: 'experiences',
      titleEnd: 'that matter.',
      subtitle: "I'm a Full Stack Engineer obsessed with performance, micro-interactions, and creating immersive web applications that leave a mark.",
      ctaProject: 'View Projects',
      ctaAbout: 'About Me',
      scroll: 'Scroll'
    },
    about: {
      title: 'More than just code.',
      p1: "With over 5 years of experience in the ever-evolving tech landscape, I bridge the gap between engineering and design. I don't just write clean code; I solve complex problems with creative solutions.",
      p2: 'Currently specializing in the React ecosystem (Next.js), Node.js backends, and creative WebGL implementations.',
      statExp: '5+',
      statExpLabel: 'YEARS EXPERIENCE',
      statProj: '50+',
      statProjLabel: 'PROJECTS SHIPPED'
    },
    skills: {
      title: 'Tech Stack',
      subtitle: 'Tools I use to create magic'
    },
    projects: {
      title: 'Selected Works',
      ctaView: 'Live Demo', // Mudado para Live Demo para fazer mais sentido
      items: [
        {
          id: '1',
          title: 'Setland Theme Park',
          description: 'Immersive digital platform for a theme park with interactive maps, 3D elements and real-time ticketing system.',
          tags: ['React', 'Spline 3D', 'Supabase', 'Tailwind'],
          imageUrl: 'https://res.cloudinary.com/dxplpg36m/image/upload/v1768596880/castelo_pdatlo.png',
          link: 'https://sitesetland.vercel.app/' // Adicione o link do setland aqui se tiver
        },
        {
          id: '2',
          title: 'Landing Page Cidade Inteligente', // NOME GENERICO - MUDE PARA O REAL
          description: 'High-conversion landing page with modern responsive design, optimized for SEO and maximum performance.',
          tags: ['React', 'Tailwind', 'Framer Motion', 'SEO'],
          imageUrl: 'https://res.cloudinary.com/dxplpg36m/image/upload/v1768597084/Captura_de_tela_2026-01-16_175711_gofacg.png',
          link: 'https://cidadeinteligentelanding.vercel.app/' // COLOQUE O LINK REAL AQUI
        },
        {
          id: '3',
          title: 'Smart City App',
          description: 'Mobile solution for smart city management, connecting citizens to public services with real-time reporting.',
          tags: ['React Native', 'Expo', 'Maps API', 'Supabase'],
          imageUrl: './assets/cidade-preview.jpg'
          // Sem link por enquanto
        },
        {
          id: '4', // Next ID
          title: 'Ollivander Bistrô & Café',
          description: 'A magical Harry Potter-themed experience featuring parallax scrolling, 3D interactive elements (Golden Snitch), and a custom map.',
          tags: ['React', 'Spline 3D', 'Tailwind', 'Framer Motion'],
          imageUrl: 'https://res.cloudinary.com/dxplpg36m/image/upload/v1768596776/Captura_de_tela_2026-01-16_175244_axmojq.png', // Placeholder
          link: 'https://ollivandercafe.vercel.app/'
        }
      ]
    },
    services: {
      title: 'Services',
      items: [
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
      ]
    },
    game: {
      sectionTitle: 'Take a Break',
      sectionSubtitle: 'Interact with the portfolio. Survive as long as you can.',
      hudHi: 'HI',
      gameOverTitle: 'SYSTEM FAILURE',
      gameOverScore: 'Final Score',
      legendDodge: 'Dodge Red',
      legendGet: 'Get Green',
      readyTitle: 'READY PILOT?',
      instructionMove: 'Move cursor to evade.',
      instructionAvoid: 'Avoid',
      instructionCollect: 'Collect',
      btnStart: 'INITIATE',
      btnRetry: 'REBOOT SYSTEM',
      fullscreen: 'Fullscreen',
      exitFullscreen: 'Exit Fullscreen',
      pressEsc: 'Press ESC to exit fullscreen',
      entities: {
        chaser: 'Chasers',
        energy: 'Energy'
      }
    },
    contact: {
      title: 'Ready to start?',
      subtitle: "I'm currently available for freelance projects and open to full-time opportunities.",
      nameLabel: 'Name',
      namePlaceholder: 'John Doe',
      emailLabel: 'Email',
      emailPlaceholder: 'john@example.com',
      msgLabel: 'Message',
      msgPlaceholder: 'Tell me about your project...',
      btnSend: 'Send Message'
    },
    footer: {
      rights: 'All rights reserved.'
    }
  },
  pt: {
    nav: {
      home: 'Início',
      about: 'Sobre',
      work: 'Projetos',
      play: 'Jogar',
      contact: 'Contato',
      cta: "Vamos Conversar"
    },
    hero: {
      badge: 'DISPONÍVEL PARA FREELANCE',
      titleStart: 'Criando experiências',
      titleHighlight: 'digitais',
      titleEnd: 'que importam.',
      subtitle: "Sou um Engenheiro Full Stack obcecado por performance, micro-interações e criação de aplicações web imersivas que deixam uma marca.",
      ctaProject: 'Ver Projetos',
      ctaAbout: 'Sobre Mim',
      scroll: 'Role'
    },
    about: {
      title: 'Mais que apenas código.',
      p1: "Com mais de 5 anos de experiência no cenário tecnológico em constante evolução, conecto a engenharia ao design. Eu não apenas escrevo código limpo; resolvo problemas complexos com soluções criativas.",
      p2: 'Atualmente especializado no ecossistema React (Next.js), backends em Node.js e implementações criativas em WebGL.',
      statExp: '5+',
      statExpLabel: 'ANOS DE EXPERIÊNCIA',
      statProj: '50+',
      statProjLabel: 'PROJETOS ENTREGUES'
    },
    skills: {
      title: 'Stack Tecnológica',
      subtitle: 'Ferramentas que uso para criar mágica'
    },
    projects: {
      title: 'Trabalhos Selecionados',
      ctaView: 'Ver Online', // Alterado para indicar que vai abrir o site
      items: [
        {
          id: '1',
          title: 'Setland Theme Park',
          description: 'Plataforma digital imersiva para um parque temático, com integração de mapas interativos, elementos 3D e sistema de tickets.',
          tags: ['React', 'Spline 3D', 'Supabase', 'Tailwind'],
          imageUrl: 'https://res.cloudinary.com/dxplpg36m/image/upload/v1768596880/castelo_pdatlo.png',
          link: 'https://sitesetland.vercel.app/' // Coloque o link se tiver
        },
        {
          id: '2',
          title: 'Landing Page Cidade Inteligente',
          description: 'Landing page de alta conversão com design responsivo moderno, otimizada para SEO e performance máxima.',
          tags: ['React', 'Tailwind', 'Framer Motion', 'SEO'],
          imageUrl: 'https://res.cloudinary.com/dxplpg36m/image/upload/v1768597084/Captura_de_tela_2026-01-16_175711_gofacg.png',
          link: 'https://cidadeinteligentelanding.vercel.app/' // IMPORTANTE: Coloque o link real aqui
        },
        {
          id: '3',
          title: 'Cidade Inteligente App',
          description: 'Solução mobile para gestão de cidades inteligentes, conectando cidadãos a serviços públicos com reportes em tempo real.',
          tags: ['React Native', 'Expo', 'Maps API', 'Supabase'],
          imageUrl: './assets/cidade-preview.jpg'
          // Sem link propositalmente
        },
        {
          id: '4',
          title: 'Ollivander Bistrô & Café',
          description: 'Uma experiência mágica com temática de Harry Potter, apresentando rolagem parallax, elementos 3D interativos (Pomo de Ouro) e mapa personalizado.',
          tags: ['React', 'Spline 3D', 'Tailwind', 'Framer Motion'],
          imageUrl: 'https://res.cloudinary.com/dxplpg36m/image/upload/v1768596776/Captura_de_tela_2026-01-16_175244_axmojq.png', // Placeholder
          link: 'https://ollivandercafe.vercel.app/'
        }
      ]
    },
    services: {
      title: 'Serviços',
      items: [
        {
          title: 'Engenharia Frontend',
          description: 'Construção de interfaces pixel-perfect, performáticas e acessíveis usando o ecossistema React moderno.',
          icon: Code2
        },
        {
          title: 'Soluções Full Stack',
          description: 'Desenvolvimento de ponta a ponta com APIs robustas e arquiteturas de banco de dados escaláveis.',
          icon: Globe
        },
        {
          title: 'Interação Criativa',
          description: 'Experiências web imersivas com WebGL, animações avançadas e micro-interações.',
          icon: Palette
        }
      ]
    },
    game: {
      sectionTitle: 'Pausa para o Café',
      sectionSubtitle: 'Interaja com o portfólio. Sobreviva o máximo que puder.',
      hudHi: 'RECORD',
      gameOverTitle: 'FALHA NO SISTEMA',
      gameOverScore: 'Pontuação Final',
      legendDodge: 'Desvie do Vermelho',
      legendGet: 'Pegue o Verde',
      readyTitle: 'PRONTO PILOTO?',
      instructionMove: 'Mova o cursor para desviar.',
      instructionAvoid: 'Evite',
      instructionCollect: 'Colete',
      btnStart: 'INICIAR',
      btnRetry: 'REINICIAR',
      fullscreen: 'Tela Cheia',
      exitFullscreen: 'Sair da Tela Cheia',
      pressEsc: 'Pressione ESC para sair da tela cheia',
      entities: {
        chaser: 'Perseguidores',
        energy: 'Energia'
      }
    },
    contact: {
      title: 'Vamos começar?',
      subtitle: "Atualmente disponível para projetos freelance e aberto a oportunidades full-time.",
      nameLabel: 'Nome',
      namePlaceholder: 'Seu Nome',
      emailLabel: 'Email',
      emailPlaceholder: 'seu@email.com',
      msgLabel: 'Mensagem',
      msgPlaceholder: 'Conte sobre seu projeto...',
      btnSend: 'Enviar Mensagem'
    },
    footer: {
      rights: 'Todos os direitos reservados.'
    }
  }
};