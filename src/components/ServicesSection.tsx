import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { studioServices } from '../data/portfolioData';
import { Plus, Minus, ArrowRight, CheckCircle2, Calculator, Sparkles } from 'lucide-react';
import { calculatePackageEstimate } from '../utils/portfolio';
import { getMotionVariants } from '../utils/motionVariants';

interface ServicesSectionProps {
  onSelectServiceForInquiry: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForInquiry,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [calculatorServices, setCalculatorServices] = useState<string[]>([
    'Desarrollo de Marca',
    'Producción Audiovisual',
  ]);

  const shouldReduceMotion = useReducedMotion();
  const motionSystem = getMotionVariants(!!shouldReduceMotion);

  const toggleService = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const toggleCalculatorService = (title: string) => {
    setCalculatorServices((prev) => {
      if (prev.includes(title)) {
        return prev.filter((s) => s !== title);
      } else {
        return [...prev, title];
      }
    });
  };

  const estimate = calculatePackageEstimate(calculatorServices);

  return (
    <motion.section
      id="servicios"
      variants={motionSystem.pageContainer}
      initial="hidden"
      animate="visible"
      className="py-12 sm:py-20 px-6 sm:px-8 max-w-7xl mx-auto"
      aria-label="Servicios"
    >
      {/* Header with Masked Title Reveal */}
      <motion.div
        variants={motionSystem.fadeUp}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#F1EEE8]/10"
      >
        <div>
          <span className="text-xs tracking-[0.25em] uppercase text-[#D4AF37] block mb-2 font-medium">
            Capacidades Creativas & Audiovisuales
          </span>
          <div className="overflow-hidden">
            <motion.h2
              variants={motionSystem.headlineMaskLine}
              className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F1EEE8]"
            >
              Servicios & Producción
            </motion.h2>
          </div>
        </div>
        <p className="text-xs text-[#A7A39D] font-technical">
          Despliega cada área para consultar alcance detallado y entregables
        </p>
      </motion.div>

      {/* Minimalist Editorial Accordion Index */}
      <motion.div
        variants={motionSystem.gridContainer}
        className="divide-y divide-white/10 border-t border-b border-white/10 mb-16"
      >
        {studioServices.map((service) => {
          const isExpanded = expandedId === service.id;
          return (
            <motion.div
              key={service.id}
              variants={motionSystem.fadeUp}
              className="transition-colors group"
            >
              <button
                onClick={() => toggleService(service.id)}
                className="w-full py-7 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-lg px-2 -mx-2"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-4 sm:gap-8">
                  <span className="font-technical text-xs sm:text-sm text-[#D4AF37]">
                    {service.number}
                  </span>
                  <h3 className="text-lg sm:text-2xl font-bold text-[#F1EEE8] group-hover:text-[#D4AF37] transition-colors">
                    {service.title}
                  </h3>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-[#A7A39D] font-technical hidden sm:inline">
                    {service.typicalTimeline}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-[#F1EEE8] group-hover:border-[#D4AF37] transition-colors">
                    {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
                  </div>
                </div>
              </button>

              {/* Collapsible Hidden Content Drawer */}
              {isExpanded && (
                <div className="pb-8 pt-2 grid grid-cols-1 md:grid-cols-12 gap-8 text-xs text-[#A7A39D]">
                  <div className="md:col-span-5">
                    <p className="font-editorial italic text-sm sm:text-base text-[#F1EEE8] mb-3">
                      «{service.tagline}»
                    </p>
                    <p className="leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <button
                      onClick={() => onSelectServiceForInquiry(service.title)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F1EEE8] text-[#090909] font-bold rounded uppercase tracking-wider text-[11px] hover:bg-[#D4AF37] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                    >
                      <span>Cotizar {service.title}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  <div className="md:col-span-4 bg-[#121212] p-5 rounded-lg border border-white/5">
                    <span className="font-technical text-[11px] uppercase tracking-wider text-[#F1EEE8] block mb-3">
                      Disciplinas
                    </span>
                    <ul className="space-y-2">
                      {service.disciplines.map((d, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-[#D4AF37] shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:col-span-3 bg-[#121212] p-5 rounded-lg border border-white/5">
                    <span className="font-technical text-[11px] uppercase tracking-wider text-[#F1EEE8] block mb-3">
                      Entregables
                    </span>
                    <ul className="space-y-2">
                      {service.deliverables.map((deliv, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Interactive Cotizador Dinámico de Producción */}
      <motion.div
        variants={motionSystem.scaleUp}
        className="bg-[#121212] border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
          <div>
            <span className="font-technical text-[10px] uppercase text-[#D4AF37] tracking-widest block mb-1 flex items-center gap-1.5">
              <Calculator size={13} />
              <span>ESTIMADOR DE PRODUCCIÓN EN TIEMPO REAL</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#F1EEE8]">
              Calcula tu Paquete de Servicios
            </h3>
          </div>
          <span className="text-xs text-[#A7A39D] font-technical">
            Selecciona disciplinas combinadas para obtener sinergia de producción (-15%)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3">
            {studioServices.map((srv) => {
              const isChecked = calculatorServices.includes(srv.title);
              return (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => toggleCalculatorService(srv.title)}
                  className={`w-full p-4 rounded-xl border transition-all text-left flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                    isChecked
                      ? 'bg-[#1A1A1A] border-[#D4AF37] text-[#F1EEE8]'
                      : 'bg-[#0E0E0E] border-white/10 text-[#A7A39D] hover:border-white/20'
                  }`}
                  aria-pressed={isChecked}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-technical text-xs text-[#D4AF37]">{srv.number}</span>
                    <span className="text-sm font-medium">{srv.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-technical text-[#A7A39D] hidden sm:inline">{srv.typicalTimeline}</span>
                    <span
                      className={`w-5 h-5 rounded border flex items-center justify-center text-xs font-bold ${
                        isChecked
                          ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
                          : 'border-white/20 text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-5 bg-[#090909] border border-white/10 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-technical uppercase text-[#A7A39D] tracking-wider block mb-2">
                RANGO DE INVERSIÓN ESTIMADA
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-[#D4AF37] mb-2 font-technical tabular-nums">
                {estimate.label}
              </div>
              <p className="text-xs text-[#A7A39D] leading-relaxed mb-6">
                {calculatorServices.length >= 3 ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <Sparkles size={12} /> Descuento de sinergia multidisciplinar del 15% aplicado.
                  </span>
                ) : (
                  'Incluye dirección de arte, derechos comerciales y entrega de masters en alta resolución.'
                )}
              </p>
            </div>

            <button
              onClick={() => onSelectServiceForInquiry(calculatorServices.join(', '))}
              disabled={calculatorServices.length === 0}
              className="w-full py-3.5 px-6 rounded-lg bg-[#F1EEE8] hover:bg-[#D4AF37] text-[#090909] font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              <span>Solicitar con esta Selección</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};
