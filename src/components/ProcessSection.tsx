import React, { useState } from 'react';
import { motion } from 'motion/react';
import { creativeProcessSteps } from '../data/portfolioData';
import { Layers } from 'lucide-react';
import {
  pageStaggerContainer,
  fadeUpItem,
  scaleUpItem,
  gridStaggerContainer,
} from '../utils/motionVariants';

export const ProcessSection: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  return (
    <motion.section
      id="proceso"
      variants={pageStaggerContainer}
      initial="hidden"
      animate="visible"
      className="py-12 sm:py-20 px-6 sm:px-8 max-w-7xl mx-auto"
      aria-label="Metodología"
    >
      {/* Header */}
      <motion.div
        variants={fadeUpItem}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#F1EEE8]/10"
      >
        <div>
          <span className="text-xs tracking-[0.25em] uppercase text-[#D4AF37] block mb-2 font-medium">
            Metodología Cinematográfica
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F1EEE8]">
            Proceso de Producción
          </h2>
        </div>
        <p className="text-xs text-[#A7A39D] font-technical">
          Haz clic en cada fase para explorar el flujo de trabajo y entregables
        </p>
      </motion.div>

      {/* 4 Interactive Process Steps (Clean horizontal track) */}
      <motion.div
        variants={gridStaggerContainer}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {creativeProcessSteps.map((step, idx) => {
          const isSelected = activeStepIndex === idx;
          return (
            <motion.button
              key={step.number}
              variants={fadeUpItem}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveStepIndex(isSelected ? null : idx)}
              className={`p-5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-[#181818] border-[#D4AF37] shadow-lg'
                  : 'bg-[#101010] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-technical text-xs text-[#D4AF37]">
                  {step.number}
                </span>
                <span className="text-[10px] text-[#A7A39D] font-technical">
                  {step.timeframe}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#F1EEE8] mb-1">
                {step.title}
              </h3>
              <span className="text-[11px] text-[#A7A39D]">
                {step.phase}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Hidden Details Drawer (Only rendered when a step is selected) */}
      {activeStepIndex !== null && (
        <motion.div
          variants={scaleUpItem}
          initial="hidden"
          animate="visible"
          className="p-6 sm:p-8 rounded-xl bg-[#141414] border border-white/10 text-xs text-[#A7A39D] mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div className="md:max-w-xl">
              <span className="font-technical text-[11px] text-[#D4AF37] block mb-2">
                FASE {creativeProcessSteps[activeStepIndex].number} · {creativeProcessSteps[activeStepIndex].timeframe.toUpperCase()}
              </span>
              <h4 className="text-xl font-bold text-[#F1EEE8] mb-3">
                {creativeProcessSteps[activeStepIndex].title}
              </h4>
              <p className="leading-relaxed text-sm text-[#A7A39D]">
                {creativeProcessSteps[activeStepIndex].description}
              </p>
            </div>

            <div className="bg-[#0C0C0C] p-5 rounded-lg border border-white/5 md:w-80 shrink-0">
              <div className="flex items-center gap-2 text-xs font-technical text-[#F1EEE8] mb-3">
                <Layers size={13} className="text-[#D4AF37]" />
                <span>Entregables de la Fase</span>
              </div>
              <ul className="space-y-2">
                {creativeProcessSteps[activeStepIndex].keyOutputs.map((out, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px]">
                    <span className="w-1 h-1 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
};

