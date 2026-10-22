import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterProjectsByCategory,
  getAdjacentProject,
  formatTimecode,
  parseTimecodeToSeconds,
  validateProjectInquiry,
  generateMailtoLink,
  generateWhatsAppInquiryLink,
  formatProjectSummaryText,
  parseViewFromHash,
  calculatePackageEstimate,
  sortProjects,
} from './portfolio';
import { Project } from '../types/portfolio';

const mockProjects: Project[] = [
  {
    id: 'proj-1',
    slug: 'aura-noir',
    title: 'Aura Noir',
    subtitle: 'Identidad y Film',
    category: 'Brand Identity',
    year: '2025',
    client: 'Conceptual Luxury Goods',
    role: 'Creative Direction',
    summary: 'Brief summary',
    aspectRatio: 'wide',
    accentColor: '#B58A60',
    gridSpan: 'col-span-12',
    visualMotif: 'flame',
    caseStudy: {
      overview: 'Overview',
      communicationChallenge: 'Challenge',
      creativeConcept: 'Concept',
      visualIdentity: {
        palette: [{ name: 'Black', hex: '#000000' }],
        typography: 'Sans',
        artDirection: 'Minimal',
      },
      stills: [],
      brandApplications: [],
      deliverables: [],
    },
  },
  {
    id: 'proj-2',
    slug: 'monolith-ev',
    title: 'Monolith EV',
    subtitle: 'Brand Film Comercial',
    category: 'Brand Films',
    year: '2025',
    client: 'Conceptual Automotive',
    role: 'Direction & Cinematography',
    summary: 'EV campaign',
    aspectRatio: 'wide',
    accentColor: '#8E9AAF',
    gridSpan: 'col-span-12',
    visualMotif: 'architectural',
    caseStudy: {
      overview: 'Overview',
      communicationChallenge: 'Challenge',
      creativeConcept: 'Concept',
      visualIdentity: {
        palette: [{ name: 'Silver', hex: '#CCCCCC' }],
        typography: 'Sans',
        artDirection: 'Sleek',
      },
      stills: [],
      brandApplications: [],
      deliverables: [],
    },
  },
  {
    id: 'proj-3',
    slug: 'chronos',
    title: 'Chronos Atelier',
    subtitle: 'Motion Graphics Horlogerie',
    category: 'Motion Design',
    year: '2026',
    client: 'Conceptual Horlogerie',
    role: 'Motion Design',
    summary: 'Watch movement',
    aspectRatio: 'standard',
    accentColor: '#C49B66',
    gridSpan: 'col-span-6',
    visualMotif: 'gears',
    caseStudy: {
      overview: 'Overview',
      communicationChallenge: 'Challenge',
      creativeConcept: 'Concept',
      visualIdentity: {
        palette: [{ name: 'Gold', hex: '#FFD700' }],
        typography: 'Serif',
        artDirection: 'Precision',
      },
      stills: [],
      brandApplications: [],
      deliverables: [],
    },
  },
];

test('filterProjectsByCategory returns all projects when category is All', () => {
  const result = filterProjectsByCategory(mockProjects, 'All');
  assert.equal(result.length, 3);
});

test('filterProjectsByCategory correctly filters by specific category', () => {
  const brandFilms = filterProjectsByCategory(mockProjects, 'Brand Films');
  assert.equal(brandFilms.length, 1);
  assert.equal(brandFilms[0].title, 'Monolith EV');

  const digital = filterProjectsByCategory(mockProjects, 'Digital Experiences');
  assert.equal(digital.length, 0);
});

test('getAdjacentProject loops circularly forward and backward', () => {
  const nextFromLast = getAdjacentProject(mockProjects, 'proj-3', 'next');
  assert.equal(nextFromLast.id, 'proj-1');

  const prevFromFirst = getAdjacentProject(mockProjects, 'proj-1', 'prev');
  assert.equal(prevFromFirst.id, 'proj-3');

  const nextFromFirst = getAdjacentProject(mockProjects, 'proj-1', 'next');
  assert.equal(nextFromFirst.id, 'proj-2');
});

test('formatTimecode handles edge cases, zero and minute conversions', () => {
  assert.equal(formatTimecode(0), '00:00');
  assert.equal(formatTimecode(9), '00:09');
  assert.equal(formatTimecode(65), '01:05');
  assert.equal(formatTimecode(150), '02:30');
  assert.equal(formatTimecode(-5), '00:00');
  assert.equal(formatTimecode(NaN), '00:00');
});

test('parseTimecodeToSeconds parses MM:SS into correct seconds', () => {
  assert.equal(parseTimecodeToSeconds('00:01'), 1);
  assert.equal(parseTimecodeToSeconds('00:03'), 3);
  assert.equal(parseTimecodeToSeconds('01:30'), 90);
  assert.equal(parseTimecodeToSeconds(''), 0);
  assert.equal(parseTimecodeToSeconds(undefined), 0);
  assert.equal(parseTimecodeToSeconds('invalid'), 0);
});

test('parseViewFromHash maps hashes to valid view states', () => {
  assert.equal(parseViewFromHash('#/proyectos'), 'proyectos');
  assert.equal(parseViewFromHash('#showreel'), 'showreel');
  assert.equal(parseViewFromHash('#servicios'), 'servicios');
  assert.equal(parseViewFromHash('#estudio'), 'estudio');
  assert.equal(parseViewFromHash('#contacto'), 'contacto');
  assert.equal(parseViewFromHash(''), 'home');
  assert.equal(parseViewFromHash('#invalid-route'), 'home');
});

test('calculatePackageEstimate computes realistic budget ranges', () => {
  const emptyEst = calculatePackageEstimate([]);
  assert.equal(emptyEst.min, 0);

  const singleEst = calculatePackageEstimate(['Producción Audiovisual']);
  assert.equal(singleEst.min, 12000);
  assert.equal(singleEst.max, 28000);

  const bundleEst = calculatePackageEstimate(['Desarrollo de Marca', 'Producción Audiovisual', 'Motion Design']);
  assert.ok(bundleEst.min > 15000);
  assert.ok(bundleEst.label.includes('USD'));
});

test('validateProjectInquiry validates required fields and regex correctly', () => {
  const emptyRes = validateProjectInquiry({});
  assert.equal(emptyRes.isValid, false);
  assert.ok(emptyRes.errors.clientName);
  assert.ok(emptyRes.errors.clientEmail);
  assert.ok(emptyRes.errors.selectedServices);
  assert.ok(emptyRes.errors.projectBrief);

  const validRes = validateProjectInquiry({
    clientName: 'Alejandro Ramos',
    clientEmail: 'alejandro@example.com',
    selectedServices: ['Brand Films', 'Brand Identity'],
    projectBrief: 'Queremos realizar una campaña cinematográfica para nuestro nuevo lanzamiento de marca.',
  });
  assert.equal(validRes.isValid, true);
  assert.equal(Object.keys(validRes.errors).length, 0);
});

test('generateMailtoLink creates well-formed mailto URI with encoded params', () => {
  const link = generateMailtoLink(
    {
      clientName: 'Elena Soto',
      companyName: 'Vanguard Corp',
      clientEmail: 'elena@vanguard.com',
      selectedServices: ['Brand Identity'],
      budgetTier: '$10k - $25k',
      projectTimeline: '2 meses',
      projectBrief: 'Creación de nueva identidad visual y paquete de lanzamiento.',
    },
    'contacto@lumenform.studio'
  );

  assert.ok(link.startsWith('mailto:contacto@lumenform.studio?subject='));
  assert.ok(link.includes('Vanguard%20Corp'));
});

test('generateWhatsAppInquiryLink formats WhatsApp link with aesthetic direction and palette', () => {
  const wa = generateWhatsAppInquiryLink(
    {
      clientName: 'Carlos M.',
      companyName: 'Studio Nova',
      aestheticDirection: 'Cinema Gold & Medical Luxe',
      selectedPaletteColors: ['#D4AF37', '#0B0C0E'],
      selectedServices: ['Producción Audiovisual'],
      budgetTier: '$10k – $25k',
      projectBrief: 'Queremos filmar un procedimiento estético con estilo documental.',
    },
    '+34 910 234 567'
  );

  assert.ok(wa.startsWith('https://wa.me/34910234567?text='));
  assert.ok(wa.includes(encodeURIComponent('Cinema Gold & Medical Luxe')));
  assert.ok(wa.includes(encodeURIComponent('#D4AF37')));
});

test('formatProjectSummaryText produces clean structured markdown/text summary', () => {
  const summary = formatProjectSummaryText({
    clientName: 'Carlos M.',
    companyName: 'Studio Nova',
    clientEmail: 'carlos@nova.com',
    aestheticDirection: 'Noir Chiaroscuro',
    selectedPaletteColors: ['#C89F77', '#080808'],
    selectedServices: ['Desarrollo de Marca'],
    budgetTier: '$25k – $50k',
    projectBrief: 'Rediseño total de identidad de marca.',
  });

  assert.ok(summary.includes('=== BRIEF DE PROYECTO · LUMEN & FORM STUDIO ==='));
  assert.ok(summary.includes('Noir Chiaroscuro'));
  assert.ok(summary.includes('#C89F77'));
  assert.ok(summary.includes('Rediseño total de identidad de marca.'));
});

test('filterProjectsByCategory supports Todos as alias for All and handles display categories', () => {
  const resultTodos = filterProjectsByCategory(mockProjects, 'Todos');
  assert.equal(resultTodos.length, 3);

  const resultBranding = filterProjectsByCategory(mockProjects, 'Branding');
  assert.equal(resultBranding.length, 1);
  assert.equal(resultBranding[0].title, 'Aura Noir');
});

test('sortProjects accurately sorts by name, recency and featuredOrder', () => {
  const byName = sortProjects(mockProjects, 'nombre');
  assert.equal(byName[0].title, 'Aura Noir');
  assert.equal(byName[1].title, 'Chronos Atelier');
  assert.equal(byName[2].title, 'Monolith EV');

  const byYear = sortProjects(mockProjects, 'recientes');
  assert.equal(byYear[0].title, 'Chronos Atelier'); // 2026
});

