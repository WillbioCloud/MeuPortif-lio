import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Twitter, Mail, Send, MessageCircle, Calculator } from 'lucide-react';
import CustomCursor from './components/CustomCursor';
import NeonGame from './components/NeonGame';
import Projects from './components/Projects';
import Hero from './components/Hero';
import About from './components/About';
import Reveal from './components/Reveal';
import { SKILLS } from './constants';
import { translations } from './translations';
import { Language } from './types';

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [isTouch, setIsTouch] = useState(false);
  
  // Estado para o formulário e orçamento
  const [formData, setFormData] = useState({ name: '', type: '' });
  const [quote, setQuote] = useState<string | null>(null);

  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'pt' : 'en');
    setQuote(null); // Limpa orçamento ao trocar lingua
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'type') setQuote(null); // Limpa orçamento se mudar o tipo
  };

  const calculateQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!formData.type) return;

    // Tabela de Preços (Exemplo)
    // PT em Reais, EN em Dólares
    const prices: Record<string, { pt: string, en: string }> = {
        landing: { pt: 'R$ 1.500 - R$ 3.000', en: '$400 - $800' },
        institutional: { pt: 'R$ 3.000 - R$ 6.000', en: '$800 - $1.500' },
        ecommerce: { pt: 'R$ 8.000 - R$ 15.000', en: '$2.000 - $4.000' },
        app: { pt: 'A partir de R$ 12.000', en: 'Starting at $3.000' },
        system: { pt: 'A partir de R$ 10.000', en: 'Starting at $2.500' },
        other: { pt: 'Sob consulta', en: 'Contact for quote' }
    };

    const price = prices[formData.type];
    if (price) {
        setQuote(price[language]);
    }
  };

  const handleWhatsAppClick = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type) {
        alert(language === 'pt' ? 'Por favor, preencha todos os campos.' : 'Please fill in all fields.');
        return;
    }

    const PHONE_NUMBER = '5564999232217'; // Substitua pelo seu
    
    // Pega o nome legível do tipo de projeto para a mensagem
    const projectTypeName = t.contact.projectTypes[formData.type as keyof typeof t.contact.projectTypes];

    const message = language === 'pt' 
        ? `Olá! Meu nome é ${formData.name}. Gostaria de falar sobre um projeto do tipo: ${projectTypeName}.`
        : `Hello! My name is ${formData.name}. I would like to talk about a project of type: ${projectTypeName}.`;
    
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const navLinks = [
    { name: t.nav.home, href: '#home' },
    { name: t.nav.about, href: '#about' },
    { name: t.nav.work, href: '#projects' },
    { name: t.nav.play, href: '#game' },
    { name: t.nav.contact, href: '#contact' },
  ];

  return (
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
          
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-neon-blue/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img 
                src="https://res.cloudinary.com/dxplpg36m/image/upload/v1768596880/logo_mw7zhr.png" 
                alt="RW.Dev Logo" 
                className="h-10 w-auto relative z-10 object-contain brightness-0 invert transition-transform duration-300 group-hover:scale-105" 
              />
            </div>
            <span className="text-2xl font-bold font-mono tracking-tighter text-white">
              RW<span className="text-neon-blue">.DEV</span>
            </span>
          </a>

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

      {/* Hero (com Spline Iframe) */}
      <Hero language={language} />

      {/* About */}
      <Reveal>
        <About language={language} />
      </Reveal>

      {/* Skills */}
      <section className="py-24 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold mb-4">{t.skills.title}</h2>
               <p className="text-slate-400">{t.skills.subtitle}</p>
            </div>
          </Reveal>
          
          <Reveal delay={200}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {SKILLS.map((skill, index) => (
                <div key={skill.name} className="p-6 bg-slate-900 rounded-xl border border-white/5 hover:border-neon-green/50 hover:bg-slate-800 transition-all group flex flex-col items-center gap-3 text-center">
                   <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{skill.icon}</span>
                   <span className="font-medium text-sm text-slate-300">{skill.name}</span>
                   <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-neon-green" style={{ width: `${skill.level}%` }} />
                   </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Projects */}
      <Reveal>
        <Projects language={language} />
      </Reveal>

      {/* Services */}
      <section className="py-24 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
           <Reveal>
             <h2 className="text-4xl font-bold mb-12 text-center">{t.services.title}</h2>
           </Reveal>
           <Reveal delay={200}>
             <div className="grid md:grid-cols-3 gap-8">
                {t.services.items.map((service, idx) => (
                  <div key={idx} className="p-8 bg-slate-950 rounded-2xl border border-white/5 hover:border-neon-purple/50 transition-colors group">
                     <service.icon className="w-10 h-10 text-neon-purple mb-6 group-hover:text-white transition-colors" />
                     <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                     <p className="text-slate-400 leading-relaxed">{service.description}</p>
                  </div>
                ))}
             </div>
           </Reveal>
        </div>
      </section>

      {/* Neon Game */}
      <section id="game" className="py-24 px-6 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">{t.game.sectionTitle}</h2>
              <p className="text-slate-400">{t.game.sectionSubtitle}</p>
            </div>
          </Reveal>
          
          <Reveal delay={200}>
            <NeonGame language={language} />
          </Reveal>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 relative">
         <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <h2 className="text-5xl font-bold mb-8">{t.contact.title}</h2>
              <p className="text-xl text-slate-400 mb-12">
                 {t.contact.subtitle}
              </p>
            </Reveal>
            
            <Reveal delay={200}>
              <form className="max-w-md mx-auto space-y-4 text-left" onSubmit={handleWhatsAppClick}>
                 <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">{t.contact.nameLabel}</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue transition-colors" 
                        placeholder={t.contact.namePlaceholder} 
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">{t.contact.typeLabel}</label>
                    
                    <div className="flex gap-2">
                        <div className="relative flex-grow">
                            <select 
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue transition-colors appearance-none cursor-pointer"
                            >
                                <option value="" disabled>{t.contact.projectTypes.placeholder}</option>
                                <option value="landing">{t.contact.projectTypes.landing}</option>
                                <option value="institutional">{t.contact.projectTypes.institutional}</option>
                                <option value="ecommerce">{t.contact.projectTypes.ecommerce}</option>
                                <option value="app">{t.contact.projectTypes.app}</option>
                                <option value="system">{t.contact.projectTypes.system}</option>
                                <option value="other">{t.contact.projectTypes.other}</option>
                            </select>
                            {/* Seta customizada do select */}
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>

                        {/* Botão de Orçamento */}
                        <button 
                            type="button"
                            onClick={calculateQuote}
                            className="bg-slate-800 border border-slate-700 hover:border-neon-purple hover:text-neon-purple text-slate-300 p-3 rounded-lg transition-colors flex items-center justify-center"
                            title={t.contact.btnQuote}
                        >
                            <Calculator size={20} />
                        </button>
                    </div>

                    {/* Exibição do Orçamento */}
                    <div className={`mt-3 overflow-hidden transition-all duration-500 ease-out ${quote ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="bg-neon-purple/10 border border-neon-purple/30 rounded-lg p-3 text-center">
                            <span className="text-sm text-neon-purple font-mono">
                                {t.contact.quoteLabel} 
                                <span className="font-bold text-white text-lg ml-1">{quote}</span>
                            </span>
                        </div>
                    </div>

                 </div>
                 
                 <button className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg hover:shadow-green-500/20">
                    {t.contact.btnSend} <MessageCircle size={20} />
                 </button>
              </form>
            </Reveal>
         </div>
      </section>

      <footer className="py-12 px-6 border-t border-white/5 bg-slate-950">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
               <img src="https://res.cloudinary.com/dxplpg36m/image/upload/v1768596880/logo_mw7zhr.png" alt="RW.Dev" className="h-8 w-auto brightness-0 invert" />
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