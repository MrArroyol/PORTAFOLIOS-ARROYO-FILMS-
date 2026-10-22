export type ProjectCategory = 
  | 'All'
  | 'Todos'
  | 'Branding' 
  | 'Videos' 
  | 'Motion' 
  | 'Campañas' 
  | 'Digital'
  | 'Brand Identity' 
  | 'Brand Films' 
  | 'Motion Design' 
  | 'Campaigns' 
  | 'Digital Experiences';

export interface ProjectStill {
  title: string;
  timecode?: string;
  description: string;
  type: 'cinematic' | 'identity' | 'macro' | 'editorial' | 'ui';
  motif: string;
  color: string;
  imageUrl?: string;
  shotType?: string;
  lens?: string;
  lighting?: string;
  gradingNote?: string;
}

export interface B2BCommercialTerms {
  toolingPayment: string;
  toolingBreakdown: string[];
  productionDelivery: string;
  maintenanceIncluded: string;
  documentImageUrl?: string;
}

export interface CaseStudyData {
  overview: string;
  communicationChallenge: string;
  creativeConcept: string;
  visualIdentity: {
    palette: { name: string; hex: string }[];
    typography: string;
    artDirection: string;
  };
  stills: ProjectStill[];
  brandApplications: string[];
  deliverables: string[];
  conceptualResults?: string[];
  b2bCommercialTerms?: B2BCommercialTerms;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tagDisplay?: string;
  category: Exclude<ProjectCategory, 'All' | 'Todos'>;
  year: string;
  client: string;
  role: string;
  summary: string;
  aspectRatio: 'wide' | 'standard' | 'tall';
  accentColor: string;
  gridSpan: string;
  visualMotif: string;
  videoUrl?: string;
  imageUrl?: string;
  isRealWork?: boolean;
  featuredOrder?: number;
  caseStudy: CaseStudyData;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  disciplines: string[];
  deliverables: string[];
  typicalTimeline: string;
}

export interface ProcessStage {
  number: string;
  phase: string;
  title: string;
  description: string;
  keyOutputs: string[];
  timeframe: string;
}

export interface StudioInfo {
  name: string;
  subtitle: string;
  leadCreative: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  whatsapp: string;
  bio: string;
  manifesto: string;
  socials: {
    platform: string;
    handle: string;
    url: string;
  }[];
}

export interface ProjectInquiryData {
  clientName: string;
  clientEmail: string;
  companyName: string;
  selectedServices: string[];
  budgetTier: string;
  projectTimeline: string;
  projectBrief: string;
  aestheticDirection?: string;
  selectedPaletteColors?: string[];
  targetDeliverables?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
