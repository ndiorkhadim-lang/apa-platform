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
 * Journey audience role. Two entry levels, each with a description shown in
 * filters and in the submission form's target-role select.
 */
export type RoleFilter = 'OBSERVER' | 'PRACTITIONER';

export const ROLE_META: Record<RoleFilter, { label: string; description: string; accent: string }> = {
  OBSERVER: {
    label: 'Observer',
    description:
      'Project directors, ESG officers, investment managers ready for direct community interface.',
    accent: 'observer',
  },
  PRACTITIONER: {
    label: 'Practitioner · Co-Architect',
    description:
      'Institutional partners, DFIs, sovereign capital deployers ready for deep co-architecture.',
    accent: 'practitioner',
  },
};

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
  description: string; // rich text / long form
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

// ── Filters ──────────────────────────────────────────────
export interface JourneyFilters {
  role: RoleFilter | 'ALL';
  country: string | 'ALL';
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
