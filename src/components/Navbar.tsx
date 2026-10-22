import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { ViewType } from '../utils/portfolio';

interface NavbarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; view: ViewType }[] = [
    { label: 'Inicio', view: 'home' },
    { label: 'Proyectos', view: 'proyectos' },
    { label: 'Servicios', view: 'servicios' },
    { label: 'Estudio', view: 'estudio' },
    { label: 'Contacto', view: 'contacto' },
  ];

  const handleNavClick = (view: ViewType) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#090909]/95 backdrop-blur-md border-b border-white/10 py-3.5 shadow-2xl'
            : 'bg-gradient-to-b from-[#090909]/90 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between gap-8">
          {/* Studio Brand Wordmark: ARROYO + LUMEN & FORM */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
            aria-label="ARROYO — Lumen & Form - Volver al inicio"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] group-hover:scale-125 transition-transform shrink-0" />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#F1EEE8] group-hover:text-[#D4AF37] transition-colors leading-none font-sans">
                ARROYO
              </span>
              <span className="text-[9px] tracking-[0.28em] text-[#A7A39D] font-technical uppercase mt-1 leading-none">
                LUMEN & FORM · BRANDING & FILMS
              </span>
            </div>
          </button>

          {/* Clean Desktop Navigation with active bottom underline indicator matching reference */}
          <nav
            className="hidden md:flex items-center gap-8 text-sm font-medium"
            aria-label="Navegación principal por secciones"
          >
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.view)}
                  className={`relative py-1.5 text-xs sm:text-sm tracking-wide transition-colors duration-200 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-[#A7A39D] hover:text-[#F1EEE8]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Primary Action Button + Hamburger Menu */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => {
                onNavigate('contacto');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold tracking-wider text-black bg-white hover:bg-[#D4AF37] transition-all rounded-full whitespace-nowrap shadow-md group"
            >
              <span>Iniciar un proyecto</span>
              <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            {/* Hamburger menu icon button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F1EEE8] hover:text-[#D4AF37] transition-colors rounded-lg hover:bg-white/5"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          className="fixed inset-0 z-40 bg-[#090909]/98 backdrop-blur-2xl flex flex-col justify-between px-8 py-24 md:hidden transition-all duration-300 animate-fade-in"
        >
          <div className="flex flex-col gap-5">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-technical block mb-1">
              ARROYO · LUMEN & FORM
            </span>
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.view)}
                  className={`text-2xl font-light text-left transition-colors py-2.5 border-b border-[#F1EEE8]/10 flex items-center justify-between ${
                    isActive ? 'text-white font-bold' : 'text-[#A7A39D] hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="text-xs font-technical uppercase text-[#D4AF37]">● Activo</span>}
                </button>
              );
            })}
          </div>

          <div className="pt-8 border-t border-[#F1EEE8]/10 flex flex-col gap-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('contacto');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3.5 text-xs font-bold tracking-widest uppercase text-black bg-white hover:bg-[#D4AF37] transition-colors rounded-full text-center shadow-lg"
            >
              Iniciar un proyecto →
            </button>
            <div className="text-xs text-[#A7A39D] flex justify-between pt-2 font-technical">
              <span>contacto@arroyo.studio</span>
              <span>Madrid · CDMX</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
