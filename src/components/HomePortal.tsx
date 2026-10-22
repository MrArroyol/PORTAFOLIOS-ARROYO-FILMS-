import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, ArrowRight, Film, Compass, Sparkles, Layers, Sliders, Eye } from 'lucide-react';
import { sampleProjects } from '../data/portfolioData';
import { Project } from '../types/portfolio';
import { ViewType } from '../utils/portfolio';
import { getMotionVariants } from '../utils/motionVariants';

interface HomePortalProps {
  onNavigate: (view: ViewType) => void;
  onSelectProject: (project: Project) => void;
}

export const HomePortal: React.FC<HomePortalProps> = ({ onNavigate, onSelectProject }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedSpotlightIndex, setSelectedSpotlightIndex] = useState(0);
  const [timecode, setTimecode] = useState('00:00:00:00');
  const [showHud, setShowHud] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const shouldReduceMotion = useReducedMotion();
  const motionSystem = getMotionVariants(!!shouldReduceMotion);

  const activeProject = sampleProjects[selectedSpotlightIndex] || sampleProjects[0];

  // Ticking SMPTE Timecode animation
  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      frame = (frame + 1) % 24;
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const ss = String(d.getSeconds()).padStart(2, '0');
      const ff = String(frame).padStart(2, '0');
      setTimecode(`${hh}:${mm}:${ss}:${ff}`);
    }, 1000 / 24);
    return () => clearInterval(interval);
  }, []);

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

  const portalSections = [
    {
      id: 'proyectos' as ViewType,
      number: '01',
      title: 'Proyectos & Obras',
      desc: 'Archivo seleccionado y casos de estudio',
      icon: Compass,
      tag: '6 Obras',
    },
    {
      id: 'showreel' as ViewType,
      number: '02',
      title: 'Showreel 1080p',
      desc: 'Sala de proyección privada con audio master',
      icon: Film,
      tag: 'Cinema Player',
    },
    {
      id: 'servicios' as ViewType,
      number: '03',
      title: 'Servicios & Cotizador',
      desc: 'Capacidades y estimador dinámico de inversión',
      icon: Sliders,
      tag: 'Calculadora',
    },
    {
      id: 'estudio' as ViewType,
      number: '04',
      title: 'El Estudio',
      desc: 'Manifiesto, proceso y ficha técnica',
      icon: Layers,
      tag: 'Equipo',
    },
    {
      id: 'contacto' as ViewType,
      number: '05',
      title: 'Iniciar Proyecto',
      desc: 'Briefing interactivo y agenda directa',
      icon: ArrowRight,
      tag: '24h Feedback',
    },
  ];

  return (
    <motion.div
      variants={motionSystem.pageContainer}
      initial="hidden"
      animate="visible"
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#090909] pt-20"
    >
      {/* Background Cinematic Video Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          src="/assets/aistudio/Lipopada_procedure_medical_sequence_1080p_20261004173714_94ae5efd.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className={`w-full h-full object-cover opacity-60 transition-transform duration-1000 ${
            shouldReduceMotion ? 'scale-100' : 'scale-105'
          }`}
        />

        {/* Ambient Dark Scrims for WCAG Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/75 to-[#090909]/80" />
        <div className="absolute inset-0 cinema-grain opacity-40 pointer-events-none" />

        {/* Subtle camera lens glare horizontal line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent pointer-events-none" />
      </div>

      {/* Cinematic Viewfinder HUD Overlay (Toggleable) */}
      {showHud && (
        <motion.div
          variants={motionSystem.fadeUp}
          className="absolute inset-6 sm:inset-10 z-10 pointer-events-none border border-white/10 rounded-2xl flex flex-col justify-between p-4 sm:p-6 opacity-75"
        >
          {/* Top corners & HUD meta */}
          <div className="flex items-center justify-between text-[11px] font-technical text-[#A7A39D]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-red-500 font-bold tracking-widest">
                <span className={`w-2.5 h-2.5 rounded-full bg-red-600 inline-block shadow-[0_0_8px_rgba(239,68,68,0.8)] ${
                  shouldReduceMotion ? '' : 'animate-pulse'
                }`} />
                <span>REC</span>
              </span>
              <span className="hidden sm:inline text-white/40" aria-hidden="true">·</span>
              <span className="text-white/80 tracking-wider">1080p · 24.00 FPS</span>
              <span className="hidden md:inline text-white/40" aria-hidden="true">·</span>
              <span className="hidden md:inline text-white/60">35mm T1.5 · ISO 800</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[#D4AF37] font-bold tracking-widest text-xs tabular-nums">
                TC {timecode}
              </span>
            </div>
          </div>

          {/* Center Crosshair reticle */}
          <div className="self-center flex items-center justify-center opacity-30">
            <div className="w-6 h-px bg-white" />
            <div className="w-px h-6 bg-white -ml-3" />
          </div>

          {/* Bottom Viewfinder Info & Audio visualizer */}
          <div className="flex items-center justify-between text-[10px] font-technical text-[#A7A39D]">
            <div className="flex items-center gap-2">
              <span>LUT: CINEMA GOLD 709</span>
              <span className="text-white/30">/</span>
              <span>SHUTTER 180°</span>
            </div>

            {/* Audio equalizing wave bars (animates when unmuted) */}
            <div className="flex items-end gap-1 h-3">
              {[6, 12, 8, 14, 10, 4].map((h, i) => (
                <span
                  key={i}
                  style={{
                    height: !isMuted ? `${h}px` : '3px',
                    transition: shouldReduceMotion ? 'none' : 'height 0.2s ease',
                  }}
                  className={`w-0.5 rounded-full ${!isMuted ? 'bg-[#D4AF37]' : 'bg-white/20'}`}
                />
              ))}
              <span className="ml-1 text-[9px] uppercase tracking-wider text-white/50">
                {!isMuted ? 'AUDIO LIVE' : 'MUTED'}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Top Status & Controls Strip */}
      <motion.div
        variants={motionSystem.fadeUp}
        className="relative z-20 px-6 sm:px-12 pt-4 flex items-center justify-between text-xs font-technical text-[#A7A39D]"
      >
        <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10 shadow-lg">
          <span className="text-[#D4AF37] font-semibold">PORTAL PRINCIPAL</span>
          <span className="hidden sm:inline text-white/40" aria-hidden="true">·</span>
          <span className="hidden sm:inline text-white/80">DIRECCIÓN DE ARTE & BRAND FILMS</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle HUD button */}
          <button
            onClick={() => setShowHud(!showHud)}
            className="px-2.5 py-1 rounded-md bg-black/60 hover:bg-black/90 text-white/70 hover:text-[#D4AF37] border border-white/10 text-[11px] transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
            aria-label="Alternar HUD de cámara"
          >
            <Eye size={12} />
            <span className="hidden sm:inline">{showHud ? 'HUD Activo' : 'HUD Oculto'}</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-md bg-black/60 hover:bg-black/90 text-white/80 hover:text-[#D4AF37] border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
            aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          </button>
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-md bg-black/60 hover:bg-black/90 border border-white/10 transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] ${
              !isMuted ? 'text-[#D4AF37] border-[#D4AF37]/50' : 'text-white/80 hover:text-[#D4AF37]'
            }`}
            aria-label={isMuted ? 'Activar audio' : 'Silenciar audio'}
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} className="text-[#D4AF37]" />}
          </button>
        </div>
      </motion.div>

      {/* Center Cinematic Statement with Staggered Masked Headline Reveal */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 sm:px-12 py-10 text-center flex flex-col items-center">
        <motion.div
          variants={motionSystem.fadeUp}
          className="inline-flex items-center gap-2 text-xs tracking-[0.28em] uppercase text-[#D4AF37] mb-4 font-semibold font-technical"
        >
          <Sparkles size={13} />
          <span>ARROYO · LUMEN & FORM · BRANDING & FILMS</span>
        </motion.div>

        {/* Masked Headline: Marcas que se ven, se sienten y se recuerdan */}
        <motion.h1
          variants={motionSystem.headlineMaskContainer}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F1EEE8] leading-[1.08] mb-6 text-balance max-w-4xl font-sans"
        >
          <span className="block overflow-hidden pb-1">
            <motion.span variants={motionSystem.headlineMaskLine} className="block uppercase">
              Marcas que se ven,
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-1">
            <motion.span
              variants={motionSystem.headlineMaskLine}
              className="block font-editorial italic font-normal text-[#F1EEE8]"
            >
              se sienten y se recuerdan.
            </motion.span>
          </span>
        </motion.h1>
        <p className="text-sm sm:text-base text-[#A7A39D] max-w-xl mx-auto mb-8 leading-relaxed">
          Diseño de marca y producción audiovisual para proyectos que buscan algo más.
        </p>

        {/* Interactive Film Spotlight: Showcases authentic work (Dr. Luciano) */}
        <motion.div
          variants={motionSystem.scaleUp}
          className="w-full max-w-2xl bg-black/85 backdrop-blur-xl border border-white/15 rounded-2xl p-4 sm:p-5 mb-6 shadow-2xl"
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs">
            <span className="font-technical text-[10px] uppercase text-[#D4AF37] tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              Spotlight de Obra en Pantalla
            </span>
            <button
              onClick={() => onSelectProject(activeProject)}
              className="text-xs text-[#F1EEE8] hover:text-[#D4AF37] flex items-center gap-1 transition-colors font-technical font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] rounded"
            >
              <span>Ver Ficha Completa</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-left flex-grow">
              <div className="flex items-center gap-2 text-xs mb-1">
                <span className="font-bold text-[#F1EEE8] text-sm sm:text-base">{activeProject.title}</span>
                {activeProject.isRealWork && (
                  <span className="text-[10px] font-technical uppercase tracking-wider text-[#D4AF37] font-semibold">
                    · Trabajo Real
                  </span>
                )}
              </div>
              <p className="text-xs text-[#A7A39D] line-clamp-1">{activeProject.subtitle}</p>
            </div>

            {/* Quick Switcher Buttons */}
            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto" role="group" aria-label="Seleccionar obra en pantalla">
              {sampleProjects.slice(0, 4).map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedSpotlightIndex(i)}
                  className={`w-7 h-7 rounded-md text-xs font-technical transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] ${
                    selectedSpotlightIndex === i
                      ? 'bg-[#D4AF37] text-black font-bold shadow-md scale-105'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  aria-label={`Ver spotlight 0${i + 1}: ${p.title}`}
                  aria-pressed={selectedSpotlightIndex === i}
                >
                  0{i + 1}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Redirection Portals (Direct Navigation Cards to dedicated view pages) */}
      <motion.div variants={motionSystem.fadeUp} className="relative z-20 px-6 sm:px-12 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between text-xs font-technical text-[#A7A39D] mb-4">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              SELECCIONA UNA SECCIÓN DEDICADA PARA NAVEGAR
            </span>
            <span className="hidden sm:inline">VISTAS INDEPENDIENTES</span>
          </div>

          <motion.div
            variants={motionSystem.gridContainer}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5"
          >
            {portalSections.map((sec) => {
              const Icon = sec.icon;
              return (
                <motion.button
                  key={sec.id}
                  variants={motionSystem.fadeUp}
                  whileHover={motionSystem.cardHover}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  onClick={() => onNavigate(sec.id)}
                  className="p-4 sm:p-5 rounded-xl bg-[#121212]/95 hover:bg-[#1A1A1A] border border-white/10 hover:border-[#D4AF37] transition-all text-left flex flex-col justify-between group backdrop-blur-md shadow-xl relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                >
                  {/* Subtle hover accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-center justify-between mb-3">
                    <span className="font-technical text-xs text-[#D4AF37] font-bold">{sec.number}</span>
                    <span className="text-[10px] font-technical uppercase tracking-wider text-[#A7A39D] group-hover:text-white transition-colors">
                      {sec.tag}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm sm:text-base font-bold text-[#F1EEE8] group-hover:text-[#D4AF37] transition-colors">
                        {sec.title}
                      </h3>
                      <Icon size={14} className="text-[#A7A39D] group-hover:text-[#D4AF37] transition-colors shrink-0 ml-1" />
                    </div>
                    <p className="text-[11px] text-[#A7A39D] line-clamp-1 group-hover:text-[#F1EEE8]/80 transition-colors">
                      {sec.desc}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
