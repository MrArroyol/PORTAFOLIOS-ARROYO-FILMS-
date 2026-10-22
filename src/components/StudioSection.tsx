import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { studioInfo } from '../data/portfolioData';
import { StudioInfo } from '../types/portfolio';
import { MapPin, Mail, ExternalLink, Edit3, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { getMotionVariants } from '../utils/motionVariants';

export const StudioSection: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [profile, setProfile] = useState<StudioInfo>(studioInfo);

  const shouldReduceMotion = useReducedMotion();
  const motionSystem = getMotionVariants(!!shouldReduceMotion);

  return (
    <motion.section
      id="estudio"
      variants={motionSystem.pageContainer}
      initial="hidden"
      animate="visible"
      className="py-12 sm:py-20 px-6 sm:px-8 max-w-7xl mx-auto"
      aria-label="Acerca del Estudio"
    >
      {/* Header with Masked Title Reveal */}
      <motion.div
        variants={motionSystem.fadeUp}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#F1EEE8]/10"
      >
        <div>
          <span className="text-xs tracking-[0.25em] uppercase text-[#D4AF37] block mb-2 font-medium">
            Visión & Filosofía
          </span>
          <div className="overflow-hidden">
            <motion.h2
              variants={motionSystem.headlineMaskLine}
              className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F1EEE8]"
            >
              El Estudio
            </motion.h2>
          </div>
        </div>

        <button
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="self-start sm:self-auto inline-flex items-center gap-2 text-xs font-technical px-3.5 py-1.5 rounded-lg border border-white/10 bg-[#121212] hover:bg-[#1A1A1A] text-[#F1EEE8] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
        >
          <span>{isDetailsOpen ? 'Ocultar Ficha Técnica' : 'Ver Ficha Técnica & Contacto'}</span>
          {isDetailsOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </motion.div>

      {/* Dominant Manifesto (Clean, unboxed, cinematic) */}
      <motion.div variants={motionSystem.fadeUp} className="max-w-4xl mb-10">
        <blockquote className="font-editorial italic text-2xl sm:text-4xl text-[#F1EEE8] leading-snug mb-6">
          «{profile.manifesto}»
        </blockquote>
        <p className="text-sm sm:text-base text-[#A7A39D] leading-relaxed">
          {profile.bio}
        </p>
      </motion.div>

      {/* Collapsible Details Drawer */}
      {isDetailsOpen && (
        <div className="bg-[#121212] border border-white/10 rounded-xl p-6 sm:p-8 text-xs text-[#A7A39D] mb-8">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <span className="font-technical text-[11px] text-[#D4AF37] uppercase tracking-wider">
              Datos Profesionales del Director / Estudio
            </span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1.5 text-[#F1EEE8] hover:text-[#D4AF37] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] rounded"
            >
              {isEditing ? <Check size={12} className="text-[#D4AF37]" /> : <Edit3 size={12} />}
              <span>{isEditing ? 'Guardar' : 'Editar Datos'}</span>
            </button>
          </div>

          {isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-[10px] uppercase text-[#A7A39D] mb-1 font-technical">Nombre / Firma</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded p-2 text-xs text-[#F1EEE8] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#A7A39D] mb-1 font-technical">Director Creativo</label>
                <input
                  type="text"
                  value={profile.leadCreative}
                  onChange={(e) => setProfile({ ...profile, leadCreative: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded p-2 text-xs text-[#F1EEE8] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#A7A39D] mb-1 font-technical">Ubicación</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded p-2 text-xs text-[#F1EEE8] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#A7A39D] mb-1 font-technical">Correo</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded p-2 text-xs text-[#F1EEE8] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
              <div>
                <span className="font-technical text-[10px] uppercase text-[#A7A39D] block mb-1">Estudio</span>
                <span className="text-sm font-bold text-[#F1EEE8] block">{profile.name}</span>
                <span className="text-[11px] text-[#D4AF37]">{profile.subtitle}</span>
              </div>
              <div>
                <span className="font-technical text-[10px] uppercase text-[#A7A39D] block mb-1">Lead Creative</span>
                <span className="text-sm font-medium text-[#F1EEE8] block">{profile.leadCreative}</span>
                <span className="text-[11px] text-[#A7A39D]">{profile.role}</span>
              </div>
              <div>
                <span className="font-technical text-[10px] uppercase text-[#A7A39D] block mb-1">Sede</span>
                <span className="text-sm text-[#F1EEE8] flex items-center gap-1">
                  <MapPin size={12} className="text-[#D4AF37]" />
                  {profile.location}
                </span>
              </div>
              <div>
                <span className="font-technical text-[10px] uppercase text-[#A7A39D] block mb-1">Email Directo</span>
                <a href={`mailto:${profile.email}`} className="text-sm text-[#F1EEE8] hover:text-[#D4AF37] flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] rounded">
                  <Mail size={12} className="text-[#D4AF37]" />
                  {profile.email}
                </a>
              </div>
            </div>
          )}

          {/* External Social Profiles */}
          <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-4">
            <span className="font-technical text-[10px] uppercase text-[#A7A39D]">Portafolios Externos:</span>
            {profile.socials.map((soc) => (
              <a
                key={soc.platform}
                href={soc.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[#F1EEE8] hover:text-[#D4AF37] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] rounded"
              >
                <span>{soc.platform}</span>
                <ExternalLink size={10} />
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
};
