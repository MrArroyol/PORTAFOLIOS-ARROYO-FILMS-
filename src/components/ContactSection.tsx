import React, { useState, useEffect, useId } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { studioInfo, studioServices } from '../data/portfolioData';
import { ProjectInquiryData } from '../types/portfolio';
import {
  generateMailtoLink,
  generateWhatsAppInquiryLink,
  formatProjectSummaryText,
  calculatePackageEstimate,
} from '../utils/portfolio';
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  Palette,
  Clock,
  Film,
  Feather,
  Globe,
  Zap,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { getMotionVariants } from '../utils/motionVariants';

interface ContactSectionProps {
  preSelectedService?: string | null;
}

interface AestheticDirection {
  id: string;
  number: string;
  title: string;
  concept: string;
  palette: { name: string; hex: string }[];
  visualMotif: string;
  atmosphere: string;
  sampleReference: string;
  accentColor: string;
}

const aestheticDirections: AestheticDirection[] = [
  {
    id: 'cinema-gold',
    number: '01',
    title: 'Cinema Gold & Medical Luxe',
    concept: 'Alta precisión clínica, partículas doradas fluidas e iluminación envolvente de estudio.',
    sampleReference: 'Dr. Luciano — Cirugía Estética (Caso Real)',
    accentColor: '#D4AF37',
    visualMotif: 'gold-particles',
    atmosphere: '35mm T1.5 · ISO 800 · DaVinci 709',
    palette: [
      { name: 'Oro Champán', hex: '#D4AF37' },
      { name: 'Negro Ónix', hex: '#0B0C0E' },
      { name: 'Grafito Clínico', hex: '#1F2228' },
      { name: 'Luz Cálida', hex: '#F5EEDB' },
    ],
  },
  {
    id: 'noir-chiaroscuro',
    number: '02',
    title: 'Noir Chiaroscuro & Luxury',
    concept: 'Sombras profundas, contraluces dramáticos, siluetas escultóricas y misterio sensorial.',
    sampleReference: 'Aura Noir — Fragancia de Alta Gama',
    accentColor: '#C89F77',
    visualMotif: 'sculptural-glass',
    atmosphere: '50mm Anamórfico · Claroscuro Escultórico',
    palette: [
      { name: 'Ámbar Tostado', hex: '#C89F77' },
      { name: 'Sombra Profunda', hex: '#080808' },
      { name: 'Humo Terroso', hex: '#2A2622' },
      { name: 'Papiro Seda', hex: '#E6D8C8' },
    ],
  },
  {
    id: 'precision-chrono',
    number: '03',
    title: 'Precision Chrono & Horology',
    concept: 'Macro cinematográfico, engranajes pulidos, precisión milimétrica y legado artesanal.',
    sampleReference: 'Chronos 1888 — Manufactura Suiza',
    accentColor: '#FF4D6D',
    visualMotif: 'mechanical-gears',
    atmosphere: 'Macro 100mm T2.8 · Rotación 360°',
    palette: [
      { name: 'Rubí Mecánico', hex: '#FF4D6D' },
      { name: 'Titanio Cepillado', hex: '#141414' },
      { name: 'Oro Rosa', hex: '#D4AF37' },
      { name: 'Acero Templado', hex: '#4A4D55' },
    ],
  },
  {
    id: 'kinetic-vanguard',
    number: '04',
    title: 'Kinetic Motion & Digital Vanguard',
    concept: 'Tipografía cinética de impacto, contrastes cromáticos y dinamismo tecnológico.',
    sampleReference: 'Vortic Studio — Dirección de Arte & Web',
    accentColor: '#38BDF8',
    visualMotif: 'vector-waves',
    atmosphere: 'Gráficos Vectoriales 3D · Shutter 90°',
    palette: [
      { name: 'Azul Eléctrico', hex: '#38BDF8' },
      { name: 'Negro Mate', hex: '#18181B' },
      { name: 'Índigo Ciber', hex: '#818CF8' },
      { name: 'Blanco Glaciar', hex: '#F8FAFC' },
    ],
  },
];

interface QuickPreset {
  id: string;
  badge: string;
  title: string;
  clientName: string;
  companyName: string;
  projectType: string;
  selectedServices: string[];
  aestheticId: string;
  budgetTier: string;
  projectTimeline: string;
  projectBrief: string;
}

const quickPresets: QuickPreset[] = [
  {
    id: 'preset-luciano',
    badge: 'Caso Real',
    title: 'Film Médico & Estética (Dr. Luciano)',
    clientName: 'Dr. Luciano R.',
    companyName: 'Clínica de Cirugía Estética Dr. Luciano',
    projectType: 'Film & Spot Cinematográfico',
    selectedServices: ['Producción Audiovisual', 'Postproducción & Color'],
    aestheticId: 'cinema-gold',
    budgetTier: '$10k – $25k',
    projectTimeline: '1 a 2 meses',
    projectBrief: 'Producción de documental cinematográfico en 35mm para clínica estética de alta gama, mostrando procedimientos y filosofía quirúrgica con iluminación de estudio y tono elegante.',
  },
  {
    id: 'preset-aura',
    badge: 'Lanzamiento',
    title: 'Aura Noir (Fragancia & Lujo)',
    clientName: 'Elena V.',
    companyName: 'Maison Aura Noir',
    projectType: 'Campaña Integral 360°',
    selectedServices: ['Producción Audiovisual', 'Dirección Creativa', 'Motion Design'],
    aestheticId: 'noir-chiaroscuro',
    budgetTier: '$25k – $50k',
    projectTimeline: 'Inmediato (1 mes)',
    projectBrief: 'Lanzamiento sensorial de fragancia de lujo con teaser anamórfico, dirección de arte en claroscuro escultórico y suite de activos para redes y eventos.',
  },
  {
    id: 'preset-vortic',
    badge: 'Digital 3D',
    title: 'Vortic Studio (Identidad & Web)',
    clientName: 'Mateo S.',
    companyName: 'Vortic Interactive',
    projectType: 'Experiencia Digital Web',
    selectedServices: ['Dirección Creativa', 'Experiencia Web 3D', 'Motion Design'],
    aestheticId: 'kinetic-vanguard',
    budgetTier: '$10k – $25k',
    projectTimeline: '1 a 2 meses',
    projectBrief: 'Rediseño integral de identidad de marca y plataforma web inmersiva con renderizado interactivo, transiciones cinematográficas y tipografía de vanguardia.',
  },
  {
    id: 'preset-chrono',
    badge: 'Alta Relojería',
    title: 'Chronos 1888 (Manufactura Suiza)',
    clientName: 'Christian B.',
    companyName: 'Chronos Horlogerie',
    projectType: 'Film & Spot Cinematográfico',
    selectedServices: ['Producción Audiovisual', 'Motion Design', 'Postproducción & Color'],
    aestheticId: 'precision-chrono',
    budgetTier: '>$50k',
    projectTimeline: 'Flexible',
    projectBrief: 'Campaña macro en 100mm capturando el ensamble artesanal y engranajes mecánicos de reloj de edición limitada con movimiento fluido 360 grados.',
  },
];

interface ProjectArchetype {
  id: string;
  icon: typeof Film;
  title: string;
  shortDesc: string;
  defaultServices: string[];
}

const projectArchetypes: ProjectArchetype[] = [
  {
    id: 'film',
    icon: Film,
    title: 'Film & Spot Cinematográfico',
    shortDesc: 'Rodaje 35mm, dirección cinematográfica, iluminación de estudio y DaVinci color grading.',
    defaultServices: ['Producción Audiovisual', 'Postproducción & Color'],
  },
  {
    id: 'identity',
    icon: Feather,
    title: 'Identidad & Dirección Creativa',
    shortDesc: 'Branding conceptual, narrativa de marca, dirección de arte, manual visual y packaging.',
    defaultServices: ['Dirección Creativa', 'Fotografía Editorial'],
  },
  {
    id: 'digital',
    icon: Globe,
    title: 'Experiencia Digital & Web 3D',
    shortDesc: 'Sitios web de autor, diseño inmersivo, microinteracciones y desarrollo de vanguardia.',
    defaultServices: ['Experiencia Web 3D', 'Motion Design'],
  },
  {
    id: 'campaign',
    icon: Zap,
    title: 'Campaña Integral 360°',
    shortDesc: 'Producción global combinando film, dirección de arte, contenido digital y activos clave.',
    defaultServices: ['Producción Audiovisual', 'Dirección Creativa', 'Motion Design'],
  },
];

export const ContactSection: React.FC<ContactSectionProps> = ({ preSelectedService }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activePresetNotification, setActivePresetNotification] = useState<string | null>(null);

  // Core selections
  const [selectedProjectType, setSelectedProjectType] = useState<string>('Film & Spot Cinematográfico');
  const [selectedAestheticId, setSelectedAestheticId] = useState<string>('cinema-gold');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedColorHex, setCopiedColorHex] = useState<string | null>(null);

  const selectedAesthetic =
    aestheticDirections.find((a) => a.id === selectedAestheticId) || aestheticDirections[0];

  const [formData, setFormData] = useState<ProjectInquiryData>({
    clientName: '',
    clientEmail: '',
    companyName: '',
    selectedServices: preSelectedService ? [preSelectedService] : ['Producción Audiovisual', 'Postproducción & Color'],
    budgetTier: '$10k – $25k',
    projectTimeline: '1 a 2 meses',
    projectBrief: 'Producción audiovisual con dirección estética cuidada y estándares de alta gama.',
    aestheticDirection: selectedAesthetic.title,
    selectedPaletteColors: selectedAesthetic.palette.map((p) => p.hex),
  });

  const shouldReduceMotion = useReducedMotion();
  const motionSystem = getMotionVariants(!!shouldReduceMotion);
  const generatedTicketId = useId().replace(/[^a-zA-Z0-9]/g, '').slice(0, 5).toUpperCase() || '7F92';

  // Handle incoming preSelectedService
  useEffect(() => {
    if (preSelectedService) {
      setFormData((prev) => ({
        ...prev,
        selectedServices: prev.selectedServices.includes(preSelectedService)
          ? prev.selectedServices
          : [...prev.selectedServices, preSelectedService],
      }));
    }
  }, [preSelectedService]);

  // Autocompletion Preset Trigger (1-tap complete fill + jump to redirection view)
  const handleApplyPreset = (preset: QuickPreset) => {
    const targetAesthetic =
      aestheticDirections.find((a) => a.id === preset.aestheticId) || aestheticDirections[0];

    setSelectedProjectType(preset.projectType);
    setSelectedAestheticId(preset.aestheticId);
    setFormData({
      clientName: preset.clientName,
      companyName: preset.companyName,
      clientEmail: '',
      selectedServices: preset.selectedServices,
      budgetTier: preset.budgetTier,
      projectTimeline: preset.projectTimeline,
      projectBrief: preset.projectBrief,
      aestheticDirection: targetAesthetic.title,
      selectedPaletteColors: targetAesthetic.palette.map((p) => p.hex),
    });

    setActivePresetNotification(`Preset cargado: ${preset.title}. Ficha capturada lista para redirección.`);
    setCurrentStep(3); // Instant jump to captured closure & redirection

    setTimeout(() => {
      setActivePresetNotification(null);
    }, 5000);
  };

  // Archetype change in Step 1
  const handleSelectArchetype = (archetype: ProjectArchetype) => {
    setSelectedProjectType(archetype.title);
    setFormData((prev) => {
      // Merge default services with existing or set archetypes
      const uniqueServices = Array.from(new Set([...archetype.defaultServices]));
      return {
        ...prev,
        selectedServices: uniqueServices,
        projectBrief: prev.projectBrief || `Proyecto de ${archetype.title} enfocado en calidad cinematográfica y alto impacto visual.`,
      };
    });
  };

  // Toggle individual service
  const toggleService = (title: string) => {
    setFormData((prev) => {
      const exists = prev.selectedServices.includes(title);
      const updated = exists
        ? prev.selectedServices.filter((s) => s !== title)
        : [...prev.selectedServices, title];
      return {
        ...prev,
        selectedServices: updated.length > 0 ? updated : [title],
      };
    });
  };

  // Aesthetic change in Step 2
  const handleSelectAesthetic = (aesthetic: AestheticDirection) => {
    setSelectedAestheticId(aesthetic.id);
    setFormData((prev) => ({
      ...prev,
      aestheticDirection: aesthetic.title,
      selectedPaletteColors: aesthetic.palette.map((p) => p.hex),
    }));
  };

  const handleCopyColor = (e: React.MouseEvent, hex: string) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(hex).then(() => {
      setCopiedColorHex(hex);
      setTimeout(() => setCopiedColorHex(null), 1800);
    }).catch(() => {});
  };

  const handleCopySummary = () => {
    const text = formatProjectSummaryText(formData);
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2800);
    }).catch(() => {});
  };

  const budgetOptions = [
    '<$10k (Piloto)',
    '$10k – $25k',
    '$25k – $50k',
    '>$50k (Global)',
  ];

  const timelineOptions = [
    'Inmediato (1 mes)',
    '1 a 2 meses',
    '3+ meses',
    'Flexible',
  ];

  const estimate = calculatePackageEstimate(formData.selectedServices);
  const whatsappUrl = generateWhatsAppInquiryLink(formData, '34910234567');
  const mailtoUrl = generateMailtoLink(formData, studioInfo.email);

  return (
    <motion.section
      id="contacto"
      variants={motionSystem.pageContainer}
      initial="hidden"
      animate="visible"
      className="py-12 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto"
      aria-label="Contacto e Inicio de Proyecto Rápido"
    >
      {/* Cinematic Header with Masked Title Reveal */}
      <motion.div variants={motionSystem.fadeUp} className="max-w-4xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#D4AF37] mb-3 font-medium">
          <span>Cierre Intuitivo</span>
          <span aria-hidden="true">·</span>
          <span>Redirección Inmediata</span>
        </div>

        <motion.h2
          variants={motionSystem.headlineMaskContainer}
          initial="hidden"
          animate="visible"
          className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F1EEE8] text-balance mb-4"
        >
          <span className="block overflow-hidden pb-1">
            <motion.span variants={motionSystem.headlineMaskLine} className="block">
              Elige tu proyecto y genera
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-1">
            <motion.span variants={motionSystem.headlineMaskLine} className="block">
              tu <span className="font-editorial italic font-normal text-[#D4AF37]">pase de producción</span> al instante.
            </motion.span>
          </span>
        </motion.h2>

        <p className="text-sm sm:text-base text-[#A7A39D] leading-relaxed max-w-2xl mx-auto">
          Responde con elecciones fáciles o usa el autocompletado en 1 toque.
          Al terminar, te redirigimos al instante por WhatsApp o correo con toda la información capturada.
        </p>
      </motion.div>

      {/* AUTOCOMPLETION PRESETS BAR: 1-Tap Fast Fill & Jump */}
      <motion.div
        variants={motionSystem.fadeUp}
        className="mb-10 p-5 rounded-2xl bg-gradient-to-r from-[#141414] via-[#1A1A1A] to-[#141414] border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#D4AF37] animate-pulse" />
            <h3 className="text-xs uppercase tracking-[0.2em] font-technical font-bold text-[#F1EEE8]">
              Autocompletado Exprés (1 Toque)
            </h3>
          </div>
          <p className="text-xs text-[#A7A39D] font-technical">
            Haz clic en un caso de referencia para rellenar todo y ver tu ficha lista para enviar:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="p-3.5 rounded-xl bg-[#0C0C0C] border border-white/10 hover:border-[#D4AF37] hover:bg-[#161616] transition-all text-left group flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-technical uppercase tracking-wider text-[#D4AF37] font-semibold">
                    {preset.badge}
                  </span>
                  <span className="text-[10px] font-technical text-white/40 group-hover:text-white transition-colors">
                    1-Tap Fill →
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#F1EEE8] group-hover:text-[#D4AF37] transition-colors leading-snug">
                  {preset.title}
                </h4>
              </div>
              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#A7A39D] font-technical">
                <span>{preset.budgetTier}</span>
                <span>{preset.projectTimeline}</span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Preset Toast Notification */}
      <AnimatePresence>
        {activePresetNotification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-8 p-3.5 rounded-xl bg-[#1B2519] border border-[#4ADE80]/40 text-[#4ADE80] text-xs font-technical flex items-center justify-between gap-3 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{activePresetNotification}</span>
            </div>
            <button
              type="button"
              onClick={() => setActivePresetNotification(null)}
              className="text-white/60 hover:text-white underline text-[11px]"
            >
              Cerrar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INTERACTIVE STEPPER NAVIGATION (3 Steps) */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          {[
            { step: 1, label: '01 · Tipo de Proyecto', sub: 'Enfoque & Disciplinas' },
            { step: 2, label: '02 · Estilo & Plazos', sub: 'Estética & Paleta' },
            { step: 3, label: '03 · Cierre & Redirección', sub: 'Pase Capturado' },
          ].map((item) => {
            const isActive = currentStep === item.step;
            const isCompleted = currentStep > item.step;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => setCurrentStep(item.step)}
                className={`py-3 px-2 sm:px-4 rounded-xl border text-left sm:text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                  isActive
                    ? 'bg-[#1C1C1C] border-[#D4AF37] text-[#F1EEE8] ring-1 ring-[#D4AF37]/40'
                    : isCompleted
                    ? 'bg-[#111111] border-white/20 text-[#D4AF37] hover:border-white/40'
                    : 'bg-[#0B0B0B] border-white/5 text-[#A7A39D] hover:border-white/20'
                }`}
              >
                <div className="flex items-center sm:justify-center gap-1.5 mb-0.5">
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] font-technical font-bold flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-[#D4AF37] text-black'
                        : isCompleted
                        ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                        : 'bg-white/10 text-[#A7A39D]'
                    }`}
                  >
                    {isCompleted ? '✓' : item.step}
                  </span>
                  <span className="text-xs font-bold truncate">{item.label}</span>
                </div>
                <span className="text-[10px] font-technical text-[#A7A39D] hidden sm:block">
                  {item.sub}
                </span>
              </button>
            );
          })}
        </div>

        {/* Minimal Progress Line */}
        <div className="h-0.5 bg-white/10 mt-3 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#D4AF37]"
            initial={{ width: '33%' }}
            animate={{ width: `${(currentStep / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* STEP CONTAINER WITH ANIMATED TRANSITIONS */}
      <AnimatePresence mode="wait">
        {/* ================= STEP 1: PROYECTO & DISCIPLINAS ================= */}
        {currentStep === 1 && (
          <motion.div
            key="step-1"
            variants={motionSystem.fadeUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#F1EEE8]">
                    1. Elige el Enfoque Principal de tu Proyecto
                  </h3>
                  <p className="text-xs text-[#A7A39D] font-technical mt-0.5">
                    Selecciona una tarjeta base; adaptaremos los entregables exactos a tus necesidades.
                  </p>
                </div>
                <span className="text-xs font-technical text-[#D4AF37]">Paso 1 de 3</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {projectArchetypes.map((archetype) => {
                  const Icon = archetype.icon;
                  const isSelected = selectedProjectType === archetype.title;
                  return (
                    <button
                      type="button"
                      key={archetype.id}
                      onClick={() => handleSelectArchetype(archetype)}
                      className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                        isSelected
                          ? 'bg-[#181818] border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-[0_0_25px_rgba(212,175,55,0.12)]'
                          : 'bg-[#101010] border-white/10 hover:border-white/25 hover:bg-[#141414]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-[#D4AF37] text-black'
                                : 'bg-white/5 text-[#D4AF37] group-hover:bg-white/10'
                            }`}
                          >
                            <Icon size={20} />
                          </div>
                          <span
                            className={`text-[10px] font-technical px-2 py-0.5 rounded ${
                              isSelected ? 'bg-[#D4AF37] text-black font-bold' : 'text-[#A7A39D]'
                            }`}
                          >
                            {isSelected ? '✓ ACTIVO' : 'ELEGIR'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#F1EEE8] group-hover:text-[#D4AF37] transition-colors mb-2">
                          {archetype.title}
                        </h4>
                        <p className="text-xs text-[#A7A39D] leading-relaxed">
                          {archetype.shortDesc}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-1">
                        {archetype.defaultServices.map((srv) => (
                          <span
                            key={srv}
                            className="text-[9px] font-technical text-white/60 bg-white/5 px-2 py-0.5 rounded"
                          >
                            {srv}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Disciplinas complementarias (Quick checklist) */}
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs uppercase tracking-[0.2em] font-technical text-[#F1EEE8] font-bold block">
                  Añade o personaliza las disciplinas que requiere tu entrega:
                </label>
                <span className="text-xs font-technical text-[#D4AF37]">
                  {formData.selectedServices.length} seleccionadas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {studioServices.map((srv) => {
                  const isChecked = formData.selectedServices.includes(srv.title);
                  return (
                    <button
                      type="button"
                      key={srv.id}
                      onClick={() => toggleService(srv.title)}
                      className={`p-3 text-left rounded-xl text-xs font-medium border transition-all flex items-center justify-between focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] ${
                        isChecked
                          ? 'bg-[#1C1C1C] border-[#D4AF37] text-[#F1EEE8]'
                          : 'bg-[#0A0A0A] border-white/10 text-[#A7A39D] hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <span className="font-bold block truncate">{srv.title}</span>
                        <span className="text-[10px] font-technical text-[#A7A39D]">
                          {srv.typicalTimeline}
                        </span>
                      </div>
                      <span
                        className={`w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-[#D4AF37] text-black' : 'border border-white/20 text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="text-xs text-[#A7A39D] font-technical">
                Seleccionado: <strong className="text-white">{selectedProjectType}</strong> ({formData.selectedServices.length} disciplinas)
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="py-3 px-6 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#F1EEE8] transition-all flex items-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                <span>Continuar a Estética & Tono</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ================= STEP 2: ESTÉTICA & PLAZOS ================= */}
        {currentStep === 2 && (
          <motion.div
            key="step-2"
            variants={motionSystem.fadeUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#F1EEE8]">
                    2. Selecciona la Dirección Estética y Paleta Visual
                  </h3>
                  <p className="text-xs text-[#A7A39D] font-technical mt-0.5">
                    Define la atmósfera que impregnará tus piezas y paleta de color oficial.
                  </p>
                </div>
                <span className="text-xs font-technical text-[#D4AF37]">Paso 2 de 3</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {aestheticDirections.map((aesthetic) => {
                  const isSelected = selectedAestheticId === aesthetic.id;
                  return (
                    <button
                      type="button"
                      key={aesthetic.id}
                      onClick={() => handleSelectAesthetic(aesthetic)}
                      className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all group relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                        isSelected
                          ? 'bg-[#181818] border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-[0_0_25px_rgba(212,175,55,0.15)]'
                          : 'bg-[#101010] border-white/10 hover:border-white/25 hover:bg-[#141414]'
                      }`}
                    >
                      <div
                        className="absolute top-0 left-0 right-0 h-1"
                        style={{
                          backgroundColor: aesthetic.accentColor,
                          opacity: isSelected ? 1 : 0.3,
                        }}
                      />

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-technical text-xs font-bold text-[#D4AF37]">
                            {aesthetic.number}
                          </span>
                          <span
                            className={`text-[10px] font-technical px-2 py-0.5 rounded ${
                              isSelected ? 'bg-[#D4AF37] text-black font-bold' : 'text-[#A7A39D]'
                            }`}
                          >
                            {isSelected ? '✓ SELECCIONADA' : 'ELEGIR'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#F1EEE8] group-hover:text-[#D4AF37] transition-colors mb-1.5">
                          {aesthetic.title}
                        </h4>
                        <p className="text-xs text-[#A7A39D] leading-relaxed line-clamp-2 mb-3">
                          {aesthetic.concept}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/10">
                        <div className="text-[10px] font-technical text-[#A7A39D] mb-1.5 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Palette size={11} className="text-[#D4AF37]" />
                            <span>Paleta Cromática</span>
                          </span>
                          <span className="text-[9px] text-white/40">Clic para copiar HEX</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 mb-2">
                          {aesthetic.palette.map((c) => (
                            <span
                              key={c.hex}
                              onClick={(e) => handleCopyColor(e, c.hex)}
                              title={`${c.name} (${c.hex})`}
                              className="h-6 rounded border border-white/15 flex items-center justify-center text-[9px] font-technical font-bold cursor-pointer hover:scale-105 transition-transform"
                              style={{ backgroundColor: c.hex }}
                            >
                              {copiedColorHex === c.hex ? (
                                <Check size={10} className="text-white drop-shadow" />
                              ) : null}
                            </span>
                          ))}
                        </div>
                        <span className="text-[9px] font-technical text-[#A7A39D] block truncate">
                          Ref: {aesthetic.sampleReference}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Plazos & Presupuesto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#121212] border border-white/10 rounded-2xl p-6">
              <div>
                <label className="text-xs uppercase tracking-[0.2em] font-technical text-[#F1EEE8] font-bold block mb-3">
                  Plazo de Entrega Deseado
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {timelineOptions.map((tl) => {
                    const isSelected = formData.projectTimeline === tl;
                    return (
                      <button
                        type="button"
                        key={tl}
                        onClick={() => setFormData((prev) => ({ ...prev, projectTimeline: tl }))}
                        className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] ${
                          isSelected
                            ? 'bg-[#F1EEE8] text-[#090909] font-bold border-[#F1EEE8]'
                            : 'bg-[#0A0A0A] text-[#A7A39D] border-white/10 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {tl}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.2em] font-technical text-[#F1EEE8] font-bold block mb-3">
                  Rango de Inversión Orientativo
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {budgetOptions.map((bg) => {
                    const isSelected = formData.budgetTier === bg;
                    return (
                      <button
                        type="button"
                        key={bg}
                        onClick={() => setFormData((prev) => ({ ...prev, budgetTier: bg }))}
                        className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] ${
                          isSelected
                            ? 'bg-[#F1EEE8] text-[#090909] font-bold border-[#F1EEE8]'
                            : 'bg-[#0A0A0A] text-[#A7A39D] border-white/10 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {bg}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 2 Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="py-3 px-5 rounded-xl border border-white/15 text-[#A7A39D] hover:text-white hover:border-white/30 text-xs font-technical uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                <span>Paso 1: Proyecto</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="py-3 px-6 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#F1EEE8] transition-all flex items-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                <span>Generar Pase & Ver Redirección</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ================= STEP 3: CIERRE INTUITIVO & REDIRECCIÓN RÁPIDA ================= */}
        {currentStep === 3 && (
          <motion.div
            key="step-3"
            variants={motionSystem.fadeUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            {/* Master Captured Production Ticket */}
            <div className="bg-[#121212] border-2 border-[#D4AF37]/60 rounded-3xl p-6 sm:p-9 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[10px] font-technical font-bold uppercase tracking-widest px-4 py-1 rounded-bl-xl shadow">
                Información Capturada y Lista
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-technical text-[#D4AF37] uppercase tracking-widest mb-1">
                    <CheckCircle2 size={15} />
                    <span>Pase de Producción Oficial</span>
                    <span>·</span>
                    <span>LF-2026-{generatedTicketId}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#F1EEE8]">
                    Tu Ficha de Brief Creativo está Completa
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="py-2 px-3.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-technical text-[#F1EEE8] transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
                    title="Copiar texto estructurado"
                  >
                    {copiedSummary ? (
                      <>
                        <Check size={14} className="text-[#4ADE80]" />
                        <span className="text-[#4ADE80]">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copiar Ficha</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="py-2 px-3.5 rounded-lg border border-white/10 hover:border-white/20 text-xs font-technical text-[#A7A39D] hover:text-white transition-all flex items-center gap-1"
                  >
                    <RefreshCw size={13} />
                    <span>Modificar</span>
                  </button>
                </div>
              </div>

              {/* Structured Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {/* 1. Proyecto & Servicios */}
                <div className="p-4 rounded-xl bg-[#090909] border border-white/10">
                  <div className="flex items-center gap-2 text-xs font-technical text-[#D4AF37] mb-2 uppercase tracking-wider">
                    <Layers size={13} />
                    <span>Proyecto & Servicios</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{selectedProjectType}</h4>
                  <div className="flex flex-wrap gap-1">
                    {formData.selectedServices.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-technical bg-white/10 text-[#E5E5E5] px-2 py-0.5 rounded"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 2. Estética & Paleta */}
                <div className="p-4 rounded-xl bg-[#090909] border border-white/10">
                  <div className="flex items-center gap-2 text-xs font-technical text-[#D4AF37] mb-2 uppercase tracking-wider">
                    <Palette size={13} />
                    <span>Dirección & Paleta</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{selectedAesthetic.title}</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {selectedAesthetic.palette.map((color) => (
                        <span
                          key={color.hex}
                          className="w-5 h-5 rounded border border-white/20"
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-technical text-[#A7A39D] truncate">
                      {selectedAesthetic.palette.map((p) => p.name).slice(0, 2).join(', ')}...
                    </span>
                  </div>
                </div>

                {/* 3. Estimación & Plazo */}
                <div className="p-4 rounded-xl bg-[#090909] border border-white/10">
                  <div className="flex items-center gap-2 text-xs font-technical text-[#D4AF37] mb-2 uppercase tracking-wider">
                    <Clock size={13} />
                    <span>Plazos & Presupuesto</span>
                  </div>
                  <div className="text-sm font-bold text-white mb-1">{formData.projectTimeline}</div>
                  <div className="text-xs text-[#A7A39D] font-technical">
                    Rango: <span className="text-[#D4AF37] font-bold">{formData.budgetTier}</span>
                  </div>
                  <div className="text-[10px] text-white/50 font-technical mt-1">
                    Est. paquetes: {estimate.label}
                  </div>
                </div>
              </div>

              {/* Optional Quick Identification Inputs */}
              <div className="mb-8 p-5 rounded-2xl bg-[#0A0A0A] border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs uppercase tracking-[0.2em] font-technical text-[#F1EEE8] font-bold block">
                    ¿Quieres firmar el brief con tu nombre o marca? (Opcional)
                  </label>
                  <span className="text-[10px] text-[#A7A39D] font-technical">
                    Si lo dejas vacío, te redirigimos igualmente al instante.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, clientName: e.target.value }))}
                    placeholder="Tu nombre (Ej: Carlos Ramos)"
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Empresa o Marca (Ej: Maison Nova)"
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <input
                    type="text"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData((prev) => ({ ...prev, clientEmail: e.target.value }))}
                    placeholder="Correo o Teléfono (Opcional)"
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* PROMINENT INSTANT REDIRECTION BUTTONS (WhatsApp, Mailto, Copy) */}
              <div className="space-y-4">
                <div className="text-center sm:text-left mb-2">
                  <span className="text-xs font-technical uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                    Elige cómo deseas iniciar la conversación con esta ficha:
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Primary WhatsApp Redirection Button */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-5 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-black font-bold text-sm transition-all flex items-center justify-between shadow-xl hover:shadow-[0_0_30px_rgba(37,211,102,0.35)] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center">
                        <MessageSquare size={22} className="text-black" />
                      </div>
                      <div>
                        <span className="block text-xs uppercase tracking-wider text-black/70 font-technical">
                          Redirección Inmediata 1-Clic
                        </span>
                        <span className="block text-base font-bold text-black">
                          Abrir WhatsApp con esta Lista
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={20} className="text-black group-hover:translate-x-1 transition-transform" />
                  </a>

                  {/* Secondary Mailto Redirection Button */}
                  <a
                    href={mailtoUrl}
                    className="p-5 rounded-2xl bg-[#F1EEE8] hover:bg-white text-black font-bold text-sm transition-all flex items-center justify-between shadow-xl hover:shadow-[0_0_30px_rgba(241,238,232,0.2)] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F1EEE8]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center">
                        <Mail size={22} className="text-black" />
                      </div>
                      <div>
                        <span className="block text-xs uppercase tracking-wider text-black/70 font-technical">
                          Redirección a Correo
                        </span>
                        <span className="block text-base font-bold text-black">
                          Enviar Ficha por Email Oficial
                        </span>
                      </div>
                    </div>
                    <ExternalLink size={18} className="text-black group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* Direct Studio Guarantee & Contact Info */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#A7A39D] font-technical gap-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#D4AF37]" />
                    <span>Respuesta formal garantizada en menos de 24h laborables</span>
                  </div>
                  <div>
                    <span>Canal directo: </span>
                    <strong className="text-white">{studioInfo.phone}</strong>
                    <span> · {studioInfo.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Back to Edit */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-xs font-technical text-[#A7A39D] hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft size={14} />
                <span>¿Deseas modificar alguna de las elecciones anteriores? Haz clic aquí</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
