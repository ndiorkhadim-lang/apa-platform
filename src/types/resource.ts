/**
 * APA Knowledge & Resource Center — the intelligence library types.
 * Source of truth for the resource corpus (listing, detail, learning paths,
 * search, filters, admin CMS). Mock-backed today (src/data/resources.ts),
 * structured to swap onto a headless CMS / DB with no shape change.
 *
 * Every resource is a node in the APA ecosystem graph — connected to
 * Solutions, Frameworks (pillars), Tools, Journeys and Certifications.
 */

// ── Taxonomy ─────────────────────────────────────────────
export const RESOURCE_TYPES = [
  'Article',
  'Guide',
  'Framework',
  'White Paper',
  'Research Paper',
  'Toolkit',
  'Case Study',
  'Video',
  'Webinar',
  'Podcast',
  'Report',
  'Policy Brief',
  'Certification Guide',
  'Implementation Manual',
  'Investigation',
] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

/** Icon + accent per type (V8 palette classes). */
export const RESOURCE_TYPE_META: Record<ResourceType, { icon: string; badge: string }> = {
  Article: { icon: '📄', badge: 'bg-apa-soft text-apa-green' },
  Guide: { icon: '🧭', badge: 'bg-apa-green/10 text-apa-green' },
  Framework: { icon: '🏛️', badge: 'bg-apa-navy text-white' },
  'White Paper': { icon: '📘', badge: 'bg-apa-navy/10 text-apa-navy' },
  'Research Paper': { icon: '🔬', badge: 'bg-apa-teal/15 text-apa-teal' },
  Toolkit: { icon: '🧰', badge: 'bg-apa-gold/20 text-apa-bronze' },
  'Case Study': { icon: '📈', badge: 'bg-apa-green/10 text-apa-green-mid' },
  Video: { icon: '▶️', badge: 'bg-apa-bronze/15 text-apa-bronze' },
  Webinar: { icon: '🎥', badge: 'bg-apa-teal/15 text-apa-teal' },
  Podcast: { icon: '🎙️', badge: 'bg-apa-navy/10 text-apa-navy' },
  Report: { icon: '📊', badge: 'bg-apa-soft text-apa-green' },
  'Policy Brief': { icon: '📝', badge: 'bg-apa-gold/20 text-apa-bronze' },
  'Certification Guide': { icon: '🎓', badge: 'bg-apa-gold-bright/20 text-apa-bronze' },
  'Implementation Manual': { icon: '⚙️', badge: 'bg-apa-navy/10 text-apa-navy' },
  Investigation: { icon: '🔍', badge: 'bg-apa-bronze text-white' },
};

export const INDUSTRIES = [
  'Government',
  'Mining',
  'Energy',
  'Agriculture',
  'Health',
  'Education',
  'Finance',
  'Infrastructure',
  'Manufacturing',
  'NGOs',
  'Development Finance',
  'Technology',
] as const;
export type Industry = (typeof INDUSTRIES)[number];

export const GOVERNANCE_DOMAINS = [
  'Transparency',
  'Accountability',
  'Ethics',
  'CSV',
  'ESG',
  'Community Verification',
  'Authenticity Premium™',
  'Certification',
] as const;
export type GovernanceDomain = (typeof GOVERNANCE_DOMAINS)[number];

export const RESOURCE_LANGUAGES = ['English', 'French', 'Portuguese', 'Arabic'] as const;
export type ResourceLanguage = (typeof RESOURCE_LANGUAGES)[number];

export const SORT_OPTIONS = [
  'Newest',
  'Most Popular',
  'Most Downloaded',
  "Editor's Choice",
  'Recently Updated',
] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

// ── Media & publication structures ───────────────────────
export interface TranscriptEntry {
  speaker?: string; // e.g. 'PAPE SAMB' — omitted for narration
  time?: string; // mm:ss marker (optional)
  text: string;
}

export interface TimelineEntry {
  label: string; // e.g. 'Leak nº1' or a year
  title: string;
  text: string;
}

export interface StatEntry {
  label: string;
  value: string; // display value, e.g. '$80B'
  pct: number; // 0..100 — drives the chart bar
  note?: string;
}

// ── The Resource entity ──────────────────────────────────
export interface Resource {
  id: string;
  slug: string;
  title: string;
  type: ResourceType;
  coverImage?: string;

  // summary / content
  executiveSummary: string; // card-level abstract
  executiveOverview: string; // detail intro (long)
  purpose: string;
  businessValue: string;
  keyInsights: string[];
  aiSummary: string; // pre-generated AI TL;DR

  // meta
  author: string;
  authorTitle: string;
  publishedAt: string; // ISO
  updatedAt: string; // ISO
  readingMinutes: number;
  language: ResourceLanguage;
  otherLanguages: ResourceLanguage[];
  countries: string[]; // ISO country names ('ALL' allowed via 'Pan-African')
  industries: Industry[];
  domains: GovernanceDomain[];

  // ecosystem graph
  relatedSolutions: string[]; // solution ids (s1..s6)
  relatedFrameworks: string[]; // pillar codes I..VI
  relatedTools: number[]; // tool numbers
  relatedJourneys: string[]; // journey slugs
  relatedCertifications: string[];
  certificationBadge?: string; // if this is a certification asset

  // downloadable
  hasPdf: boolean;
  fileSizeKb?: number;
  mediaUrl?: string; // external media link (YouTube channel etc.)

  // publication (branded APA template)
  version?: string; // e.g. '1.0' — printed on the publication
  fullContent?: { heading: string; paragraphs: string[] }[]; // long-form body for Read Online / PDF

  // media assets (podcast / video)
  audioUrl?: string; // local /media/*.mp3 — podcast episodes
  videoUrl?: string; // local /media/*.mp4 — video pages
  posterImage?: string; // player poster / episode art
  mediaDurationSec?: number;
  series?: string; // e.g. 'The Proof'
  episode?: number;
  transcript?: TranscriptEntry[];
  downloadDocUrl?: string; // slides / screenplay / report file
  downloadDocLabel?: string;

  // investigation extras
  timeline?: TimelineEntry[];
  stats?: StatEntry[];

  // analytics
  views: number;
  downloads: number;
  rating: number; // 0..5
  ratingCount: number;
  featured: boolean; // Editor's Choice
  trending: boolean;
}

// ── Learning paths (curated collections) ─────────────────
export interface LearningPath {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  level: 'Foundation' | 'Intermediate' | 'Advanced';
  icon: string;
  accent: string; // tailwind gradient/bg class hint
  resourceSlugs: string[]; // ordered — "next resource" is the following one
  outcomes: string[];
}

// ── Filters ──────────────────────────────────────────────
export interface ResourceFilters {
  search: string;
  type: ResourceType | 'ALL';
  industry: Industry | 'ALL';
  domain: GovernanceDomain | 'ALL';
  country: string | 'ALL';
  language: ResourceLanguage | 'ALL';
  year: number | 'ALL';
  sort: SortOption;
}

export const DEFAULT_RESOURCE_FILTERS: ResourceFilters = {
  search: '',
  type: 'ALL',
  industry: 'ALL',
  domain: 'ALL',
  country: 'ALL',
  language: 'ALL',
  year: 'ALL',
  sort: 'Newest',
};

// ── Solution label lookup (kept local to avoid server import in client) ──
export const SOLUTION_LABEL: Record<string, string> = {
  s1: 'Executive Transition & Strategic Paradigm',
  s2: 'Risk & Territory Intelligence',
  s3: 'Certification & Authenticity Premium™',
  s4: 'Capital & Investor Gateway',
  s5: 'Community Verification & Impact',
  s6: 'Diaspora Sovereign Capital Pathway',
};

export const PILLAR_LABEL: Record<string, string> = {
  I: 'I · Governance Foundations',
  II: 'II · Capital Architecture',
  III: 'III · Legal & Contractual Mandates',
  IV: 'IV · Risk & Territory',
  V: 'V · Ethics & Leadership',
  VI: 'VI · Measurement & Certification',
};
