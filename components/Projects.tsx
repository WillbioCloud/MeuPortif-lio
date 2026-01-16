import React, { useState, useRef } from 'react';
import { ExternalLink, Github, PlayCircle, X, Maximize2, Pause, Play } from 'lucide-react';
import { translations } from '../translations';
import { Language } from '../types';

interface ProjectsProps {
  language: Language;
}

const Projects: React.FC<ProjectsProps> = ({ language }) => {
  const content = translations[language].projects;
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  
  // Controle de refs para múltiplos vídeos
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  
  // Estado para controlar ícone de feedback (Play/Pause) temporário
  const [feedbackIcon, setFeedbackIcon] = useState<{ id: string, type: 'play' | 'pause' } | null>(null);

  const handleTogglePlay = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation(); // Evita abrir o modal se clicar para pausar
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
    // Remove o ícone após 1 segundo (efeito "fica invisível")
    setTimeout(() => setFeedbackIcon(null), 1000);
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
            // Mobile: Abre modal ao clicar no card
            onClick={() => {
                if (window.innerWidth < 768 && project.videoUrl) {
                    setActiveVideo(project.videoUrl);
                }
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative h-full w-full bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(0,243,255,0.15)] flex flex-col">
              
              {/* === VÍDEO NO HOVER (DESKTOP) === */}
              {project.videoUrl && (
                  <div 
                    className="hidden md:block absolute inset-0 z-20 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    onClick={(e) => handleTogglePlay(e, project.id)} // Clique no vídeo alterna play/pause
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
                     
                     {/* Overlay de Gradiente para legibilidade dos botões */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                     {/* Botão Expandir (Desktop) */}
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

                     {/* Feedback Visual de Play/Pause (Animação central) */}
                     {feedbackIcon?.id === project.id && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in fade-in zoom-in duration-300">
                           <div className="bg-black/60 p-4 rounded-full backdrop-blur-sm border border-white/20">
                              {feedbackIcon.type === 'play' ? <Play size={40} className="fill-white" /> : <Pause size={40} className="fill-white" />}
                           </div>
                        </div>
                     )}

                     {/* Hint de interação (opcional, aparece no rodapé do vídeo) */}
                     <div className="absolute bottom-4 left-0 w-full text-center text-xs text-white/50 pointer-events-none">
                        Clique para pausar
                     </div>
                  </div>
              )}

              {/* === CONTEÚDO ESTÁTICO DO CARD === */}
              <div className="h-48 overflow-hidden relative z-10">
                <div className="absolute inset-0 bg-slate-900/20 z-10 group-hover:bg-transparent transition-colors duration-300" />
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Ícone de Play sugerindo que há vídeo */}
                {(!project.link || project.videoUrl) && (
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                      <div className="bg-black/50 p-3 rounded-full backdrop-blur-sm border border-white/20">
                        <PlayCircle size={32} className="text-white" />
                      </div>
                   </div>
                )}
              </div>

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

                <div className="flex gap-4 mt-auto">
                   {project.link ? (
                     <a 
                       href={project.link} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       onClick={(e) => e.stopPropagation()} 
                       className="flex-1 flex items-center justify-center gap-2 py-2 bg-white text-black font-bold text-sm hover:bg-neon-blue transition-colors rounded cursor-pointer relative z-30"
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
                    className="p-2 border border-slate-600 rounded text-slate-400 hover:text-white hover:border-white transition-colors relative z-30">
                      <Github size={18} />
                   </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* === MODAL DE VÍDEO (MOBILE & DESKTOP EXPANDED) === */}
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