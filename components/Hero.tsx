import React from 'react';
import { ArrowRight } from 'lucide-react';
import { translations } from '../translations';
import { Language } from '../types';
import Reveal from './Reveal';

interface HeroProps {
  language: Language;
}

const Hero: React.FC<HeroProps> = ({ language }) => {
  const content = translations[language].hero;

  return (
    <section id="home" className="relative pt-20 pb-20 px-6 min-h-[100dvh] flex items-center z-10 overflow-hidden">
      
      {/* Background Spline 3D (Iframe Integrado) */}
      <div className="absolute inset-0 w-full h-full z-0 opacity-80 md:opacity-100 mix-blend-screen md:pointer-events-auto">
         {/* Ajuste de Posição: No desktop (md), empurra o 3D para a direita (left-1/4) */}
         <div className="absolute inset-0 w-full h-full md:left-[25%] md:w-[75%]">
            <iframe 
                src='https://my.spline.design/retrofuturisticcircuitloop-54cqSkJUUX8e5zOvlYNOg7oT/' 
                frameBorder='0' 
                width='100%' 
                height='100%'
                className="w-full h-full border-none"
                title="Spline 3D Scene"
            ></iframe>
         </div>
         
         {/* Overlay Gradiente: Escurece a esquerda para o texto ficar legível */}
         <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950 pointer-events-none" />
      </div>

      {/* Grid de Conteúdo */}
      <div className="max-w-7xl mx-auto w-full relative z-10 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Coluna da Esquerda: Texto */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Reveal>
              <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-neon-purple/50 bg-neon-purple/10 text-neon-purple text-sm font-mono animate-float backdrop-blur-md">
                {content.badge}
              </div>
            </Reveal>

            <Reveal delay={200}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-tight drop-shadow-2xl">
                {content.titleStart} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-purple filter drop-shadow-lg">
                  {content.titleHighlight}
                </span> {content.titleEnd}
              </h1>
            </Reveal>

            <Reveal delay={400}>
              <p className="text-lg md:text-xl text-slate-300 max-w-xl mb-10 leading-relaxed drop-shadow-md">
                {content.subtitle}
              </p>
            </Reveal>
            
            <Reveal delay={600}>
              {/* Botões: justify-center no mobile, justify-start no desktop */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center w-full">
                 <a href="#projects" className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] transition-shadow w-full sm:w-auto text-center flex justify-center items-center gap-2">
                    <div className="absolute inset-0 bg-neon-blue translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative z-10 group-hover:text-white transition-colors flex items-center gap-2">
                      {content.ctaProject} <ArrowRight size={18} />
                    </span>
                 </a>
                 <a href="#about" className="px-8 py-4 text-white border border-white/20 rounded-full hover:bg-white/10 transition-colors bg-slate-900/40 backdrop-blur-md w-full sm:w-auto text-center">
                    {content.ctaAbout}
                 </a>
              </div>
            </Reveal>
        </div>

        {/* Coluna da Direita: Espaço Vazio para o 3D aparecer */}
        <div className="hidden md:block">
            {/* O 3D está no background absolute, esta div serve apenas para ocupar espaço no grid */}
        </div>

      </div>
      
      {/* Scroll Indicator - Mantido no centro da tela */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce z-10 pointer-events-none">
        <span className="text-xs font-mono uppercase tracking-widest text-shadow">{content.scroll}</span>
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
};

export default Hero;