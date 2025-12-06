import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Github, Linkedin, Twitter, Mail, Send } from 'lucide-react';
import CustomCursor from './components/CustomCursor';
import NeonGame from './components/NeonGame';
import Projects from './components/Projects';
import { NAV_LINKS, SKILLS, SERVICES } from './constants';

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-neon-purple selection:text-white overflow-hidden">
      <CustomCursor />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-blue/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      {/* Navbar */}
      <nav className={`fixed w-full z-40 transition-all duration-300 ${isScrolled ? 'py-4 glass-panel border-b border-white/5' : 'py-8 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="#" className="text-2xl font-bold font-mono tracking-tighter text-white">
            ALEX<span className="text-neon-blue">.DEV</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-neon-blue transition-colors relative group cursor-interactive"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-blue transition-all group-hover:w-full" />
              </a>
            ))}
            <a href="#contact" className="px-5 py-2 border border-white/20 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-all duration-300">
              Let's Talk
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center">
          <div className="flex flex-col gap-8 text-center">
             {NAV_LINKS.map(link => (
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

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 px-6 min-h-screen flex flex-col justify-center items-center text-center z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-neon-purple/50 bg-neon-purple/10 text-neon-purple text-sm font-mono animate-float">
            AVAILABLE FOR FREELANCE WORK
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-tight">
            Building digital <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-purple">
              experiences
            </span> that matter.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            I'm a Full Stack Engineer obsessed with performance, micro-interactions, and creating immersive web applications that leave a mark.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
             <a href="#projects" className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-neon-blue translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 group-hover:text-white transition-colors flex items-center gap-2">
                  View Projects <ArrowRight size={18} />
                </span>
             </a>
             <a href="#about" className="px-8 py-4 text-white border border-white/20 rounded-full hover:bg-white/5 transition-colors">
                About Me
             </a>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
          <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* About & Stats */}
      <section id="about" className="py-24 px-6 relative z-10 bg-slate-900/50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
             <div className="aspect-square rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 relative z-10">
                <img src="https://picsum.photos/800/800?random=10" alt="Portrait" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
             </div>
             {/* Decorative Elements */}
             <div className="absolute -bottom-10 -right-10 w-full h-full border-2 border-neon-blue/30 rounded-2xl -z-0" />
          </div>
          
          <div>
            <h2 className="text-4xl font-bold mb-6">More than just code.</h2>
            <p className="text-slate-400 mb-6 text-lg leading-relaxed">
              With over 5 years of experience in the ever-evolving tech landscape, I bridge the gap between engineering and design. I don't just write clean code; I solve complex problems with creative solutions.
            </p>
            <p className="text-slate-400 mb-8 text-lg leading-relaxed">
              Currently specializing in the React ecosystem (Next.js), Node.js backends, and creative WebGL implementations.
            </p>

            <div className="grid grid-cols-2 gap-6">
               <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5">
                  <h3 className="text-3xl font-bold text-neon-blue mb-1">5+</h3>
                  <p className="text-sm text-slate-500 font-mono">YEARS EXPERIENCE</p>
               </div>
               <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5">
                  <h3 className="text-3xl font-bold text-neon-purple mb-1">50+</h3>
                  <p className="text-sm text-slate-500 font-mono">PROJECTS SHIPPED</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-24 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-bold mb-4">Tech Stack</h2>
             <p className="text-slate-400">Tools I use to create magic</p>
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

      <Projects />

      {/* Services */}
      <section className="py-24 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
           <h2 className="text-4xl font-bold mb-12 text-center">Services</h2>
           <div className="grid md:grid-cols-3 gap-8">
              {SERVICES.map((service, idx) => (
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Take a Break</h2>
            <p className="text-slate-400">Interact with the portfolio. Survive as long as you can.</p>
          </div>
          
          <NeonGame />
          
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 relative">
         <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-8">Ready to start?</h2>
            <p className="text-xl text-slate-400 mb-12">
               I'm currently available for freelance projects and open to full-time opportunities.
            </p>
            
            <form className="max-w-md mx-auto space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue transition-colors" placeholder="John Doe" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                  <input type="email" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue transition-colors" placeholder="john@example.com" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Message</label>
                  <textarea rows={4} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue transition-colors" placeholder="Tell me about your project..." />
               </div>
               <button className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-neon-blue transition-colors flex items-center justify-center gap-2">
                  Send Message <Send size={18} />
               </button>
            </form>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-slate-950">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-bold font-mono tracking-tighter">
              ALEX<span className="text-slate-600">.DEV</span>
            </div>
            
            <div className="flex gap-6">
               <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github size={20} /></a>
               <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
               <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter size={20} /></a>
               <a href="#" className="text-slate-400 hover:text-white transition-colors"><Mail size={20} /></a>
            </div>
            
            <div className="text-slate-600 text-sm">
               © {new Date().getFullYear()} AlexDev. All rights reserved.
            </div>
         </div>
      </footer>
    </div>
  );
};

export default App;
