import { Code2, Globe, Palette } from 'lucide-react';
import { Project, Service } from './types';

interface TranslationData {
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
    ctaQuote: string; // Texto do botão
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
    hudWave: string;
    gameOverTitle: string;
    gameWonTitle: string;
    gameWonMessage: string;
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
    bossWarning: string;
    finalBossWarning: string; // Novo
    chooseUpgrade: string;
    buffs: {
        multishot: string;
        rapidfire: string;
        damage: string;
        electric: string;
        ricochet: string;
        health: string;
        shield: string;
        speed: string;
        laser: string; // Novo
    };
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
    typeLabel: string;
    btnSend: string;
    btnQuote: string;
    quoteLabel: string;
    projectTypes: {
        placeholder: string;
        landing: string;
        institutional: string;
        ecommerce: string;
        app: string;
        system: string;
        other: string;
    };
  };
  footer: {
    rights: string;
  };
}

export const translations: Record<'en' | 'pt', TranslationData> = {
  en: {
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
      statProj: '10+',
      statProjLabel: 'PROJECTS SHIPPED'
    },
    skills: {
      title: 'Tech Stack',
      subtitle: 'Tools I use to create magic'
    },
    projects: {
      title: 'Selected Works',
      ctaView: 'Live Demo',
      ctaQuote: 'I want this',
      items: [
        {
          id: '1',
          title: 'Setland Park Temático',
          description: 'Immersive digital platform for a theme park with interactive maps, 3D elements and real-time ticketing system.',
          tags: ['React', 'Spline 3D', 'Supabase', 'Tailwind'],
          imageUrl: 'https://res.cloudinary.com/dxplpg36m/image/upload/v1768596880/castelo_pdatlo.png',
          link: 'https://sitesetland.vercel.app/',
          category: 'institutional'
        },
        {
          id: '2',
          title: 'Landing Page Cidade Inteligente',
          description: 'High-conversion landing page with modern responsive design, optimized for SEO and maximum performance.',
          tags: ['React', 'Tailwind', 'Framer Motion', 'SEO'],
          imageUrl: 'https://res.cloudinary.com/dxplpg36m/image/upload/v1768597084/Captura_de_tela_2026-01-16_175711_gofacg.png',
          link: 'https://cidadeinteligentelanding.vercel.app/',
          category: 'landing'
        },
        {
          id: '3',
          title: 'Smart City App',
          description: 'Mobile solution for smart city management, connecting citizens to public services with real-time reporting.',
          tags: ['React Native', 'Expo', 'Maps API', 'Supabase'],
          imageUrl: './assets/cidade-preview.jpg',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-monitor-close-up-1728-large.mp4',
          category: 'app'
        },
        {
          id: '4',
          title: 'Ollivander Bistrô & Café',
          description: 'A magical Harry Potter-themed experience featuring parallax scrolling, 3D interactive elements (Golden Snitch), and a custom map.',
          tags: ['React', 'Spline 3D', 'Tailwind', 'Framer Motion'],
          imageUrl: 'https://res.cloudinary.com/dxplpg36m/image/upload/v1768596776/Captura_de_tela_2026-01-16_175244_axmojq.png',
          link: 'https://ollivandercafe.vercel.app/',
          category: 'institutional'
        },
        {
          id: '5',
          title: 'Mestre das Pizzas',
          description: 'Complete e-commerce for an artisanal pizzeria, with pizza customization system, shopping cart, and WhatsApp sales integration.',
          tags: ['HTML', 'CSS', 'Framer Motion', 'JavaScript'],
          imageUrl: 'https://res.cloudinary.com/dxplpg36m/image/upload/v1769236665/Captura_de_tela_2026-01-24_033058_s7jrid.png',
          link: 'https://mestredaspizzas.vercel.app/',
          category: 'institutional'
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
      hudWave: 'WAVE',
      gameOverTitle: 'GAME OVER',
      gameWonTitle: 'MISSION ACCOMPLISHED',
      gameWonMessage: 'Thanks for visiting the site, and for playing Space Blasters!',
      gameOverScore: 'Final Score',
      legendDodge: 'Shoot Enemies',
      legendGet: 'Get Power-ups',
      readyTitle: 'Space Blasters',
      instructionMove: 'PC: WASD / Arrow Keys',
      instructionAvoid: 'Mobile: Left stick to Move',
      instructionCollect: 'Space or Tap right to Shoot',
      btnStart: 'START MISSION',
      btnRetry: 'PLAY AGAIN',
      fullscreen: 'Fullscreen',
      exitFullscreen: 'Exit Fullscreen',
      pressEsc: 'Press ESC to exit fullscreen',
      bossWarning: 'WARNING: MOTHERSHIP DETECTED',
      finalBossWarning: 'DANGER: DOOMSDAY CLASS SHIP',
      chooseUpgrade: 'CHOOSE YOUR UPGRADE',
      buffs: {
          multishot: 'Multi Shot',
          rapidfire: 'Rapid Fire',
          damage: 'Damage Up',
          electric: 'Electric Ammo',
          ricochet: 'Ricochet Ammo',
          health: 'Max HP +1',
          shield: 'Energy Shield',
          speed: 'Speed Up',
          laser: 'LASER BEAM'
      },
      entities: {
        chaser: 'Enemies',
        energy: 'Score'
      }
    },
    contact: {
      title: 'Ready to start?',
      subtitle: "Let's bring your ideas to life. Start a chat on WhatsApp.",
      nameLabel: 'Name',
      namePlaceholder: 'Your Name',
      typeLabel: 'Project Type',
      btnSend: 'Start WhatsApp Chat',
      btnQuote: 'Calculate Estimate',
      quoteLabel: 'Estimated Investment: ',
      projectTypes: {
          placeholder: 'Select a project type...',
          landing: 'Landing Page',
          institutional: 'Institutional Website',
          ecommerce: 'E-commerce',
          app: 'Mobile App',
          system: 'Web System / Dashboard',
          other: 'Other'
      }
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
      statProj: '10+',
      statProjLabel: 'PROJETOS ENTREGUES'
    },
    skills: {
      title: 'Stack Tecnológica',
      subtitle: 'Ferramentas que uso para criar mágica'
    },
    projects: {
      title: 'Trabalhos Selecionados',
      ctaView: 'Ver Online',
      ctaQuote: 'Quero um desse',
      items: [
        {
          id: '1',
          title: 'Setland Parque Temático',
          description: 'Plataforma digital imersiva para um parque temático, com integração de mapas interativos, elementos 3D e sistema de tickets.',
          tags: ['HTML', 'Spline 3D', 'Supabase', 'CSS'],
          imageUrl: 'https://res.cloudinary.com/dxplpg36m/image/upload/v1768596880/castelo_pdatlo.png',
          link: 'https://sitesetland.vercel.app/',
          category: 'institutional'
        },
        {
          id: '2',
          title: 'Landing Page Cidade Inteligente',
          description: 'Landing page de alta conversão com design responsivo moderno, otimizada para SEO e performance máxima.',
          tags: ['HTML', 'CSS', 'Framer Motion', 'SEO'],
          imageUrl: 'https://res.cloudinary.com/dxplpg36m/image/upload/v1768597084/Captura_de_tela_2026-01-16_175711_gofacg.png',
          link: 'https://cidadeinteligentelanding.vercel.app/',
          category: 'landing'
        },
        {
          id: '3',
          title: 'Cidade Inteligente App',
          description: 'Solução mobile para gestão de cidades inteligentes, conectando cidadãos a serviços públicos com reportes em tempo real.',
          tags: ['React Native', 'Expo', 'Maps API', 'Supabase'],
          imageUrl: './assets/cidade-preview.jpg',
          videoUrl: 'https://res.cloudinary.com/dxplpg36m/video/upload/v1768604952/ScreenRecording_07-28-2025_11-00-02_1_p0tdbr.mov',
          category: 'app'
        },
        {
          id: '4',
          title: 'Ollivander Bistrô & Café',
          description: 'Uma experiência mágica com temática de Harry Potter, apresentando rolagem parallax, elementos 3D interativos (Pomo de Ouro) e mapa personalizado.',
          tags: ['React', 'Spline 3D', 'Tailwind', 'Framer Motion'],
          imageUrl: 'https://res.cloudinary.com/dxplpg36m/image/upload/v1768596776/Captura_de_tela_2026-01-16_175244_axmojq.png',
          link: 'https://ollivandercafe.vercel.app/',
          category: 'institutional'
        },
        {
          id: '5',
          title: 'Mestre das Pizzas',
          description: 'E-commerce completo para uma pizzaria artesanal, com sistema de personalização de pizzas, carrinho de compras e venda no whatsapp.',
          tags: ['HTML', 'CSS', 'Framer Motion', 'JavaScript'],
          imageUrl: 'https://res.cloudinary.com/dxplpg36m/image/upload/v1769236665/Captura_de_tela_2026-01-24_033058_s7jrid.png',
          link: 'https://mestredaspizzas.vercel.app/',
          category: 'institutional'
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
      hudWave: 'ONDA',
      gameOverTitle: 'GAME OVER',
      gameWonTitle: 'MISSÃO CUMPRIDA',
      gameWonMessage: 'Obrigado pela visita ao site, e por jogar o Space Blasters!',
      gameOverScore: 'Pontuação Final',
      legendDodge: 'Atire nos Inimigos',
      legendGet: 'Desvie dos Tiros',
      readyTitle: 'Space Blasters',
      instructionMove: 'PC: WASD ou Setas',
      instructionAvoid: 'Mobile: Direcional Esq',
      instructionCollect: 'Espaço ou Toque Dir. atira',
      btnStart: 'INICIAR MISSÃO',
      btnRetry: 'JOGAR NOVAMENTE',
      fullscreen: 'Tela Cheia',
      exitFullscreen: 'Sair da Tela Cheia',
      pressEsc: 'Pressione ESC para sair da tela cheia',
      bossWarning: 'ALERTA: NAVE MÃE DETECTADA',
      finalBossWarning: 'PERIGO: NAVE MÃE SUPREMA',
      chooseUpgrade: 'ESCOLHA SEU UPGRADE',
      buffs: {
          multishot: 'Tiro Múltiplo',
          rapidfire: 'Tiro Rápido',
          damage: 'Dano Aumentado',
          electric: 'Munição Elétrica',
          ricochet: 'Munição Ricochete',
          health: 'Vida Máxima +1',
          shield: 'Escudo de Energia',
          speed: 'Velocidade +',
          laser: 'RAIO LASER SUPREMO'
      },
      entities: {
        chaser: 'Inimigos',
        energy: 'Placar'
      }
    },
    contact: {
      title: 'Vamos começar?',
      subtitle: "Vamos tirar sua ideia do papel. Me chame no WhatsApp e vamos conversar.",
      nameLabel: 'Nome',
      namePlaceholder: 'Seu Nome',
      typeLabel: 'Tipo de Projeto',
      btnSend: 'Iniciar Conversa no WhatsApp',
      btnQuote: 'Calcular Estimativa',
      quoteLabel: 'Investimento Aproximado: ',
      projectTypes: {
          placeholder: 'Selecione o tipo...',
          landing: 'Landing Page',
          institutional: 'Site Institucional',
          ecommerce: 'E-commerce',
          app: 'Aplicativo Mobile',
          system: 'Sistema Web / Dashboard',
          other: 'Outro'
      }
    },
    footer: {
      rights: 'Todos os direitos reservados.'
    }
  }
};