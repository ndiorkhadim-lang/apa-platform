/**
 * APA Journeys — immersive field-experience platform types.
 * Source of truth for the Journey feature (listing, detail, submission,
 * applications, feedback). Mock-backed today (src/data/journeys.ts),
 * structured to swap onto a backend/DB with no shape change.
 */

// ── Roles & users ────────────────────────────────────────
export type JourneyUserType = 'partner_business' | 'explorer';

export interface JourneyUser {
  id: string;
  name: string;
  email: string;
  userType: JourneyUserType;
}

/**
 * Journey audience role — THREE distinct engagement tiers, mapping to the
 * Master Memoire's 3-beat arc (Understand → Engage → Become Accountable).
 * Each is a separate filter and has its own dedicated landing page.
 */
export type RoleFilter = 'OBSERVER' | 'PRACTITIONER' | 'CO_ARCHITECT';

export const ROLE_ORDER: RoleFilter[] = ['OBSERVER', 'PRACTITIONER', 'CO_ARCHITECT'];

export const ROLE_META: Record<RoleFilter, { label: string; slug: string; description: string; badge: string }> = {
  OBSERVER: {
    label: 'Observer',
    slug: 'observer',
    description:
      'Project directors, ESG officers and investment managers ready for a direct community interface.',
    badge: 'bg-apa-teal text-white',
  },
  PRACTITIONER: {
    label: 'Practitioner',
    slug: 'practitioner',
    description:
      'Development practitioners, consultants and compliance leads ready to apply the APA toolkit hands-on in the field.',
    badge: 'bg-apa-green text-white',
  },
  CO_ARCHITECT: {
    label: 'Co-Architect',
    slug: 'co-architect',
    description:
      'Institutional partners, DFIs and sovereign capital deployers ready to co-design certified, bankable deal structures.',
    badge: 'bg-apa-navy text-apa-gold-bright',
  },
};

/** Full role dossier — powers the dedicated role landing pages. */
export interface RoleDossier {
  role: RoleFilter;
  tagline: string;
  purpose: string;
  objectives: string[];
  eligibility: string[];
  responsibilities: string[];
  learningPathway: string[];
  certificationPathway: string;
  benefits: string[];
}

export const ROLE_DOSSIERS: Record<RoleFilter, RoleDossier> = {
  OBSERVER: {
    role: 'OBSERVER',
    tagline: 'Understand — experience verifiable accountability at ground level.',
    purpose:
      'The entry tier of the APA engagement arc. Observers witness the accountability standard in action — meeting communities, regulators and certified enterprises — and translate direct observation into a governance action plan.',
    objectives: [
      'Experience the Made-in-Africa Evaluation (MAE) lens applied in the field.',
      'Understand how the Authenticity Premium™ compresses the risk premium.',
      'Build direct relationships with community-verification actors.',
      'Produce a personal governance action plan.',
    ],
    eligibility: [
      'Project directors, ESG officers, investment managers.',
      'No prior GRC certification required.',
      'Openness to direct community interface.',
    ],
    responsibilities: [
      'Full attendance and active field participation.',
      'Respect community narrative sovereignty (mandate #55).',
      'Complete the post-journey reflection.',
    ],
    learningPathway: [
      'Pre-journey briefing on the APA framework',
      'Field observation across institutions & communities',
      'MAE measurement workshop',
      'Governance action-plan synthesis',
    ],
    certificationPathway: 'APA Journey Certificate (Observer) — a credential of verified field exposure, and the on-ramp to the C-SPA diagnostic.',
    benefits: [
      'Verifiable APA Journey certificate',
      'Direct DFI & community network',
      'Access to APA Intelligence previews',
    ],
  },
  PRACTITIONER: {
    role: 'PRACTITIONER',
    tagline: 'Engage — apply the APA toolkit hands-on in the field.',
    purpose:
      'The applied tier. Practitioners move from observation to practice — deploying APA diagnostics and mandates alongside local partners, and building the evidence base for certification.',
    objectives: [
      'Apply APA diagnostics (C-SPA, MAE, trust audit) in a live context.',
      'Co-run a grievance mechanism (MGG) design session.',
      'Assemble certification-grade evidence for a real entity.',
      'Map local-sourcing and σ-leakage in practice.',
    ],
    eligibility: [
      'Development practitioners, consultants, compliance officers, SME leaders.',
      '3+ years of relevant experience recommended.',
      'A live project or entity to apply the toolkit to.',
    ],
    responsibilities: [
      'Deploy assigned tools with local counterparts.',
      'Document evidence to APA standards.',
      'Uphold anti-retaliation and parity mandates.',
    ],
    learningPathway: [
      'Toolkit deep-dive (forms, guides, legal instruments, metrics)',
      'Supervised field application with partners',
      'Evidence assembly for the Digital Portfolio (tool #52)',
      'Practitioner review & feedback',
    ],
    certificationPathway: 'APA Journey Certificate (Practitioner) — recognizes applied competence and feeds directly into an entity’s certification journey.',
    benefits: [
      'Applied APA toolkit certification',
      'Practitioner network & referrals',
      'Full GRC-suite (Intelligence T2) access',
    ],
  },
  CO_ARCHITECT: {
    role: 'CO_ARCHITECT',
    tagline: 'Become Accountable — co-design certified, bankable structures.',
    purpose:
      'The institutional tier. Co-Architects work at the sovereign-to-enterprise interface, co-designing binding governance instruments (veto rights, kinship equity, 10-year dashboards) around a live investment thesis. Outputs are working instruments, not memos.',
    objectives: [
      'Co-architect a certified, bankable deal structure with local partners.',
      'Apply the 15 contractual mandates to a live thesis.',
      'Design a 10-year systems-change dashboard.',
      'Establish a sovereign-to-enterprise accountability chain.',
    ],
    eligibility: [
      'Institutional partners, DFIs, sovereign funds, senior investment leads.',
      'Authority to co-commit to a live thesis.',
      'Advanced governance/investment experience.',
    ],
    responsibilities: [
      'Co-draft binding instruments with counsel.',
      'Commit to CVP activation and σ-suppression targets.',
      'Champion the certified structure within your institution.',
    ],
    learningPathway: [
      'Investment thesis & DFI diligence mapping',
      'Mandate architecture (veto, parity, kinship equity)',
      'CVP activation & 10-year dashboard design',
      'Deal-structure finalization with counsel',
    ],
    certificationPathway: 'APA Co-Architect Certification — the highest journey credential, tied to a co-created certified deal structure and the Authenticity Premium™.',
    benefits: [
      'Co-Architect certification & seal',
      'Direct sovereign & DFI relationships',
      'Bespoke advisory (Intelligence T3)',
    ],
  },
};

// ── Geography — the 22 APA priority nations (scalable) ───
export interface CountryOption {
  code: string;
  name: string;
  flag: string;
  region: 'West' | 'East' | 'Central' | 'North' | 'Southern';
}

export const PRIORITY_COUNTRIES: CountryOption[] = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', region: 'West' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', region: 'West' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', region: 'West' },
  { code: 'CI', name: 'Côte d’Ivoire', flag: '🇨🇮', region: 'West' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯', region: 'West' },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳', region: 'West' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', region: 'West' },
  { code: 'GM', name: 'Gambia', flag: '🇬🇲', region: 'West' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', region: 'East' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', region: 'East' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', region: 'East' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', region: 'East' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', region: 'East' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', region: 'East' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', region: 'Central' },
  { code: 'CD', name: 'DR Congo', flag: '🇨🇩', region: 'Central' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', region: 'North' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', region: 'North' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', region: 'Southern' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', region: 'Southern' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', region: 'Southern' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', region: 'Southern' },
];

export const REGIONS = ['West', 'East', 'Central', 'North', 'Southern'] as const;

// ── Delivery & activity types (Journey Alerts) ───────────
export type DeliveryFormat = 'In-Person' | 'Hybrid' | 'Online';
export const DELIVERY_FORMATS: DeliveryFormat[] = ['In-Person', 'Hybrid', 'Online'];

export const ACTIVITY_TYPES = [
  'Certification',
  'Training',
  'Workshop',
  'Conference',
  'Webinar',
  'Masterclass',
  'Research Program',
  'Field Mission',
  'Community Initiative',
  'Networking Event',
  'Leadership Programme',
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

// ── Enumerations ─────────────────────────────────────────
export type Difficulty = 'Pioneer' | 'Explorer' | 'Advanced';

export const DIFFICULTIES: Difficulty[] = ['Pioneer', 'Explorer', 'Advanced'];

export type Theme =
  | 'Social Innovation'
  | 'Ethical Leadership'
  | 'Community Development'
  | 'ESG'
  | 'Impact Investing'
  | 'Sustainable Development'
  | 'Governance';

export const THEMES: Theme[] = [
  'Social Innovation',
  'Ethical Leadership',
  'Community Development',
  'ESG',
  'Impact Investing',
  'Sustainable Development',
  'Governance',
];

export type Audience =
  | 'Social Entrepreneurs'
  | 'ESG Officers'
  | 'Project Directors'
  | 'Investment Managers'
  | 'DFIs'
  | 'Sovereign Funds'
  | 'Development Practitioners'
  | 'Foundation Leaders';

export const AUDIENCES: Audience[] = [
  'Social Entrepreneurs',
  'ESG Officers',
  'Project Directors',
  'Investment Managers',
  'DFIs',
  'Sovereign Funds',
  'Development Practitioners',
  'Foundation Leaders',
];

export type Inclusion =
  | 'Accommodation'
  | 'Meals'
  | 'Local Transportation'
  | 'Guides'
  | 'Academic Sessions'
  | 'Certificate';

export type Exclusion =
  | 'International Flights'
  | 'Visa'
  | 'Travel Insurance'
  | 'Personal Expenses'
  | 'Gratuities';

export type JourneyStatus = 'Draft' | 'Pending' | 'Approved' | 'Active' | 'Completed';

// ── Nested structures ────────────────────────────────────
export interface Meals {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  accommodation: string;
  meals: Meals;
}

export interface Facilitator {
  id: string;
  name: string;
  title: string;
  bio: string;
  photo?: string;
  yearsExperience?: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  name: string;
  organization: string;
  quote: string;
  photo?: string;
}

export interface SessionDate {
  id: string;
  startDate: string; // ISO
  endDate: string; // ISO
}

// ── The Journey entity ───────────────────────────────────
export interface Journey {
  id: string;
  slug: string;
  title: string;
  roleFilter: RoleFilter;

  // location
  country: string;
  countryFlag: string;
  cityRegion: string;

  // media
  coverImage?: string;
  gallery: string[];

  // meta
  durationDays: number;
  priceUSD: number;
  difficulty: Difficulty;
  themes: Theme[];
  audiences: Audience[];
  maxCapacity: number;
  dates: SessionDate[];

  // content
  description: string; // rich text / long form (Overview)
  purpose: string;
  strategicContext: string;
  expectedOutcomes: string[];
  skillsDeveloped: string[];
  learningModules: string[];
  deliveryFormat: DeliveryFormat;
  relatedSolutions: string[];
  relatedFrameworks: string[]; // pillar codes
  relatedTools: number[]; // tool numbers
  relatedCertifications: string[];
  successStories: string[];
  objectives: string[];
  itinerary: ItineraryDay[];
  facilitators: Facilitator[];
  faq: FAQItem[];
  testimonials: Testimonial[];

  included: Inclusion[];
  notIncluded: Exclusion[];

  // ownership & state
  ownerId: string; // partner_business user id
  status: JourneyStatus;
  createdAt: string; // ISO
  applicationsCount: number;
}

// ── Applications & feedback ──────────────────────────────
export type ApplicationStatus =
  | 'Pending'
  | 'Accepted'
  | 'Waitlisted'
  | 'Rejected'
  | 'Completed';

export interface JourneyApplication {
  id: string;
  journeyId: string;
  journeyTitle: string;
  applicantName: string;
  appliedAt: string; // ISO
  status: ApplicationStatus;
}

/** 19 rating dimensions (1–5) + 5 open questions. */
export interface JourneyFeedback {
  ratings: Record<string, number>; // key = dimension id, value 1..5
  open: Record<string, string>; // key = question id
  submittedAt: string;
}

// ── Journey Alerts ───────────────────────────────────────
export interface JourneyAlertPrefs {
  country: string | 'ANY';
  region: string | 'ANY';
  journeyRole: RoleFilter | 'ANY';
  activityType: ActivityType | 'ANY';
  language: 'English' | 'French' | 'Both';
  deliveryMode: DeliveryFormat | 'ANY';
  email: string;
}

// ── Application (full workflow) ──────────────────────────
export interface JourneyApplicationForm {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  countryResidence: string;
  city: string;
  email: string;
  phone: string;
  position: string;
  organization: string;
  industry: string;
  yearsExperience: string;
  languages: string;
  expertise: string;
  motivationWhy: string;
  motivationImpact: string;
  priorExperience: string;
  acceptEthics: boolean;
  acceptPrivacy: boolean;
  signature: string;
}

// ── Filters ──────────────────────────────────────────────
export interface JourneyFilters {
  role: RoleFilter | 'ALL';
  country: string | 'ALL';
  region: string | 'ALL';
  difficulty: Difficulty | 'ALL';
  theme: Theme | 'ALL';
  maxPrice: number | null;
  search: string;
}

export const FEEDBACK_RATING_DIMENSIONS: { id: string; label: string }[] = [
  { id: 'r1', label: 'Clarity of pre-tour information and communication' },
  { id: 'r2', label: 'Responsiveness of organizers to questions/concerns' },
  { id: 'r3', label: 'Quality of accommodations provided' },
  { id: 'r4', label: 'Cleanliness and comfort of accommodations' },
  { id: 'r5', label: 'Efficiency and safety of local transportation' },
  { id: 'r6', label: 'Comfort and safety during long-distance travel' },
  { id: 'r7', label: 'Diversity and balance of the itinerary activities' },
  { id: 'r8', label: 'Authenticity and depth of local community engagement' },
  { id: 'r9', label: 'Alignment with ethical business and social innovation themes' },
  { id: 'r10', label: 'Knowledge and professionalism of local guides' },
  { id: 'r11', label: 'Supportiveness and facilitation of program leads' },
  { id: 'r12', label: 'Quality and relevance of academic/educational sessions' },
  { id: 'r13', label: 'Opportunities provided for personal growth and leadership' },
  { id: 'r14', label: 'Depth of cultural immersion and local connection' },
  { id: 'r15', label: 'Opportunities to interact and build networks with local peers' },
  { id: 'r16', label: 'Perceived effectiveness of the co-created social innovation solutions' },
  { id: 'r17', label: 'Clear understanding of tangible outcomes for local partners' },
  { id: 'r18', label: 'Your overall satisfaction with the APA Journey' },
  { id: 'r19', label: 'Likelihood that you would recommend this journey to others' },
];

export const FEEDBACK_OPEN_QUESTIONS: { id: string; label: string }[] = [
  { id: 'o1', label: 'What were the most valuable aspects of this journey for you?' },
  { id: 'o2', label: 'What aspects of the journey do you feel could be improved?' },
  { id: 'o3', label: 'How well did the experience align with your expectations?' },
  { id: 'o4', label: 'How do you plan to apply the knowledge and skills gained from this program?' },
  { id: 'o5', label: 'Do you have any other comments, suggestions, or feedback for us?' },
];
