import React, { useState, useRef } from 'react';
import { ExternalLink, Github, PlayCircle, X, Maximize2, Pause, Play, Wand2 } from 'lucide-react';
import { translations } from '../translations';
import { Language } from '../types';

interface ProjectsProps {
  language: Language;
  onSelectProject: (category: string) => void; // Recebendo a função do Pai
}

const Projects: React.FC<ProjectsProps> = ({ language, onSelectProject }) => {
  const content = translations[language].projects;
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const [feedbackIcon, setFeedbackIcon] = useState<{ id: string, type: 'play' | 'pause' } | null>(null);

  const handleTogglePlay = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    const video = videoRefs.current[projectId];
    if (video) {
      if (video.paused) {
        video.play();
        showFeedback(projectId, 'play');
      } else {
        video.pause();
        showFeedback(projectId, 'pause');
      }
    }
  };

  const showFeedback = (id: string, type: 'play' | 'pause') => {
    setFeedbackIcon({ id, type });
    setTimeout(() => setFeedbackIcon(null), 1000);
  };

  // Função simplificada que chama diretamente a prop
  const handleWantThis = (e: React.MouseEvent, category: string) => {
    e.stopPropagation();
    onSelectProject(category);
  };

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
            className="group relative h-[450px] perspective-1000 cursor-pointer md:cursor-default"
            onClick={() => {
                if (window.innerWidth < 768 && project.videoUrl) {
                    setActiveVideo(project.videoUrl);
                }
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative h-full w-full bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(0,243,255,0.15)] flex flex-col">
              
              {/* VIDEO OVERLAY */}
              {project.videoUrl && (
                  <div 
                    className="hidden md:block absolute inset-0 z-20 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    onClick={(e) => handleTogglePlay(e, project.id)}
                  >
                     <video 
                        ref={el => videoRefs.current[project.id] = el}
                        src={project.videoUrl}
                        className="w-full h-full object-cover cursor-pointer"
                        muted
                        loop
                        autoPlay
                        playsInline
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
                     <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveVideo(project.videoUrl!);
                        }}
                        className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-neon-blue hover:text-black transition-all hover:scale-110 z-30"
                        title="Expandir Vídeo"
                     >
                        <Maximize2 size={20} />
                     </button>
                     {feedbackIcon?.id === project.id && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in fade-in zoom-in duration-300">
                           <div className="bg-black/60 p-4 rounded-full backdrop-blur-sm border border-white/20">
                              {feedbackIcon.type === 'play' ? <Play size={40} className="fill-white" /> : <Pause size={40} className="fill-white" />}
                           </div>
                        </div>
                     )}
                     <div className="absolute bottom-4 left-0 w-full text-center text-xs text-white/50 pointer-events-none">
                        Clique para pausar
                     </div>
                  </div>
              )}

              {/* IMAGE */}
              <div className="h-48 overflow-hidden relative z-10">
                <div className="absolute inset-0 bg-slate-900/20 z-10 group-hover:bg-transparent transition-colors duration-300" />
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                {(!project.link || project.videoUrl) && (
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                      <div className="bg-black/50 p-3 rounded-full backdrop-blur-sm border border-white/20">
                        <PlayCircle size={32} className="text-white" />
                      </div>
                   </div>
                )}
              </div>

              {/* DETAILS */}
              <div className="p-6 flex-1 flex flex-col z-10">
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

                <div className="flex flex-col gap-3 mt-auto relative z-30">
                    <div className="flex gap-4">
                        {project.link ? (
                            <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()} 
                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-white text-black font-bold text-sm hover:bg-neon-blue transition-colors rounded cursor-pointer"
                            >
                                {content.ctaView} <ExternalLink size={14} />
                            </a>
                        ) : (
                            <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-800 text-slate-300 font-bold text-sm cursor-not-allowed border border-slate-700" disabled>
                                {project.videoUrl ? 'Preview' : 'Em Breve'} <PlayCircle size={14} />
                            </button>
                        )}
                        
                        <button 
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 border border-slate-600 rounded text-slate-400 hover:text-white hover:border-white transition-colors"
                        >
                            <Github size={18} />
                        </button>
                    </div>

                    <button 
                        onClick={(e) => handleWantThis(e, project.category)}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-600/80 hover:bg-indigo-500 text-white font-bold text-sm rounded transition-all border border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                    >
                        {content.ctaQuote} <Wand2 size={14} />
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setActiveVideo(null)}>
           <div className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full text-white hover:bg-neon-blue hover:text-black transition-colors"
              >
                <X size={24} />
              </button>
              <div className="aspect-video w-full">
                 <video 
                    src={activeVideo} 
                    className="w-full h-full" 
                    controls 
                    autoPlay
                 />
              </div>
           </div>
        </div>
      )}
    </section>
  );
};

export default Projects;