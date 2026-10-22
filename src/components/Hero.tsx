import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ArrowDown, Film, Compass, Volume2, VolumeX } from 'lucide-react';

interface HeroProps {
  onExploreProjects: () => void;
  onOpenShowreel: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreProjects, onOpenShowreel }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section
      id="top"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#090909]"
      aria-label="Portada cinematográfica"
    >
      {/* Real Background Commercial Film Footage */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          src="/assets/aistudio/Lipopada_procedure_medical_sequence_1080p_20261004173714_94ae5efd.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover opacity-65 scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Ambient lighting scrims & dark cinematic grading */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/60 to-[#090909]/75" />
        <div className="absolute inset-0 cinema-grain opacity-35 pointer-events-none" />
      </div>

      {/* Top Floating Badge */}
      <div className="absolute top-24 left-0 right-0 z-10 px-6 sm:px-8 max-w-7xl mx-auto flex items-center justify-between pointer-events-none">
        <div className="hidden sm:inline-flex items-center gap-2 text-[11px] font-technical tracking-widest text-[#A7A39D] bg-black/60 backdrop-blur-md px-3 py-1 rounded border border-white/10">
          <span className="text-[#D4AF37]">● REEL OFICIAL</span>
          <span>·</span>
          <span>1080P MASTER</span>
        </div>
      </div>

      {/* Central Minimalist Editorial Title */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#D4AF37] mb-6 font-medium">
          <span>Brand Films</span>
          <span aria-hidden="true">·</span>
          <span>Dirección de Arte</span>
          <span aria-hidden="true">·</span>
          <span>VFX</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F1EEE8] leading-[1.08] mb-8 text-balance">
          Transformamos ideas en{' '}
          <span className="font-editorial italic font-normal text-[#F1EEE8]">marcas con identidad</span>{' '}
          y films de alto impacto.
        </h1>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onExploreProjects}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-xs font-bold tracking-widest uppercase text-[#090909] bg-[#F1EEE8] hover:bg-[#D4AF37] transition-all duration-300 rounded shadow-xl focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
          >
            <Compass size={15} />
            <span>Ver proyectos</span>
          </button>

          <button
            onClick={onOpenShowreel}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-xs font-bold tracking-widest uppercase text-[#F1EEE8] bg-[#141414]/90 hover:bg-[#1E1E1E] border border-white/20 hover:border-[#D4AF37]/60 transition-all duration-300 rounded backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
          >
            <Film size={15} className="text-[#D4AF37]" />
            <span>Ver showreel</span>
          </button>
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-8 left-0 right-0 z-20 px-6 sm:px-8 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-2 text-xs font-technical tracking-wider text-[#A7A39D] hover:text-[#F1EEE8] transition-colors bg-[#141414]/80 backdrop-blur-md px-3 py-1.5 rounded border border-white/10"
            aria-label={isPlaying ? 'Pausar video de fondo' : 'Reproducir video de fondo'}
          >
            {isPlaying ? <Pause size={12} className="text-[#D4AF37]" /> : <Play size={12} className="text-[#D4AF37]" />}
            <span className="hidden sm:inline">{isPlaying ? 'Pausar' : 'Play'}</span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            className="inline-flex items-center gap-2 text-xs font-technical tracking-wider text-[#A7A39D] hover:text-[#F1EEE8] transition-colors bg-[#141414]/80 backdrop-blur-md px-3 py-1.5 rounded border border-white/10"
            aria-label={isMuted ? 'Activar sonido del video' : 'Silenciar video'}
          >
            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} className="text-[#D4AF37]" />}
            <span className="hidden sm:inline">{isMuted ? 'Audio Off' : 'Audio On'}</span>
          </button>
        </div>

        {/* Scroll Indicator */}
        <a
          href="#proyectos"
          className="inline-flex items-center gap-2 text-xs tracking-widest text-[#A7A39D] hover:text-[#F1EEE8] transition-colors group"
          aria-label="Desplazarse a proyectos"
        >
          <span className="text-[11px] uppercase tracking-[0.2em] font-medium hidden sm:inline">Explorar Obra</span>
          <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#D4AF37] group-hover:translate-y-0.5 transition-all">
            <ArrowDown size={13} className="text-[#D4AF37]" />
          </div>
        </a>
      </div>
    </section>
  );
};
