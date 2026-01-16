import React from 'react';
import { translations } from '../translations';
import { Language } from '../types';

interface AboutProps {
  language: Language;
}

const About: React.FC<AboutProps> = ({ language }) => {
  const content = translations[language].about;

  return (
    <section id="about" className="py-24 px-6 relative z-10 bg-slate-900/50">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="relative">
           <div className="aspect-square rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 relative z-10">
              <img src="https://res.cloudinary.com/dxplpg36m/image/upload/v1768600146/Gemini_Generated_Image_j0uar6j0uar6j0ua_wyxww0.png" alt="Portrait" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
           </div>
           {/* Decorative Elements */}
           <div className="absolute -bottom-10 -right-10 w-full h-full border-2 border-neon-blue/30 rounded-2xl -z-0" />
        </div>
        
        <div>
          <h2 className="text-4xl font-bold mb-6">{content.title}</h2>
          <p className="text-slate-400 mb-6 text-lg leading-relaxed">
            {content.p1}
          </p>
          <p className="text-slate-400 mb-8 text-lg leading-relaxed">
            {content.p2}
          </p>

          <div className="grid grid-cols-2 gap-6">
             <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5">
                <h3 className="text-3xl font-bold text-neon-blue mb-1">{content.statExp}</h3>
                <p className="text-sm text-slate-500 font-mono">{content.statExpLabel}</p>
             </div>
             <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5">
                <h3 className="text-3xl font-bold text-neon-purple mb-1">{content.statProj}</h3>
                <p className="text-sm text-slate-500 font-mono">{content.statProjLabel}</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;