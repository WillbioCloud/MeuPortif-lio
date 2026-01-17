import { ProjectCategory, Language } from './types';

interface Detail {
  title: string;
  description: string;
  features: string[];
}

export const projectDetails: Record<ProjectCategory, Record<Language, Detail>> = {
  landing: {
    pt: {
      title: 'Landing Page',
      description: 'Uma página única focada em conversão. Ideal para lançamentos, produtos específicos ou captura de leads.',
      features: ['Alta taxa de conversão', 'Design focado em vendas', 'Carregamento ultrarrápido']
    },
    en: {
      title: 'Landing Page',
      description: 'A single page focused on conversion. Ideal for launches, specific products, or lead capture.',
      features: ['High conversion rate', 'Sales-focused design', 'Ultra-fast loading']
    }
  },
  institutional: {
    pt: {
      title: 'Site Institucional',
      description: 'Site completo para empresas com sua identidade visual. Apresenta sua marca, serviços, equipe e história de forma profissional.',
      features: ['Múltiplas páginas (Home, Sobre, Serviços)', 'Blog integrado', 'Otimizado para Google (SEO)']
    },
    en: {
      title: 'Institutional Website',
      description: 'Complete website for companies with their visual identity. Professional presentation of your brand, services, team, and history.',
      features: ['Multiple pages (Home, About, Services)', 'Integrated Blog', 'SEO Optimized']
    }
  },
  ecommerce: {
    pt: {
      title: 'E-commerce',
      description: 'Loja virtual completa. Permite vender produtos online com carrinho de compras e pagamentos automáticos.',
      features: ['Gestão de produtos', 'Cálculo de frete', 'Pagamento via Cartão/Pix']
    },
    en: {
      title: 'E-commerce',
      description: 'Complete online store. Sell products online with shopping cart and automatic payments.',
      features: ['Product management', 'Shipping calculation', 'Credit Card/Payment integration']
    }
  },
  app: {
    pt: {
      title: 'Aplicativo Mobile',
      description: 'Software desenvolvido para rodar nativamente em celulares Android e iOS.',
      features: ['Notificações Push', 'Acesso a câmera/GPS', 'Funciona offline (opcional)']
    },
    en: {
      title: 'Mobile App',
      description: 'Software developed to run natively on Android and iOS phones.',
      features: ['Push Notifications', 'Camera/GPS Access', 'Offline mode (optional)']
    }
  },
  system: {
    pt: {
      title: 'Sistema Web / Dashboard',
      description: 'Ferramentas de gestão interna. Painéis administrativos, controle de estoque ou áreas de membros.',
      features: ['Login seguro', 'Gráficos e Relatórios', 'Gestão de dados complexos']
    },
    en: {
      title: 'Web System / Dashboard',
      description: 'Internal management tools. Admin panels, inventory control, or membership areas.',
      features: ['Secure Login', 'Charts and Reports', 'Complex data management']
    }
  },
  other: {
    pt: {
      title: 'Outro Projeto',
      description: 'Tem uma ideia inovadora que não se encaixa nas categorias acima? Vamos criar algo único.',
      features: ['Solução 100% personalizada', 'Análise de viabilidade', 'Prototipagem']
    },
    en: {
      title: 'Other Project',
      description: 'Have an innovative idea that doesn\'t fit the categories above? Let\'s create something unique.',
      features: ['100% Custom Solution', 'Feasibility Analysis', 'Prototyping']
    }
  }
};