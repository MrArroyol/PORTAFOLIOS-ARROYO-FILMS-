/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HomePortal } from './components/HomePortal';
import { ProjectGrid } from './components/ProjectGrid';
import { ShowreelSection } from './components/ShowreelSection';
import { ServicesSection } from './components/ServicesSection';
import { ProcessSection } from './components/ProcessSection';
import { StudioSection } from './components/StudioSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CaseStudyModal } from './components/CaseStudyModal';
import { sampleProjects } from './data/portfolioData';
import { Project } from './types/portfolio';
import { ViewType, parseViewFromHash } from './utils/portfolio';
import { getMotionVariants } from './utils/motionVariants';
import { ArrowLeft } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>(() =>
    parseViewFromHash(typeof window !== 'undefined' ? window.location.hash : '')
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [preSelectedService, setPreSelectedService] = useState<string | null>(null);

  const shouldReduceMotion = useReducedMotion();
  const motionSystem = getMotionVariants(!!shouldReduceMotion);

  // Sync with browser back/forward and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentView(parseViewFromHash(window.location.hash));
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    if (view === 'home') {
      window.history.pushState(null, '', window.location.pathname);
    } else {
      window.location.hash = `#${view}`;
    }
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  };

  const handleSelectServiceForInquiry = (serviceTitle: string) => {
    setPreSelectedService(serviceTitle);
    handleNavigate('contacto');
  };

  const sectionTabs: { id: ViewType; label: string; number: string }[] = [
    { id: 'proyectos', label: 'Proyectos', number: '01' },
    { id: 'showreel', label: 'Showreel', number: '02' },
    { id: 'servicios', label: 'Servicios', number: '03' },
    { id: 'estudio', label: 'Estudio & Proceso', number: '04' },
    { id: 'contacto', label: 'Contacto', number: '05' },
  ];

  return (
    <div className="min-h-screen bg-[#090909] text-[#F1EEE8] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-[#090909]">
      {/* Top Bar Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenContact={() => handleNavigate('contacto')}
      />

      {/* Section Sub-Header / Breadcrumb Navigation with refined segmented styling */}
      {currentView !== 'home' && (
        <div className="pt-20 sm:pt-24 pb-3.5 px-6 sm:px-8 border-b border-white/10 bg-[#090909]/95 backdrop-blur-md sticky top-14 sm:top-16 z-30">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              onClick={() => handleNavigate('home')}
              className="inline-flex items-center gap-2 text-xs font-technical text-[#A7A39D] hover:text-[#D4AF37] transition-colors group self-start focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>← VOLVER AL PORTAL PRINCIPAL</span>
            </button>

            {/* Accessible Segmented View Switcher */}
            <div
              className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar text-xs font-technical p-1 bg-[#121212] rounded-lg border border-white/10"
              role="tablist"
              aria-label="Selector de sección"
            >
              {sectionTabs.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleNavigate(item.id)}
                    className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap shrink-0 text-xs flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] ${
                      isActive
                        ? 'bg-[#F1EEE8] text-[#090909] font-bold shadow-sm'
                        : 'text-[#A7A39D] hover:text-[#F1EEE8] hover:bg-white/5'
                    }`}
                  >
                    <span className={isActive ? 'text-[#090909]' : 'text-[#D4AF37]'}>{item.number}.</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area with Staggered Animated Transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="view-home"
              variants={motionSystem.pageContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="gpu-layer"
            >
              <HomePortal
                onNavigate={handleNavigate}
                onSelectProject={(proj) => setSelectedProject(proj)}
              />
            </motion.div>
          )}

          {currentView === 'proyectos' && (
            <motion.div
              key="view-proyectos"
              variants={motionSystem.pageContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="gpu-layer"
            >
              <ProjectGrid
                projects={sampleProjects}
                onSelectProject={(proj) => setSelectedProject(proj)}
              />
            </motion.div>
          )}

          {currentView === 'showreel' && (
            <motion.div
              key="view-showreel"
              variants={motionSystem.pageContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="gpu-layer"
            >
              <ShowreelSection />
            </motion.div>
          )}

          {currentView === 'servicios' && (
            <motion.div
              key="view-servicios"
              variants={motionSystem.pageContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="gpu-layer"
            >
              <ServicesSection
                onSelectServiceForInquiry={handleSelectServiceForInquiry}
              />
            </motion.div>
          )}

          {currentView === 'estudio' && (
            <motion.div
              key="view-estudio"
              variants={motionSystem.pageContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="gpu-layer"
            >
              <StudioSection />
              <ProcessSection />
            </motion.div>
          )}

          {currentView === 'contacto' && (
            <motion.div
              key="view-contacto"
              variants={motionSystem.pageContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="gpu-layer"
            >
              <ContactSection preSelectedService={preSelectedService} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Case Study Modal (Accessible globally from any view with exit animation) */}
      <AnimatePresence>
        {selectedProject && (
          <CaseStudyModal
            project={selectedProject}
            allProjects={sampleProjects}
            onClose={() => setSelectedProject(null)}
            onNavigateProject={(proj) => setSelectedProject(proj)}
          />
        )}
      </AnimatePresence>

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
}
