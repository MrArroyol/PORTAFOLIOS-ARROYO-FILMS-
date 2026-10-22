import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Project, ProjectCategory } from '../types/portfolio';
import { filterProjectsByCategory, sortProjects, SortOption } from '../utils/portfolio';
import { VisualCover } from './VisualCover';
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Play,
  Check,
} from 'lucide-react';
import { getMotionVariants } from '../utils/motionVariants';

interface ProjectGridProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, onSelectProject }) => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('Todos');
  const [featuredIndex, setFeaturedIndex] = useState<number>(0);
  const [sortOption, setSortOption] = useState<SortOption>('destacados');
  const [sortDropdownOpen, setSortDropdownOpen] = useState<boolean>(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const shouldReduceMotion = useReducedMotion();
  const motionSystem = getMotionVariants(!!shouldReduceMotion);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter tabs matching the reference mockup
  const filterTabs: ProjectCategory[] = [
    'Todos',
    'Branding',
    'Videos',
    'Motion',
    'Campañas',
    'Digital',
  ];

  // Featured projects for the top showcase carousel (ordered by featuredOrder)
  const featuredProjects = [...projects].sort(
    (a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99)
  );
  const activeFeatured = featuredProjects[featuredIndex] || featuredProjects[0] || projects[0];

  // Filtered and sorted projects for the 4x2 grid
  const filtered = filterProjectsByCategory(projects, activeCategory);
  const displayedProjects = sortProjects(filtered, sortOption);

  const handlePrevFeatured = () => {
    setFeaturedIndex((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length);
  };

  const handleNextFeatured = () => {
    setFeaturedIndex((prev) => (prev + 1) % featuredProjects.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent, project: Project) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectProject(project);
    }
  };

  const sortLabels: Record<SortOption, string> = {
    destacados: 'Destacados',
    recientes: 'Más recientes',
    nombre: 'Por nombre (A–Z)',
    año: 'Año',
  };

  return (
    <motion.section
      id="proyectos"
      variants={motionSystem.pageContainer}
      initial="hidden"
      animate="visible"
      className="py-6 sm:py-10 max-w-7xl mx-auto px-6 sm:px-8"
      aria-label="Galería de Proyectos Arroyo"
    >
      {/* ============================================================== */}
      {/* 1. FEATURED HERO SHOWCASE CAROUSEL (Top of mockup)           */}
      {/* ============================================================== */}
      {activeFeatured && (
        <div className="relative mb-14 sm:mb-20 rounded-3xl overflow-hidden bg-[#0A0A0A] border border-white/10 shadow-2xl min-h-[460px] sm:min-h-[540px] flex flex-col justify-between p-6 sm:p-12 lg:p-14 group">
          {/* Background Visual Layer */}
          <div className="absolute inset-0 z-0">
            <VisualCover
              motif={activeFeatured.visualMotif}
              accentColor={activeFeatured.accentColor}
              title={activeFeatured.title}
              aspect="w-full h-full"
              videoUrl={activeFeatured.videoUrl}
              className="w-full h-full object-cover"
            />
            {/* Measured Scrim Gradient for 100% WCAG Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />
          </div>

          {/* Right Floating Discipline Tags (Mockup style) */}
          <div className="absolute top-8 right-8 z-10 hidden sm:flex items-center gap-2 text-[10px] font-technical uppercase tracking-[0.25em] text-white/50">
            <span>BRANDING</span>
            <span>·</span>
            <span>FILM</span>
            <span>·</span>
            <span>MOTION</span>
            <span>·</span>
            <span>DIGITAL</span>
          </div>

          {/* Top Info: Project Index (01 / 06) */}
          <div className="relative z-10">
            <span className="font-technical text-xs tracking-[0.3em] uppercase text-white/70 block mb-4">
              {String(featuredIndex + 1).padStart(2, '0')} / {String(featuredProjects.length).padStart(2, '0')}
            </span>
          </div>

          {/* Center-Left Hero Content */}
          <div className="relative z-10 max-w-2xl py-6 my-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeatured.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-2 uppercase font-sans">
                  {activeFeatured.title}
                </h1>

                <p className="text-base sm:text-lg text-white/80 font-medium mb-4">
                  {activeFeatured.subtitle}
                </p>

                <p className="text-sm sm:text-base text-[#A7A39D] leading-relaxed mb-8 max-w-xl">
                  {activeFeatured.summary}
                </p>

                {/* Actions: Pill Button "Ver proyecto" + "Ver video completo →" */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <button
                    onClick={() => onSelectProject(activeFeatured)}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-[#D4AF37] transition-all shadow-xl group/btn"
                  >
                    <span>Ver proyecto</span>
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  {activeFeatured.videoUrl && (
                    <button
                      onClick={() => onSelectProject(activeFeatured)}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-white transition-colors group/vid"
                    >
                      <Play size={13} className="text-[#D4AF37] fill-[#D4AF37]" />
                      <span className="underline-offset-4 group-hover/vid:underline">Ver video completo →</span>
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Controls: Arrows, Progress Line, Scroll Indicator */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            {/* Slider Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevFeatured}
                  className="w-9 h-9 rounded-full border border-white/20 bg-black/40 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                  aria-label="Proyecto destacado anterior"
                >
                  <ArrowLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleNextFeatured}
                  className="w-9 h-9 rounded-full border border-white/20 bg-black/40 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                  aria-label="Proyecto destacado siguiente"
                >
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Segmented Line Progress Bar */}
              <div className="flex items-center gap-1.5 w-24 sm:w-36">
                {featuredProjects.map((proj, idx) => (
                  <button
                    key={proj.id}
                    onClick={() => setFeaturedIndex(idx)}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      idx === featuredIndex ? 'bg-white' : 'bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Ir al proyecto destacado ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-technical uppercase tracking-[0.25em] text-white/50">
              <span>SCROLL</span>
              <div className="w-4 h-px bg-white/40" />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. FILTER & SORTING BAR (Tabs with active underline)           */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-8 border-b border-white/10">
        {/* Category Tabs: Active tab has crisp white text with white underline */}
        <div
          className="flex items-center gap-6 sm:gap-8 overflow-x-auto pb-2 no-scrollbar"
          role="tablist"
          aria-label="Filtrar proyectos por categoría"
        >
          {filterTabs.map((tab) => {
            const isActive = activeCategory === tab;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(tab)}
                className={`relative pb-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                <span>{tab}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeFilterUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Sort Dropdown: Ordenar ∨ */}
        <div className="relative self-end sm:self-auto" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
            className="flex items-center gap-2 text-xs font-medium text-white/80 hover:text-white py-1.5 px-3 rounded-lg border border-white/15 hover:border-white/30 bg-[#121212] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            aria-expanded={sortDropdownOpen}
            aria-haspopup="listbox"
          >
            <span>Ordenar: <strong>{sortLabels[sortOption]}</strong></span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${sortDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {sortDropdownOpen && (
            <div
              role="listbox"
              className="absolute right-0 mt-2 w-48 rounded-xl bg-[#141414] border border-white/15 shadow-2xl py-1.5 z-30 animate-fade-in"
            >
              {(['destacados', 'recientes', 'nombre', 'año'] as SortOption[]).map((opt) => (
                <button
                  key={opt}
                  role="option"
                  aria-selected={sortOption === opt}
                  onClick={() => {
                    setSortOption(opt);
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between transition-colors ${
                    sortOption === opt
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-[#A7A39D] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{sortLabels[opt]}</span>
                  {sortOption === opt && <Check size={13} className="text-white" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. 4 COLUMNS X 2 ROWS PROJECT GRID (8 Cards)                   */}
      {/* ============================================================== */}
      <motion.div
        variants={motionSystem.gridContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16"
      >
        {displayedProjects.map((project, idx) => {
          const isHovered = hoveredCardId === project.id;
          const displayTag = project.tagDisplay || `${project.category} / Video`;

          return (
            <motion.article
              key={project.id}
              variants={motionSystem.fadeUp}
              tabIndex={0}
              role="button"
              aria-label={`Ver proyecto ${project.title}: ${displayTag}`}
              onMouseEnter={() => setHoveredCardId(project.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              onClick={() => onSelectProject(project)}
              onKeyDown={(e) => handleKeyDown(e, project)}
              className="group relative rounded-2xl overflow-hidden bg-[#101010] border border-white/10 hover:border-white/40 transition-all duration-300 cursor-pointer shadow-lg aspect-[4/3] flex flex-col justify-end p-5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {/* Media Plate */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <VisualCover
                  motif={project.visualMotif}
                  accentColor={project.accentColor}
                  title={project.title}
                  aspect="w-full h-full"
                  videoUrl={project.isRealWork && (isHovered || (idx === 0 && !hoveredCardId)) ? project.videoUrl : undefined}
                  imageUrl={project.imageUrl}
                  isHovered={isHovered}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Real Work Indicator */}
                {project.isRealWork && (
                  <div className="absolute top-4 left-4 z-10 pointer-events-none">
                    <span className="text-[9px] font-technical uppercase tracking-widest text-black bg-[#D4AF37] px-2 py-0.5 rounded font-bold shadow-md">
                      ★ Caso Real
                    </span>
                  </div>
                )}

                {/* Dark Contrast Scrim Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
              </div>

              {/* Bottom Card Content: Title + Subtitle on Left, Circle Arrow on Right */}
              <div className="relative z-10 flex items-end justify-between gap-3 w-full">
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight uppercase group-hover:text-white transition-colors leading-tight font-sans">
                    {project.title}
                  </h3>
                  <span className="text-xs text-[#A7A39D] group-hover:text-white/80 transition-colors block mt-0.5 font-normal">
                    {displayTag}
                  </span>
                </div>

                {/* Bottom-right Circle Arrow Button */}
                <div className="w-9 h-9 rounded-full border border-white/25 bg-black/50 group-hover:bg-white group-hover:text-black text-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 shrink-0 shadow-md">
                  <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </motion.article>
          );
        })}
      </motion.div>

      {/* ============================================================== */}
      {/* 4. EDITORIAL BOTTOM BANNER (Bottom of mockup)                  */}
      {/* ============================================================== */}
      <div className="rounded-3xl bg-[#101010] border border-white/10 p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="max-w-2xl">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight font-sans mb-2">
            Marcas que se ven, se sienten y se recuerdan.
          </h2>
          <p className="text-sm sm:text-base text-[#A7A39D] leading-relaxed">
            Diseño de marca y producción audiovisual para proyectos que buscan algo más.
          </p>
        </div>

        <a
          href="#contacto"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/30 hover:border-white text-white hover:bg-white hover:text-black text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap self-start md:self-auto shadow-lg group"
        >
          <span>Iniciar un proyecto</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </motion.section>
  );
};
