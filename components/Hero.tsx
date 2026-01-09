import React from 'react';
import { ArrowRight } from 'lucide-react';
import { translations } from '../translations';
import { Language } from '../types';

// Declaração para o TypeScript aceitar a tag personalizada do Spline
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { url?: string; 'loading-anim-type'?: string }, HTMLElement>;
    }
  }
}

interface HeroProps {
  language: Language;
}

const Hero: React.FC<HeroProps> = ({ language }) => {
  const content = translations[language].hero;

  return (
    <section id="home" className="relative pt-32 pb-20 px-6 min-h-screen flex flex-col justify-center items-center text-center z-10 overflow-hidden">
      
      {/* Background Spline 3D */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none md:pointer-events-auto opacity-60 mix-blend-screen">
         {/* Substitua a URL abaixo pela sua URL pública do Spline se desejar mudar a cena */}
         <spline-viewer 
            loading-anim-type="spinner-small-dark"
            url="https://prod.spline.design/6Wq1Q7YQ5s-6Jq4N/scene.splinecode" 
         />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-neon-purple/50 bg-neon-purple/10 text-neon-purple text-sm font-mono animate-float">
          {content.badge}
        </div>
        <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-tight">
          {content.titleStart} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-purple">
            {content.titleHighlight}
          </span> {content.titleEnd}
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          {content.subtitle}
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
           <a href="#projects" className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-neon-blue translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 group-hover:text-white transition-colors flex items-center gap-2">
                {content.ctaProject} <ArrowRight size={18} />
              </span>
           </a>
           <a href="#about" className="px-8 py-4 text-white border border-white/20 rounded-full hover:bg-white/5 transition-colors bg-slate-900/50 backdrop-blur-sm">
              {content.ctaAbout}
           </a>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce z-10">
        <span className="text-xs font-mono uppercase tracking-widest">{content.scroll}</span>
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
};

export default Hero;