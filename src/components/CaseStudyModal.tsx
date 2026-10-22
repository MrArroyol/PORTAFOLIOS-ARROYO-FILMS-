import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, ProjectStill } from '../types/portfolio';
import { getAdjacentProject, parseTimecodeToSeconds } from '../utils/portfolio';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Film,
  Play,
  Maximize2,
  Camera,
  Grid,
  Sparkles,
  Layers,
  Sliders,
  Eye,
  Check,
} from 'lucide-react';

interface CaseStudyModalProps {
  project: Project | null;
  allProjects: Project[];
  onClose: () => void;
  onNavigateProject: (project: Project) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  allProjects,
  onClose,
  onNavigateProject,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeStillIndex, setActiveStillIndex] = useState<number>(0);
  const [lightboxStill, setLightboxStill] = useState<ProjectStill | null>(null);
  const [showFramingGuides, setShowFramingGuides] = useState<boolean>(false);
  const [copiedNote, setCopiedNote] = useState<string | null>(null);

  // Reset active point when project changes
  useEffect(() => {
    setActiveStillIndex(0);
    setLightboxStill(null);
  }, [project?.id]);

  // ESC key listener & body scroll lock
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxStill) {
          setLightboxStill(null);
        } else {
          onClose();
        }
      }
      if (!lightboxStill) {
        if (e.key === 'ArrowRight') {
          const next = getAdjacentProject(allProjects, project.id, 'next');
          onNavigateProject(next);
        }
        if (e.key === 'ArrowLeft') {
          const prev = getAdjacentProject(allProjects, project.id, 'prev');
          onNavigateProject(prev);
        }
      } else {
        // Lightbox arrow navigation
        const stills = project.caseStudy.stills;
        const currentIdx = stills.findIndex((s) => s.title === lightboxStill.title);
        if (e.key === 'ArrowRight' && currentIdx < stills.length - 1) {
          setLightboxStill(stills[currentIdx + 1]);
        }
        if (e.key === 'ArrowLeft' && currentIdx > 0) {
          setLightboxStill(stills[currentIdx - 1]);
        }
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, allProjects, onClose, onNavigateProject, lightboxStill]);

  if (!project) return null;

  const nextProject = getAdjacentProject(allProjects, project.id, 'next');
  const prevProject = getAdjacentProject(allProjects, project.id, 'prev');
  const cs = project.caseStudy;
  const stills = cs.stills || [];
  const activeStill: ProjectStill | undefined = stills[activeStillIndex] || stills[0];

  const handleJumpToVideo = (timecode?: string) => {
    if (!timecode || !videoRef.current) return;
    const seconds = parseTimecodeToSeconds(timecode);
    videoRef.current.currentTime = seconds;
    videoRef.current.play().catch(() => {});
    videoRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleCopyTechSpecs = (text: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedNote('Copiado');
      setTimeout(() => setCopiedNote(null), 2000);
    }).catch(() => {});
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 overflow-y-auto bg-[#090909]/95 backdrop-blur-xl"
    >
      {/* Top Floating Control Bar matching mockup top-right header */}
      <div className="sticky top-0 z-30 bg-[#090909]/90 backdrop-blur-md border-b border-white/10 px-6 sm:px-10 py-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A7A39D] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
          aria-label="Volver a proyectos"
        >
          <ArrowLeft size={15} />
          <span>Volver a proyectos</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Pagination Counter: e.g. 2 / 6 */}
          <span className="font-technical text-xs text-white/70 tracking-widest">
            {allProjects.findIndex((p) => p.id === project.id) + 1} / {allProjects.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onNavigateProject(prevProject)}
              className="p-1.5 text-white/70 hover:text-white transition-colors rounded hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
              aria-label={`Proyecto anterior: ${prevProject.title}`}
            >
              <ArrowLeft size={14} />
            </button>
            <button
              onClick={() => onNavigateProject(nextProject)}
              className="p-1.5 text-white/70 hover:text-white transition-colors rounded hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
              aria-label={`Proyecto siguiente: ${nextProject.title}`}
            >
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="h-4 w-px bg-white/10 mx-1" />
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white transition-colors rounded hover:bg-white/10"
            aria-label="Cerrar modal"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-10 pb-24">
        {/* Dedicated Video Player / Hero Visual at top matching mockup */}
        <div className="mb-10 rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl aspect-video relative group">
          {project.videoUrl ? (
            <video
              ref={videoRef}
              src={project.videoUrl}
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full relative">
              <img
                src={stills[0]?.imageUrl || '/assets/aistudio/frame_01_consulta.webp'}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                  <Play size={24} className="ml-1 fill-white" />
                </span>
              </div>
            </div>
          )}
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-technical uppercase tracking-wider text-[#D4AF37] border border-[#D4AF37]/30">
              Master 1080p · ARROYO Films
            </span>
          </div>
        </div>

        {/* Case Study Header & Meta */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#D4AF37] mb-2 font-technical font-semibold">
            <span>{project.tagDisplay || `${project.category} / VIDEO`}</span>
          </div>

          <h1
            id="case-study-title"
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4 uppercase font-sans"
          >
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-[#A7A39D] leading-relaxed max-w-3xl">
            {project.summary}
          </p>
        </header>

        {/* 3 COLUMNS BREAKDOWN (OBJETIVO | CONCEPTO | SERVICIOS) - Mockup Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#121212] p-6 rounded-2xl border border-white/10">
            <h3 className="text-xs uppercase tracking-[0.2em] font-technical text-white font-bold mb-3 pb-2 border-b border-white/10">
              OBJETIVO
            </h3>
            <p className="text-xs text-[#A7A39D] leading-relaxed">
              {cs.overview}
            </p>
          </div>

          <div className="bg-[#121212] p-6 rounded-2xl border border-white/10">
            <h3 className="text-xs uppercase tracking-[0.2em] font-technical text-white font-bold mb-3 pb-2 border-b border-white/10">
              CONCEPTO
            </h3>
            <p className="text-xs text-[#A7A39D] leading-relaxed">
              {cs.creativeConcept}
            </p>
          </div>

          <div className="bg-[#121212] p-6 rounded-2xl border border-white/10">
            <h3 className="text-xs uppercase tracking-[0.2em] font-technical text-white font-bold mb-3 pb-2 border-b border-white/10">
              SERVICIOS
            </h3>
            <ul className="space-y-2 text-xs text-[#A7A39D]">
              {(cs.brandApplications.slice(0, 4) || []).map((srv, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-0.5">·</span>
                  <span>{srv}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Visual Identity System (Palette, Typography, Art Direction) */}
        <section className="mb-16">
          <h3 className="text-xs uppercase tracking-[0.2em] font-technical text-[#D4AF37] mb-6 pb-2 border-b border-[#F1EEE8]/10">
            04. Sistema de Identidad Visual
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Chromatic Palette */}
            <div className="md:col-span-6 bg-[#141414] p-6 rounded-xl border border-[#F1EEE8]/10">
              <span className="text-xs text-[#F1EEE8] font-medium block mb-4">
                Paleta Cromática de Proyecto
              </span>
              <div className="grid grid-cols-2 gap-3">
                {cs.visualIdentity.palette.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 rounded bg-[#0A0A0A] border border-[#F1EEE8]/10">
                    <div
                      className="w-8 h-8 rounded shrink-0 border border-white/20 shadow-inner"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div>
                      <span className="text-xs text-[#F1EEE8] font-medium block">{color.name}</span>
                      <span className="text-[10px] font-technical text-[#A7A39D] block">{color.hex}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography & Art Direction specs */}
            <div className="md:col-span-6 flex flex-col gap-4">
              <div className="bg-[#141414] p-6 rounded-xl border border-[#F1EEE8]/10">
                <span className="text-xs text-[#F1EEE8] font-medium block mb-2">
                  Sistema Tipográfico
                </span>
                <p className="text-xs text-[#A7A39D] leading-relaxed">
                  {cs.visualIdentity.typography}
                </p>
              </div>

              <div className="bg-[#141414] p-6 rounded-xl border border-[#F1EEE8]/10">
                <span className="text-xs text-[#F1EEE8] font-medium block mb-2">
                  Dirección de Arte & Iluminación
                </span>
                <p className="text-xs text-[#A7A39D] leading-relaxed">
                  {cs.visualIdentity.artDirection}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* B2B Commercial Conditions & Quotation Standard (rendered when project includes b2bCommercialTerms, e.g. Elastómeros Virgo) */}
        {cs.b2bCommercialTerms && (
          <section className="mb-16 rounded-2xl bg-[#0D1017] border border-[#2563EB]/40 p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-technical uppercase tracking-[0.25em] text-[#38BDF8] block mb-1">
                  Esquema de Condiciones Comerciales B2B
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white uppercase font-sans">
                  Formato Estándar de Cotización & Negociación
                </h3>
              </div>
              <span className="self-start sm:self-auto text-xs font-technical bg-[#2563EB]/20 text-[#38BDF8] border border-[#2563EB]/40 px-3 py-1 rounded-full">
                ELASTOMEROS VIRGO · B2B Oficial
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* 3 Phases Badges from the document */}
              <div className="lg:col-span-7 space-y-4">
                {/* Step 1 */}
                <div className="p-4 rounded-xl bg-[#131722] border border-[#2563EB]/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white font-bold text-[10px] font-technical flex items-center justify-center">
                      1
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {cs.b2bCommercialTerms.toolingPayment}
                    </h4>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-[#A7A39D] font-technical pt-2 border-t border-white/5">
                    {cs.b2bCommercialTerms.toolingBreakdown.map((item, i) => (
                      <li key={i} className="bg-black/40 p-2 rounded border border-white/5">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-xl bg-[#131722] border border-[#2563EB]/30 flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white font-bold text-[10px] font-technical flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white mb-0.5">
                      Producción de Piezas
                    </h4>
                    <p className="text-xs text-[#A7A39D]">
                      Entregas Just in Time y precios según volumen de piezas (MOQ).
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-xl bg-[#131722] border border-[#2563EB]/30 flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white font-bold text-[10px] font-technical flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white mb-0.5">
                      Mantenimiento de Moldes Incluido
                    </h4>
                    <p className="text-xs text-[#A7A39D]">
                      Conservación preventiva y vida útil de moldes asegurada por ELASTOMEROS VIRGO.
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Image Plate with Inspector */}
              <div className="lg:col-span-5">
                <div
                  onClick={() =>
                    setLightboxStill({
                      title: 'Formato Estándar de Cotización B2B — ELASTOMEROS VIRGO',
                      description: 'Esquema de condiciones comerciales, desarrollo de utillajes y control de calidad en planta de transformación.',
                      type: 'ui',
                      motif: 'document',
                      color: '#2563EB',
                      imageUrl: cs.b2bCommercialTerms.documentImageUrl,
                      shotType: 'Documentación Comercial Oficial B2B',
                      lens: 'Esquema y Control de Calidad',
                      lighting: 'Metrología & Taller Industrial',
                      gradingNote: 'Condiciones Comerciales Oficiales',
                    })
                  }
                  className="group relative rounded-xl overflow-hidden border border-white/20 bg-black cursor-pointer shadow-xl aspect-[3/4] flex items-center justify-center"
                >
                  <img
                    src={cs.b2bCommercialTerms.documentImageUrl}
                    alt="Formato Estándar de Cotización B2B"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-semibold text-white bg-black/50 backdrop-blur-sm">
                    <Maximize2 size={16} />
                    <span>Inspeccionar Documento B2B</span>
                  </div>
                </div>
                <span className="text-[10px] font-technical text-white/50 block text-center mt-2">
                  Haz clic para ampliar la infografía comercial completa
                </span>
              </div>
            </div>
          </section>
        )}

        {/* 05. FOTOGRAMAS & DIRECCIÓN CINEMATOGRÁFICA (4 PUNTOS DE VISTA) */}
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#F1EEE8]/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#D4AF37] text-black font-bold text-[11px] font-technical flex items-center justify-center">
                  5
                </span>
                <h3 className="text-xs uppercase tracking-[0.2em] font-technical text-[#D4AF37] font-bold">
                  Fotogramas & Dirección Cinematográfica
                </h3>
              </div>
              <p className="text-xs text-[#A7A39D] font-technical mt-1">
                Análisis técnico de encuadre, ópticas y corrección de color DaVinci en 4 puntos de vista clave.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-technical bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 px-2.5 py-1 rounded">
                {stills.length} Puntos de Vista Oficiales
              </span>
            </div>
          </div>

          {/* 4 Puntos de Vista Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {stills.map((still, idx) => {
              const isSelected = activeStillIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveStillIndex(idx)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                    isSelected
                      ? 'bg-[#1C1C1C] border-[#D4AF37] ring-1 ring-[#D4AF37]/50 text-white shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                      : 'bg-[#101010] border-white/10 text-[#A7A39D] hover:border-white/30 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-technical text-[10px] text-[#D4AF37] font-bold">
                      PUNTO 0{idx + 1}
                    </span>
                    {still.timecode && (
                      <span className="text-[10px] font-technical text-white/50">
                        TC {still.timecode}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold truncate block">
                    {still.title.replace(/^\d+\s*·\s*/, '')}
                  </span>
                  <span className="text-[10px] font-technical text-white/40 block mt-1 truncate">
                    {still.lens || still.shotType || 'Óptica Cinematográfica'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* SPOTLIGHT CINEMATOGRAPHY VISOR (Full Frame Display) */}
          {activeStill && (
            <div className="mb-8 rounded-2xl bg-[#121212] border border-[#D4AF37]/40 shadow-2xl overflow-hidden relative group">
              {/* Image Frame Plate with 16:9 Cinema Ratio */}
              <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
                {activeStill.imageUrl ? (
                  <img
                    src={activeStill.imageUrl}
                    alt={activeStill.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                  />
                ) : (
                  <div
                    className="w-full h-full relative flex items-center justify-center p-6"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${activeStill.color}25 0%, #0B0B0B 80%)`,
                    }}
                  >
                    <div className="text-center z-10">
                      <Film size={36} className="mx-auto mb-3 text-[#D4AF37]" />
                      <span className="font-editorial text-lg italic text-[#F1EEE8] block">
                        {activeStill.title}
                      </span>
                      <span className="text-xs text-[#A7A39D] font-technical mt-1 block">
                        Fotograma Master Cinematográfico
                      </span>
                    </div>
                  </div>
                )}

                {/* Subtle Cinema Grain & Scope bars */}
                <div className="absolute inset-0 cinema-grain opacity-20 pointer-events-none" />

                {/* Framing Guides Overlay (Rule of Thirds + Center Crosshair) */}
                {showFramingGuides && (
                  <div className="absolute inset-0 pointer-events-none z-10">
                    {/* Horizontal 1/3 lines */}
                    <div className="absolute top-1/3 left-0 right-0 h-px bg-[#D4AF37]/35 border-t border-dashed border-[#D4AF37]/40" />
                    <div className="absolute top-2/3 left-0 right-0 h-px bg-[#D4AF37]/35 border-t border-dashed border-[#D4AF37]/40" />
                    {/* Vertical 1/3 lines */}
                    <div className="absolute left-1/3 top-0 bottom-0 w-px bg-[#D4AF37]/35 border-l border-dashed border-[#D4AF37]/40" />
                    <div className="absolute left-2/3 top-0 bottom-0 w-px bg-[#D4AF37]/35 border-l border-dashed border-[#D4AF37]/40" />
                    {/* Center Crosshair */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6">
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-[#D4AF37]/70" />
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#D4AF37]/70" />
                    </div>
                  </div>
                )}

                {/* Top HUD: Shot Type and Timecode */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-technical pointer-events-none z-20">
                  <div className="flex items-center gap-2">
                    <span className="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-[#D4AF37] font-bold border border-[#D4AF37]/30">
                      PUNTO DE VISTA 0{activeStillIndex + 1}
                    </span>
                    {activeStill.shotType && (
                      <span className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[#F1EEE8] border border-white/10 hidden sm:inline">
                        {activeStill.shotType}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pointer-events-auto">
                    {activeStill.timecode && (
                      <span className="bg-black/85 backdrop-blur-md px-2.5 py-1 rounded text-[#F1EEE8] border border-white/15 flex items-center gap-1.5 font-bold">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span>TC {activeStill.timecode}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Overlay Action HUD */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-20">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowFramingGuides(!showFramingGuides)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-technical transition-all flex items-center gap-1.5 ${
                        showFramingGuides
                          ? 'bg-[#D4AF37] text-black font-bold'
                          : 'bg-black/70 backdrop-blur-md text-[#F1EEE8] hover:bg-black/90 border border-white/20'
                      }`}
                      title="Alternar cuadrícula de composición (Regla de Tercios)"
                    >
                      <Grid size={13} />
                      <span>{showFramingGuides ? 'Guías: ON' : 'Regla de Tercios'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLightboxStill(activeStill)}
                      className="px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md text-[#F1EEE8] hover:bg-black/90 border border-white/20 text-xs font-technical transition-all flex items-center gap-1.5"
                      title="Inspeccionar en pantalla completa"
                    >
                      <Maximize2 size={13} />
                      <span className="hidden sm:inline">Inspeccionar</span>
                    </button>
                  </div>

                  {project.videoUrl && activeStill.timecode && (
                    <button
                      type="button"
                      onClick={() => handleJumpToVideo(activeStill.timecode)}
                      className="px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#F1EEE8] text-black font-bold text-xs font-technical transition-all flex items-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <Play size={13} fill="currentColor" />
                      <span>Ver Punto en Video (TC {activeStill.timecode})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Technical Cinematography Specs Bar */}
              <div className="p-6 bg-[#0E0E0E] border-t border-white/10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                  <div>
                    <h4 className="text-base font-bold text-[#F1EEE8] mb-1">
                      {activeStill.title}
                    </h4>
                    <p className="text-xs text-[#A7A39D] leading-relaxed max-w-2xl">
                      {activeStill.description}
                    </p>
                  </div>

                  {activeStill.lens && (
                    <button
                      type="button"
                      onClick={() => handleCopyTechSpecs(`${activeStill.title}: ${activeStill.lens} | ${activeStill.lighting} | ${activeStill.gradingNote}`)}
                      className="self-start lg:self-auto text-xs font-technical text-[#D4AF37] hover:text-[#F1EEE8] transition-colors flex items-center gap-1 border border-[#D4AF37]/30 px-3 py-1.5 rounded-lg bg-[#141414]"
                    >
                      {copiedNote ? <Check size={13} className="text-[#4ADE80]" /> : <Camera size={13} />}
                      <span>{copiedNote || 'Copiar Ficha Técnica'}</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/5 text-xs font-technical">
                  <div className="bg-[#141414] p-3 rounded-xl border border-white/5">
                    <span className="text-[#D4AF37] block font-bold mb-0.5">Óptica & Sensor</span>
                    <span className="text-white/80">{activeStill.lens || '85mm T1.5 · Arri Full Frame'}</span>
                  </div>
                  <div className="bg-[#141414] p-3 rounded-xl border border-white/5">
                    <span className="text-[#D4AF37] block font-bold mb-0.5">Esquema de Iluminación</span>
                    <span className="text-white/80">{activeStill.lighting || 'Iluminación Suave de Estudio 3200K'}</span>
                  </div>
                  <div className="bg-[#141414] p-3 rounded-xl border border-white/5">
                    <span className="text-[#D4AF37] block font-bold mb-0.5">Gradación de Color</span>
                    <span className="text-white/80">{activeStill.gradingNote || 'DaVinci Resolve Rec.709 Master'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4 PUNTOS DE VISTA THUMBNAIL FILMSTRIP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stills.map((still, idx) => {
              const isSelected = activeStillIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStillIndex(idx)}
                  className={`bg-[#141414] border rounded-2xl overflow-hidden flex flex-col justify-between transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                    isSelected
                      ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/40 bg-[#1A1A1A] shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                      : 'border-white/10 hover:border-white/30 hover:bg-[#181818]'
                  }`}
                >
                  {/* Visual plate */}
                  <div className="w-full aspect-video relative flex items-center justify-center overflow-hidden bg-black">
                    {still.imageUrl ? (
                      <img
                        src={still.imageUrl}
                        alt={still.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center p-4 text-center"
                        style={{
                          background: `radial-gradient(circle at 50% 50%, ${still.color}25 0%, #0B0B0B 80%)`,
                        }}
                      >
                        <Film size={22} className="text-[#D4AF37]/60 mb-1" />
                      </div>
                    )}

                    {still.timecode && (
                      <span className="absolute top-2 right-2 text-[9px] font-technical text-[#F1EEE8] bg-black/80 px-2 py-0.5 rounded border border-white/20">
                        TC {still.timecode}
                      </span>
                    )}

                    <span className="absolute top-2 left-2 text-[9px] font-technical bg-[#D4AF37] text-black font-bold px-1.5 py-0.5 rounded">
                      0{idx + 1}
                    </span>

                    {/* Quick Jump overlay button */}
                    {project.videoUrl && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveStillIndex(idx);
                          handleJumpToVideo(still.timecode);
                        }}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs text-[#D4AF37] font-bold font-technical"
                      >
                        <Play size={14} fill="currentColor" />
                        <span>Saltar en Video</span>
                      </button>
                    )}
                  </div>

                  {/* Annotation */}
                  <div className="p-3.5 bg-[#101010] flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#F1EEE8] group-hover:text-[#D4AF37] transition-colors mb-1 line-clamp-1">
                        {still.title.replace(/^\d+\s*·\s*/, '')}
                      </h4>
                      <p className="text-[11px] text-[#A7A39D] leading-relaxed line-clamp-2">
                        {still.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-technical text-white/40">
                      <span className="truncate">{still.lens || '85mm'}</span>
                      <span className="text-[#D4AF37]">{isSelected ? '● ACTIVO' : 'VER →'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Deliverables & Applications */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-[#141414] p-8 rounded-xl border border-[#F1EEE8]/10">
            <h3 className="text-xs uppercase tracking-[0.2em] font-technical text-[#D4AF37] mb-4">
              06. Aplicaciones de Marca
            </h3>
            <ul className="space-y-3 text-xs text-[#A7A39D]">
              {cs.brandApplications.map((app, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#141414] p-8 rounded-xl border border-[#F1EEE8]/10">
            <h3 className="text-xs uppercase tracking-[0.2em] font-technical text-[#D4AF37] mb-4">
              07. Entregables Finales
            </h3>
            <ul className="space-y-3 text-xs text-[#A7A39D]">
              {cs.deliverables.map((deliv, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 mt-1.5" />
                  <span>{deliv}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Conceptual Results when present */}
        {cs.conceptualResults && cs.conceptualResults.length > 0 && (
          <div className="p-6 rounded-xl bg-[#141414] border border-[#F1EEE8]/10 mb-16">
            <h3 className="text-xs uppercase tracking-[0.2em] font-technical text-[#A7A39D] mb-3">
              08. Impacto y Proyecciones Conceptuales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#F1EEE8]">
              {cs.conceptualResults.map((res, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-[#D4AF37] font-technical">↗</span>
                  <span>{res}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Project & Back Footer Bar matching mockup */}
        <div className="pt-10 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-technical text-[#A7A39D] block mb-1">
              Siguiente Proyecto
            </span>
            <button
              onClick={() => onNavigateProject(nextProject)}
              className="text-xl sm:text-2xl font-extrabold text-white hover:text-[#D4AF37] transition-colors text-left flex items-center gap-2 uppercase font-sans"
            >
              <span>{nextProject.title}</span>
              <ArrowRight size={20} className="text-[#D4AF37]" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-3 text-xs font-semibold tracking-wider text-black bg-white hover:bg-[#D4AF37] transition-all rounded-full self-start sm:self-auto shadow-lg"
          >
            Ver más proyectos →
          </button>
        </div>
      </div>

      {/* FULLSCREEN CINEMA LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxStill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8"
          >
            {/* Top Lightbox Bar */}
            <div className="flex items-center justify-between text-xs font-technical text-[#A7A39D] pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">INSPECTOR CINEMATOGRÁFICO</span>
                <span>·</span>
                <span className="text-white">{lightboxStill.title}</span>
                {lightboxStill.timecode && (
                  <span className="text-[#D4AF37]">· TC {lightboxStill.timecode}</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowFramingGuides(!showFramingGuides)}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    showFramingGuides
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Grid size={12} className="inline mr-1" />
                  <span>Guías</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLightboxStill(null)}
                  className="p-1.5 text-white/70 hover:text-white rounded bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Main Lightbox Frame */}
            <div className="relative my-auto max-w-6xl mx-auto w-full flex items-center justify-center">
              <div className="relative aspect-video max-h-[75vh] w-full rounded-xl overflow-hidden bg-black border border-white/20 shadow-[0_0_80px_rgba(0,0,0,0.9)] flex items-center justify-center">
                {lightboxStill.imageUrl ? (
                  <img
                    src={lightboxStill.imageUrl}
                    alt={lightboxStill.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-8">
                    <Film size={48} className="mx-auto text-[#D4AF37] mb-2" />
                    <h3 className="font-editorial text-2xl text-white italic">{lightboxStill.title}</h3>
                  </div>
                )}

                {/* Framing Guides Overlay */}
                {showFramingGuides && (
                  <div className="absolute inset-0 pointer-events-none z-10">
                    <div className="absolute top-1/3 left-0 right-0 h-px bg-[#D4AF37]/40 border-t border-dashed border-[#D4AF37]/50" />
                    <div className="absolute top-2/3 left-0 right-0 h-px bg-[#D4AF37]/40 border-t border-dashed border-[#D4AF37]/50" />
                    <div className="absolute left-1/3 top-0 bottom-0 w-px bg-[#D4AF37]/40 border-l border-dashed border-[#D4AF37]/50" />
                    <div className="absolute left-2/3 top-0 bottom-0 w-px bg-[#D4AF37]/40 border-l border-dashed border-[#D4AF37]/50" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8">
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-[#D4AF37]/80" />
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#D4AF37]/80" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Lightbox Technical Specs Bar */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-technical text-[#A7A39D]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-white">Óptica: <strong className="text-[#D4AF37]">{lightboxStill.lens || '85mm T1.5'}</strong></span>
                <span>·</span>
                <span className="text-white">Luz: <strong className="text-[#D4AF37]">{lightboxStill.lighting || 'Estudio 3200K'}</strong></span>
                <span>·</span>
                <span className="text-white">Color: <strong className="text-[#D4AF37]">{lightboxStill.gradingNote || 'DaVinci 709'}</strong></span>
              </div>

              {project.videoUrl && lightboxStill.timecode && (
                <button
                  type="button"
                  onClick={() => {
                    const tc = lightboxStill.timecode;
                    setLightboxStill(null);
                    handleJumpToVideo(tc);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-bold text-xs hover:bg-white transition-colors flex items-center gap-2 self-start sm:self-auto"
                >
                  <Play size={13} fill="currentColor" />
                  <span>Cerrar e Ir a Video (TC {lightboxStill.timecode})</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
