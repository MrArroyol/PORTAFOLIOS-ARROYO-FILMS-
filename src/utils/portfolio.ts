import { Project, ProjectCategory, ProjectInquiryData, ValidationResult } from '../types/portfolio';

export type ViewType = 'home' | 'proyectos' | 'showreel' | 'servicios' | 'estudio' | 'contacto';

/**
 * Filter projects by category, returning all projects when category is 'All' or 'Todos'.
 * Supports flexible category mappings between Spanish display and technical keys.
 */
export function filterProjectsByCategory(
  projects: Project[],
  category: ProjectCategory
): Project[] {
  if (!category || category === 'All' || category === 'Todos') {
    return projects;
  }

  return projects.filter((project) => {
    if (project.category === category) return true;

    // Normalizations for bilingual / display categories
    if (category === 'Branding' && (project.category === 'Brand Identity' || project.category === 'Branding')) return true;
    if (category === 'Videos' && (project.category === 'Brand Films' || project.category === 'Videos')) return true;
    if (category === 'Motion' && (project.category === 'Motion Design' || project.category === 'Motion')) return true;
    if (category === 'Campañas' && (project.category === 'Campaigns' || project.category === 'Campañas')) return true;
    if (category === 'Digital' && (project.category === 'Digital Experiences' || project.category === 'Digital')) return true;

    return false;
  });
}

export type SortOption = 'destacados' | 'recientes' | 'nombre' | 'año';

/**
 * Sorts project collection by selected sorting criteria.
 */
export function sortProjects(projects: Project[], sort: SortOption): Project[] {
  const cloned = [...projects];
  switch (sort) {
    case 'destacados':
      return cloned.sort((a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99));
    case 'recientes':
      return cloned.sort((a, b) => (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0));
    case 'nombre':
      return cloned.sort((a, b) => a.title.localeCompare(b.title));
    case 'año':
      return cloned.sort((a, b) => (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0));
    default:
      return cloned;
  }
}

/**
 * Find adjacent project for continuous case study navigation.
 */
export function getAdjacentProject(
  projects: Project[],
  currentId: string,
  direction: 'next' | 'prev'
): Project {
  if (!projects || projects.length === 0) {
    throw new Error('Projects list cannot be empty');
  }
  const currentIndex = projects.findIndex((p) => p.id === currentId);
  if (currentIndex === -1) {
    return projects[0];
  }
  if (direction === 'next') {
    const nextIndex = (currentIndex + 1) % projects.length;
    return projects[nextIndex];
  } else {
    const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
    return projects[prevIndex];
  }
}

/**
 * Formats seconds into cinematic SMPTE-style timecode MM:SS.
 */
export function formatTimecode(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return '00:00';
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const paddedMin = String(minutes).padStart(2, '0');
  const paddedSec = String(seconds).padStart(2, '0');
  return `${paddedMin}:${paddedSec}`;
}

/**
 * Parses cinematic timecode MM:SS into total seconds.
 */
export function parseTimecodeToSeconds(timecode?: string): number {
  if (!timecode) return 0;
  const parts = timecode.split(':');
  if (parts.length === 2) {
    const mins = parseInt(parts[0], 10) || 0;
    const secs = parseInt(parts[1], 10) || 0;
    return mins * 60 + secs;
  }
  return 0;
}

/**
 * Resolves application view state from URL hash.
 */
export function parseViewFromHash(hash: string): ViewType {
  const clean = hash.replace(/^#\/?/, '').toLowerCase().trim();
  const validViews: ViewType[] = ['home', 'proyectos', 'showreel', 'servicios', 'estudio', 'contacto'];
  if (validViews.includes(clean as ViewType)) {
    return clean as ViewType;
  }
  return 'home';
}

/**
 * Estimates investment base for custom service package.
 */
export function calculatePackageEstimate(selectedServices: string[]): {
  min: number;
  max: number;
  label: string;
} {
  const basePriceMap: Record<string, [number, number]> = {
    'Desarrollo de Marca': [8000, 15000],
    'Producción Audiovisual': [12000, 28000],
    'Motion Design': [5000, 12000],
    'Experiencias Digitales': [9000, 20000],
  };

  let minTotal = 0;
  let maxTotal = 0;

  selectedServices.forEach((service) => {
    const range = basePriceMap[service] || [4000, 9000];
    minTotal += range[0];
    maxTotal += range[1];
  });

  if (selectedServices.length === 0) {
    return { min: 0, max: 0, label: 'Selecciona servicios para estimar' };
  }

  // Multi-discipline synergy discount
  if (selectedServices.length >= 3) {
    minTotal = Math.round(minTotal * 0.85);
    maxTotal = Math.round(maxTotal * 0.85);
  }

  return {
    min: minTotal,
    max: maxTotal,
    label: `$${(minTotal / 1000).toFixed(0)}k – $${(maxTotal / 1000).toFixed(0)}k USD`,
  };
}

/**
 * Validates project inquiry form inputs without silent bypass.
 */
export function validateProjectInquiry(
  data: Partial<ProjectInquiryData>
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.clientName || data.clientName.trim().length < 2) {
    errors.clientName = 'Por favor ingresa tu nombre completo.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.clientEmail || !emailRegex.test(data.clientEmail.trim())) {
    errors.clientEmail = 'Por favor ingresa un correo electrónico válido.';
  }

  if (!data.selectedServices || data.selectedServices.length === 0) {
    errors.selectedServices = 'Selecciona al menos un área de servicio requerida.';
  }

  if (!data.projectBrief || data.projectBrief.trim().length < 15) {
    errors.projectBrief = 'Por favor describe brevemente el proyecto (mínimo 15 caracteres).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Generates mailto link formatted with inquiry details including aesthetic direction & palette.
 */
export function generateMailtoLink(
  data: Partial<ProjectInquiryData>,
  recipientEmail: string
): string {
  const subject = encodeURIComponent(
    `Nuevo Proyecto: ${data.companyName || data.clientName || 'Consulta Creativa'} — Lumen & Form`
  );
  const aestheticText = data.aestheticDirection ? `Dirección Estética: ${data.aestheticDirection}\n` : '';
  const paletteText = data.selectedPaletteColors && data.selectedPaletteColors.length > 0
    ? `Paleta Seleccionada: ${data.selectedPaletteColors.join(', ')}\n`
    : '';

  const body = encodeURIComponent(
    `Nombre: ${data.clientName || 'N/A'}\n` +
    `Empresa: ${data.companyName || 'N/A'}\n` +
    `Email: ${data.clientEmail || 'N/A'}\n` +
    aestheticText +
    paletteText +
    `Servicios: ${(data.selectedServices || []).join(', ') || 'General'}\n` +
    `Presupuesto Estimado: ${data.budgetTier || 'No especificado'}\n` +
    `Plazo Deseado: ${data.projectTimeline || 'Flexible'}\n\n` +
    `Brief del Proyecto:\n${data.projectBrief || 'N/A'}`
  );
  return `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
}

/**
 * Generates WhatsApp direct contact link pre-populated with aesthetic direction, palette and scope.
 */
export function generateWhatsAppInquiryLink(
  data: Partial<ProjectInquiryData>,
  phone: string = '34910234567'
): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const lines: string[] = [
    'Hola Lumen & Form Studio.',
    'Me gustaría consultar la viabilidad de un nuevo proyecto:',
  ];

  if (data.clientName) lines.push(`*Contacto:* ${data.clientName}${data.companyName ? ` (${data.companyName})` : ''}`);
  if (data.aestheticDirection) lines.push(`*Dirección Visual:* ${data.aestheticDirection}`);
  if (data.selectedPaletteColors && data.selectedPaletteColors.length > 0) {
    lines.push(`*Paleta:* ${data.selectedPaletteColors.join(' · ')}`);
  }
  if (data.selectedServices && data.selectedServices.length > 0) {
    lines.push(`*Servicios:* ${data.selectedServices.join(', ')}`);
  }
  if (data.budgetTier) lines.push(`*Presupuesto:* ${data.budgetTier}`);
  if (data.projectTimeline) lines.push(`*Plazo:* ${data.projectTimeline}`);
  if (data.projectBrief) lines.push(`*Idea / Brief:* ${data.projectBrief}`);

  const message = lines.join('\n');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Formats full project brief as plain text for clipboard copying.
 */
export function formatProjectSummaryText(data: Partial<ProjectInquiryData>): string {
  const lines: string[] = [
    '=== BRIEF DE PROYECTO · LUMEN & FORM STUDIO ===',
    `Cliente: ${data.clientName || 'Por definir'}`,
    `Empresa / Marca: ${data.companyName || 'Por definir'}`,
    `Email: ${data.clientEmail || 'Por definir'}`,
    `Dirección Estética: ${data.aestheticDirection || 'Por definir'}`,
    `Paleta Cromática: ${(data.selectedPaletteColors || []).join(', ') || 'Por definir'}`,
    `Disciplinas: ${(data.selectedServices || []).join(', ') || 'Por definir'}`,
    `Inversión Estimada: ${data.budgetTier || 'Por definir'}`,
    `Plazo Deseado: ${data.projectTimeline || 'Flexible'}`,
    '',
    'Brief / Objetivos:',
    data.projectBrief || 'Sin descripción adicional',
  ];
  return lines.join('\n');
}

