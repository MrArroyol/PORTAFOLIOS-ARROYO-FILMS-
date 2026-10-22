import React from 'react';
import { ArrowUp } from 'lucide-react';
import { studioInfo } from '../data/portfolioData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#F1EEE8]/10 bg-[#070707] py-16 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col justify-between gap-12">
        {/* Top Footer Split */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-12 border-b border-[#F1EEE8]/10">
          <div>
            <a
              href="#top"
              className="text-2xl font-extrabold tracking-tight text-white hover:text-[#D4AF37] transition-colors inline-block mb-1 uppercase font-sans"
            >
              ARROYO
            </a>
            <span className="block text-[10px] font-technical uppercase tracking-[0.25em] text-[#A7A39D] mb-3">
              LUMEN & FORM · BRANDING & FILMS
            </span>
            <p className="text-xs text-[#A7A39D] max-w-sm leading-relaxed">
              «Marcas que se ven, se sienten y se recuerdan. Diseño de marca y producción audiovisual para proyectos que buscan algo más.»
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-technical text-[#B58A60] block mb-3">
                Navegación
              </span>
              <ul className="space-y-2 text-[#A7A39D]">
                <li><a href="#proyectos" className="hover:text-[#F1EEE8] transition-colors">Proyectos</a></li>
                <li><a href="#showreel" className="hover:text-[#F1EEE8] transition-colors">Showreel</a></li>
                <li><a href="#servicios" className="hover:text-[#F1EEE8] transition-colors">Servicios</a></li>
                <li><a href="#proceso" className="hover:text-[#F1EEE8] transition-colors">Proceso</a></li>
                <li><a href="#estudio" className="hover:text-[#F1EEE8] transition-colors">El Estudio</a></li>
              </ul>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-technical text-[#B58A60] block mb-3">
                Disciplinas
              </span>
              <ul className="space-y-2 text-[#A7A39D]">
                <li>Brand Identity</li>
                <li>Brand Films</li>
                <li>Motion Design</li>
                <li>Digital Experiences</li>
              </ul>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-technical text-[#B58A60] block mb-3">
                Sedes
              </span>
              <p className="text-[#A7A39D] leading-relaxed">
                Madrid · CDMX<br />
                Producciones globales y rodajes en localización.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#A7A39D]">
          <div>
            <span>© {new Date().getFullYear()} {studioInfo.name}. Todos los derechos reservados.</span>
            <span className="hidden sm:inline"> · </span>
            <span className="block sm:inline text-[#A7A39D]/70">Portafolio conceptual de branding & producción cinematográfica.</span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 hover:text-[#F1EEE8] transition-colors self-start sm:self-auto font-technical text-[11px] uppercase tracking-wider"
            aria-label="Volver arriba"
          >
            <span>Volver Arriba</span>
            <ArrowUp size={14} className="text-[#B58A60]" />
          </button>
        </div>
      </div>
    </footer>
  );
};
