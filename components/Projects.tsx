import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { translations } from '../translations';
import { Language } from '../types';

interface ProjectsProps {
  language: Language;
}

const Projects: React.FC<ProjectsProps> = ({ language }) => {
  const content = translations[language].projects;

  return (
    <section id="projects" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
          {content.title}
        </h2>
        <div className="h-1 w-20 bg-neon-blue rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {content.items.map((project) => (
          <div 
            key={project.id}
            className="group relative h-[450px] perspective-1000"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative h-full w-full bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(0,243,255,0.15)] flex flex-col">
              
              {/* Image Area */}
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-slate-900/20 z-10 group-hover:bg-transparent transition-colors duration-300" />
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-white mb-2 font-mono group-hover:text-neon-blue transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-400 mb-4 flex-1">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-neon-green border border-slate-700/50">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 mt-auto">
                   <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-white text-black font-bold text-sm hover:bg-neon-blue transition-colors rounded">
                      {content.ctaView} <ExternalLink size={14} />
                   </button>
                   <button className="p-2 border border-slate-600 rounded text-slate-400 hover:text-white hover:border-white transition-colors">
                      <Github size={18} />
                   </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;