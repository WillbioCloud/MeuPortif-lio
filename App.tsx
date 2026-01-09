import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Twitter, Mail, Send } from 'lucide-react';
import CustomCursor from './components/CustomCursor';
import NeonGame from './components/NeonGame';
import Projects from './components/Projects';
import Hero from './components/Hero';
import About from './components/About';
import { SKILLS } from './constants';
import { translations } from './translations';
import { Language } from './types';

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [isTouch, setIsTouch] = useState(false);

  // Short alias for translations
  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Detect touch device to disable custom cursor logic if needed
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'pt' : 'en');
  };

  const navLinks = [
    { name: t.nav.home, href: '#home' },
    { name: t.nav.about, href: '#about' },
    { name: t.nav.work, href: '#projects' },
    { name: t.nav.play, href: '#game' },
    { name: t.nav.contact, href: '#contact' },
  ];

  return (
    // Adiciona classe 'cursor-none' apenas se NÃO for dispositivo touch
    <div className={`min-h-screen bg-slate-950 text-slate-200 selection:bg-neon-purple selection:text-white overflow-hidden ${!isTouch ? 'cursor-none' : ''}`}>
      <CustomCursor />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-blue/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      {/* Navbar */}
      <nav className={`fixed w-full z-40 transition-all duration-300 ${isScrolled ? 'py-4 glass-panel border-b border-white/5' : 'py-8 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* Logo Section */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-neon-blue/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img 
                src="./assets/logo.png" 
                alt="RW.Dev Logo" 
                className="h-10 w-auto relative z-10 object-contain brightness-0 invert transition-transform duration-300 group-hover:scale-105" 
              />
            </div>
            <span className="text-2xl font-bold font-mono tracking-tighter text-white">
              RW<span className="text-neon-blue">.DEV</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-neon-blue transition-colors relative group cursor-interactive"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-blue transition-all group-hover:w-full" />
              </a>
            ))}
            
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1 border border-white/10 rounded text-xs font-mono font-bold hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <span className={language === 'en' ? 'text-neon-blue' : 'text-slate-500'}>EN</span>
              <span className="w-px h-3 bg-white/20"></span>
              <span className={language === 'pt' ? 'text-neon-green' : 'text-slate-500'}>PT</span>
            </button>

            <a href="#contact" className="px-5 py-2 border border-white/20 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-all duration-300">
              {t.nav.cta}
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={toggleLanguage}
              className="px-2 py-1 border border-white/10 rounded text-xs font-mono font-bold"
            >
              {language.toUpperCase()}
            </button>
            <button 
              className="text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center">
          <div className="flex flex-col gap-8 text-center">
             {navLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-bold text-white hover:text-neon-blue"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Hero Component */}
      <Hero language={language} />

      {/* About Component */}
      <About language={language} />

      {/* Skills */}
      <section className="py-24 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-bold mb-4">{t.skills.title}</h2>
             <p className="text-slate-400">{t.skills.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {SKILLS.map(skill => (
              <div key={skill.name} className="p-6 bg-slate-900 rounded-xl border border-white/5 hover:border-neon-green/50 hover:bg-slate-800 transition-all group flex flex-col items-center gap-3 text-center">
                 <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{skill.icon}</span>
                 <span className="font-medium text-sm text-slate-300">{skill.name}</span>
                 <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-neon-green" style={{ width: `${skill.level}%` }} />
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Component */}
      <Projects language={language} />

      {/* Services */}
      <section className="py-24 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
           <h2 className="text-4xl font-bold mb-12 text-center">{t.services.title}</h2>
           <div className="grid md:grid-cols-3 gap-8">
              {t.services.items.map((service, idx) => (
                <div key={idx} className="p-8 bg-slate-950 rounded-2xl border border-white/5 hover:border-neon-purple/50 transition-colors group">
                   <service.icon className="w-10 h-10 text-neon-purple mb-6 group-hover:text-white transition-colors" />
                   <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                   <p className="text-slate-400 leading-relaxed">{service.description}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Mini Game Section */}
      <section id="game" className="py-24 px-6 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">{t.game.sectionTitle}</h2>
            <p className="text-slate-400">{t.game.sectionSubtitle}</p>
          </div>
          
          <NeonGame language={language} />
          
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 relative">
         <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-8">{t.contact.title}</h2>
            <p className="text-xl text-slate-400 mb-12">
               {t.contact.subtitle}
            </p>
            
            {/* Action mailto para funcionalidade sem backend */}
            <form className="max-w-md mx-auto space-y-4 text-left" action="mailto:contact@rw.dev" method="POST" encType="text/plain">
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">{t.contact.nameLabel}</label>
                  <input type="text" name="name" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue transition-colors" placeholder={t.contact.namePlaceholder} />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">{t.contact.emailLabel}</label>
                  <input type="email" name="email" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue transition-colors" placeholder={t.contact.emailPlaceholder} />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">{t.contact.msgLabel}</label>
                  <textarea rows={4} name="message" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue transition-colors" placeholder={t.contact.msgPlaceholder} />
               </div>
               <button className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-neon-blue transition-colors flex items-center justify-center gap-2">
                  {t.contact.btnSend} <Send size={18} />
               </button>
            </form>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-slate-950">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
               <img 
                 src="./assets/logo.png" 
                 alt="RW.Dev" 
                 className="h-8 w-auto brightness-0 invert" 
               />
               <div className="text-xl font-bold font-mono tracking-tighter">
                 RW<span className="text-slate-600">.DEV</span>
               </div>
            </div>
            
            <div className="flex gap-6">
               <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github size={20} /></a>
               <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
               <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter size={20} /></a>
               <a href="#" className="text-slate-400 hover:text-white transition-colors"><Mail size={20} /></a>
            </div>
            
            <div className="text-slate-600 text-sm">
               © {new Date().getFullYear()} RW.Dev. {t.footer.rights}
            </div>
         </div>
      </footer>
    </div>
  );
};

export default App;