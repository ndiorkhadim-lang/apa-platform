import type { Journey, JourneyApplication, JourneyUser } from '@/types/journey';

/**
 * Mock journey data — realistic, richly structured, ready to be replaced by a
 * backend with no shape change. Two OBSERVER + two PRACTITIONER journeys.
 * Note: cover images are optional; the UI renders a brand gradient fallback
 * (APA rule: African enterprise/infrastructure imagery — never wildlife).
 */

export const MOCK_USERS: Record<string, JourneyUser> = {
  partner: {
    id: 'u_partner_1',
    name: 'Aminata Diop',
    email: 'partner@theapaafrica.org',
    userType: 'partner_business',
  },
  explorer: {
    id: 'u_explorer_1',
    name: 'Daniel Osei',
    email: 'explorer@theapaafrica.org',
    userType: 'explorer',
  },
};

export const JOURNEYS: Journey[] = [
  {
    id: 'j_kenya_ethical',
    slug: 'ethical-leadership-safari-kenya',
    title: 'Ethical Leadership Safari in Kenya',
    roleFilter: 'OBSERVER',
    country: 'Kenya',
    countryFlag: '🇰🇪',
    cityRegion: 'Nairobi & Rift Valley',
    coverImage: undefined,
    gallery: [],
    durationDays: 6,
    priceUSD: 3500,
    difficulty: 'Pioneer',
    themes: ['Ethical Leadership', 'Social Innovation', 'Community Development'],
    audiences: ['ESG Officers', 'Project Directors', 'Investment Managers'],
    maxCapacity: 18,
    dates: [
      { id: 'd1', startDate: '2026-09-14', endDate: '2026-09-19' },
      { id: 'd2', startDate: '2026-11-09', endDate: '2026-11-14' },
    ],
    description:
      'A six-day immersive field experience placing leaders at the direct interface of Kenyan enterprise, governance and community. Beyond boardrooms and reports, participants live the systems they seek to transform — meeting cooperatives, fintech founders, county officials and grassroots verification communities. The Journey operationalizes the APA accountability standard: every visit is framed by the Made-in-Africa Evaluation (MAE) lens, so leaders leave with verifiable, contextual insight rather than performative observation. This is not a study tour; it is a structured reflection on how ethical governance generates measurable enterprise value.',
    objectives: [
      'Experience verifiable accountability at ground level across Kenyan institutions.',
      'Understand how the Authenticity Premium™ compresses the risk premium for certified enterprises.',
      'Build direct relationships with community-verification actors and county leadership.',
      'Translate field observation into a personal governance action plan.',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Welcome Dinner',
        description:
          'Arrival in Nairobi, transfer to the hub hotel, orientation briefing on the APA framework and the week ahead, followed by a welcome dinner with the facilitation team and local partners.',
        accommodation: 'Nairobi hub hotel (4★)',
        meals: { breakfast: false, lunch: false, dinner: true },
      },
      {
        day: 2,
        title: 'Institutional Governance Day',
        description:
          'Sessions with county governance officers and a regulator briefing on Kenya’s digital-governance reforms; afternoon roundtable on institutional readiness (ACRI criterion 2).',
        accommodation: 'Nairobi hub hotel (4★)',
        meals: { breakfast: true, lunch: true, dinner: false },
      },
      {
        day: 3,
        title: 'Fintech & SME Ecosystem',
        description:
          'Visits to two certified SMEs and a fintech founder; hands-on look at the SME Integrity Pipeline and local-sourcing compliance in practice.',
        accommodation: 'Nairobi hub hotel (4★)',
        meals: { breakfast: true, lunch: true, dinner: true },
      },
      {
        day: 4,
        title: 'Rift Valley Community Interface',
        description:
          'Transfer to the Rift Valley; direct interface with a community-verification portal (CVP) cohort — witnessing co-signature and grievance mechanisms first-hand.',
        accommodation: 'Rift Valley lodge (eco)',
        meals: { breakfast: true, lunch: true, dinner: true },
      },
      {
        day: 5,
        title: 'MAE Measurement Workshop',
        description:
          'Facilitated workshop translating the day’s observations into Made-in-Africa Evaluation indicators (dignity, agency, cohesion); peer presentations.',
        accommodation: 'Rift Valley lodge (eco)',
        meals: { breakfast: true, lunch: true, dinner: false },
      },
      {
        day: 6,
        title: 'Synthesis & Departure',
        description:
          'Personal governance action-plan synthesis, certificate ceremony and departure transfers to Nairobi.',
        accommodation: '—',
        meals: { breakfast: true, lunch: false, dinner: false },
      },
    ],
    facilitators: [
      {
        id: 'f1',
        name: 'Wanjiku Kamau',
        title: 'Sustainable Development & APA Framework Architect',
        bio: 'Public-sector reform and digital-governance specialist; APA National Champion for Kenya, leading verifiable accountability across East African institutions.',
        yearsExperience: 15,
      },
      {
        id: 'f2',
        name: 'Pape Samb',
        title: 'CEO & Lead Architect of the APA Framework',
        bio: 'Designer of the APA methodology, the Community Verification Portal and the 10-Year Systems Change Dashboard; 15+ years in governance, risk & compliance.',
        yearsExperience: 15,
      },
    ],
    faq: [
      {
        question: 'Who is this Journey designed for?',
        answer:
          'Observers — project directors, ESG officers and investment managers ready for a direct community interface. Prior GRC expertise is welcome but not required.',
      },
      {
        question: 'What is included in the price?',
        answer:
          'Accommodation, all listed meals, local transportation, expert guides and academic sessions. International flights, visa and insurance are not included.',
      },
      {
        question: 'Do I receive a certificate?',
        answer:
          'Yes — participants who complete the six days receive a verifiable APA Journey certificate.',
      },
    ],
    testimonials: [
      {
        name: 'Chief Risk Officer',
        organization: 'Pan-African financial institution',
        quote:
          'The depth of the community interface — verification cohorts, county leadership — is unlike any study tour. I returned with an action plan, not slides.',
      },
    ],
    included: ['Accommodation', 'Meals', 'Local Transportation', 'Guides', 'Academic Sessions', 'Certificate'],
    notIncluded: ['International Flights', 'Visa', 'Travel Insurance', 'Personal Expenses'],
    ownerId: 'u_partner_1',
    status: 'Active',
    createdAt: '2026-06-02',
    applicationsCount: 12,
  },
  {
    id: 'j_senegal_esg',
    slug: 'senegal-esg-immersion',
    title: 'Senegal ESG & Governance Immersion',
    roleFilter: 'OBSERVER',
    country: 'Senegal',
    countryFlag: '🇸🇳',
    cityRegion: 'Dakar & Saint-Louis',
    coverImage: undefined,
    gallery: [],
    durationDays: 5,
    priceUSD: 2900,
    difficulty: 'Explorer',
    themes: ['ESG', 'Governance', 'Community Development'],
    audiences: ['ESG Officers', 'Development Practitioners', 'Foundation Leaders'],
    maxCapacity: 16,
    dates: [{ id: 'd1', startDate: '2026-10-05', endDate: '2026-10-09' }],
    description:
      'A five-day immersion into Senegal’s governance ecosystem from Dakar — APA’s continental hub — to Saint-Louis. Participants meet UEMOA compliance leaders, OHADA practitioners and cooperative networks, mapping how the Authenticity Premium™ translates into bankable, CSDDD-ready enterprises across Francophone West Africa.',
    objectives: [
      'Map the UEMOA/OHADA governance landscape through direct institutional visits.',
      'Observe local-sourcing and trust-deficit mitigation in practice.',
      'Connect ESG frameworks to verifiable community outcomes.',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Framing in Dakar',
        description: 'Arrival, orientation at the APA continental hub, welcome dinner with local partners.',
        accommodation: 'Dakar hub hotel (4★)',
        meals: { breakfast: false, lunch: false, dinner: true },
      },
      {
        day: 2,
        title: 'Regulatory & Compliance Day',
        description: 'UEMOA compliance sessions and an OHADA practitioner roundtable on enforceable governance.',
        accommodation: 'Dakar hub hotel (4★)',
        meals: { breakfast: true, lunch: true, dinner: false },
      },
      {
        day: 3,
        title: 'Cooperative & SME Visits',
        description: 'Field visits to certified cooperatives; local-sourcing compliance in action.',
        accommodation: 'Dakar hub hotel (4★)',
        meals: { breakfast: true, lunch: true, dinner: true },
      },
      {
        day: 4,
        title: 'Saint-Louis Community Interface',
        description: 'Transfer to Saint-Louis; community-verification interface and grievance-mechanism observation.',
        accommodation: 'Saint-Louis heritage hotel',
        meals: { breakfast: true, lunch: true, dinner: true },
      },
      {
        day: 5,
        title: 'Synthesis & Departure',
        description: 'MAE synthesis workshop, certificate ceremony, departure.',
        accommodation: '—',
        meals: { breakfast: true, lunch: false, dinner: false },
      },
    ],
    facilitators: [
      {
        id: 'f1',
        name: 'Ousmane Diallo',
        title: 'UEMOA Compliance & OHADA Expert — APA Champion (Senegal)',
        bio: 'Former UEMOA compliance director; anchors APA’s continental HQ and OHADA/ECOWAS alignment across Francophone West Africa.',
        yearsExperience: 20,
      },
    ],
    faq: [
      {
        question: 'Is the Journey bilingual?',
        answer: 'Sessions are delivered in French and English; facilitators are bilingual.',
      },
      {
        question: 'What is the fitness/travel intensity?',
        answer: 'Explorer level — moderate travel between Dakar and Saint-Louis, comfortable pacing.',
      },
    ],
    testimonials: [
      {
        name: 'Partner',
        organization: 'Impact fund (West Africa)',
        quote: 'We embedded what we saw into our due diligence. Country analysis time was cut significantly.',
      },
    ],
    included: ['Accommodation', 'Meals', 'Local Transportation', 'Guides', 'Academic Sessions'],
    notIncluded: ['International Flights', 'Visa', 'Travel Insurance', 'Personal Expenses'],
    ownerId: 'u_partner_1',
    status: 'Active',
    createdAt: '2026-06-20',
    applicationsCount: 7,
  },
  {
    id: 'j_rwanda_coarchitect',
    slug: 'rwanda-sovereign-capital-co-architecture',
    title: 'Rwanda Sovereign Capital Co-Architecture',
    roleFilter: 'PRACTITIONER',
    country: 'Rwanda',
    countryFlag: '🇷🇼',
    cityRegion: 'Kigali',
    coverImage: undefined,
    gallery: [],
    durationDays: 7,
    priceUSD: 6500,
    difficulty: 'Advanced',
    themes: ['Impact Investing', 'Governance', 'Sustainable Development'],
    audiences: ['DFIs', 'Sovereign Funds', 'Investment Managers'],
    maxCapacity: 12,
    dates: [{ id: 'd1', startDate: '2026-10-19', endDate: '2026-10-25' }],
    description:
      'A seven-day co-architecture practicum for institutional partners, DFIs and sovereign capital deployers. Beyond observation, practitioners co-design a certified deal structure with Rwandan counterparts — applying the APA mandate suite (veto rights, kinship equity, 10-year dashboards) to a live investment thesis. Outputs are working instruments, not memos.',
    objectives: [
      'Co-architect a certified, bankable deal structure with local partners.',
      'Apply the 15 contractual mandates to a live investment thesis.',
      'Design a 10-year systems-change dashboard for the target sector.',
      'Establish a sovereign-to-enterprise accountability chain.',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Practicum Framing',
        description: 'Arrival in Kigali, practicum framing, welcome dinner with RDB and local partners.',
        accommodation: 'Kigali business hotel (5★)',
        meals: { breakfast: false, lunch: false, dinner: true },
      },
      {
        day: 2,
        title: 'Investment Thesis & Diligence',
        description: 'Working sessions on the live thesis; DFI diligence mapping to APA evidence.',
        accommodation: 'Kigali business hotel (5★)',
        meals: { breakfast: true, lunch: true, dinner: false },
      },
      {
        day: 3,
        title: 'Mandate Architecture',
        description: 'Co-drafting veto rights, parity committees and kinship equity instruments with counsel.',
        accommodation: 'Kigali business hotel (5★)',
        meals: { breakfast: true, lunch: true, dinner: true },
      },
      {
        day: 4,
        title: 'Community Co-Ownership Interface',
        description: 'Field interface with the community cohort; CVP activation design.',
        accommodation: 'Kigali business hotel (5★)',
        meals: { breakfast: true, lunch: true, dinner: true },
      },
      {
        day: 5,
        title: 'Dashboard & σ-Suppression Design',
        description: 'Design the 10-year systems-change dashboard and leakage-coefficient (σ) suppression plan.',
        accommodation: 'Kigali business hotel (5★)',
        meals: { breakfast: true, lunch: true, dinner: false },
      },
      {
        day: 6,
        title: 'Deal Structure Finalization',
        description: 'Finalize the co-architected deal structure; counsel review; investor readiness check.',
        accommodation: 'Kigali business hotel (5★)',
        meals: { breakfast: true, lunch: true, dinner: true },
      },
      {
        day: 7,
        title: 'Presentation & Departure',
        description: 'Present co-architected instruments to the joint committee; certificate; departure.',
        accommodation: '—',
        meals: { breakfast: true, lunch: false, dinner: false },
      },
    ],
    facilitators: [
      {
        id: 'f1',
        name: 'Claire Uwimana',
        title: 'Economic Transformation Champion (Rwanda)',
        bio: 'Investment-climate champion translating institutional trust into bankable pipelines; APA National Champion for Rwanda.',
        yearsExperience: 12,
      },
      {
        id: 'f2',
        name: 'Pape Samb',
        title: 'CEO & Lead Architect of the APA Framework',
        bio: 'Architect of the CVP and the 10-Year Systems Change Dashboard; systemic investment expert.',
        yearsExperience: 15,
      },
    ],
    faq: [
      {
        question: 'What is the required seniority?',
        answer:
          'Advanced — designed for institutional decision-makers (DFIs, sovereign funds, senior investment leads) able to co-commit to a live thesis.',
      },
      {
        question: 'Are the co-architected instruments binding?',
        answer:
          'They are working drafts prepared with counsel; execution follows your institution’s own legal process.',
      },
    ],
    testimonials: [
      {
        name: 'Secretary General',
        organization: 'State-owned enterprise (West Africa)',
        quote: 'The dashboard we co-designed gave our board a visibility our consultants never delivered.',
      },
    ],
    included: ['Accommodation', 'Meals', 'Local Transportation', 'Guides', 'Academic Sessions', 'Certificate'],
    notIncluded: ['International Flights', 'Visa', 'Travel Insurance', 'Personal Expenses', 'Gratuities'],
    ownerId: 'u_partner_1',
    status: 'Active',
    createdAt: '2026-05-28',
    applicationsCount: 5,
  },
  {
    id: 'j_ghana_afcfta',
    slug: 'ghana-afcfta-governance-practicum',
    title: 'Ghana AfCFTA Governance Practicum',
    roleFilter: 'PRACTITIONER',
    country: 'Ghana',
    countryFlag: '🇬🇭',
    cityRegion: 'Accra & Tema',
    coverImage: undefined,
    gallery: [],
    durationDays: 6,
    priceUSD: 5200,
    difficulty: 'Advanced',
    themes: ['Governance', 'Impact Investing', 'Sustainable Development'],
    audiences: ['DFIs', 'Investment Managers', 'Project Directors'],
    maxCapacity: 14,
    dates: [{ id: 'd1', startDate: '2026-11-16', endDate: '2026-11-21' }],
    description:
      'A six-day practicum at the AfCFTA headquarters city, Accra. Practitioners co-architect rules-of-origin-compliant, certified supplier structures — connecting Ghanaian manufacturers to continental trade through verifiable governance. Outputs are deployable enterprise-governance instruments.',
    objectives: [
      'Design AfCFTA rules-of-origin-compliant certified supplier structures.',
      'Connect verifiable governance to continental trade access.',
      'Co-architect a supplier-qualification (Audit Shield) framework.',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & AfCFTA Framing',
        description: 'Arrival in Accra, AfCFTA context briefing, welcome dinner.',
        accommodation: 'Accra business hotel (5★)',
        meals: { breakfast: false, lunch: false, dinner: true },
      },
      {
        day: 2,
        title: 'Trade & Compliance Landscape',
        description: 'Sessions on rules of origin and enterprise-governance requirements for trade.',
        accommodation: 'Accra business hotel (5★)',
        meals: { breakfast: true, lunch: true, dinner: false },
      },
      {
        day: 3,
        title: 'Tema Industrial Interface',
        description: 'Visits to Tema manufacturers; supplier-qualification design in practice.',
        accommodation: 'Accra business hotel (5★)',
        meals: { breakfast: true, lunch: true, dinner: true },
      },
      {
        day: 4,
        title: 'Audit Shield Co-Architecture',
        description: 'Co-draft a supplier-qualification Audit Shield framework with counsel.',
        accommodation: 'Accra business hotel (5★)',
        meals: { breakfast: true, lunch: true, dinner: true },
      },
      {
        day: 5,
        title: 'Certified Structure Design',
        description: 'Finalize certified supplier structures; investor-readiness review.',
        accommodation: 'Accra business hotel (5★)',
        meals: { breakfast: true, lunch: true, dinner: false },
      },
      {
        day: 6,
        title: 'Presentation & Departure',
        description: 'Present instruments to the joint committee; certificate; departure.',
        accommodation: '—',
        meals: { breakfast: true, lunch: false, dinner: false },
      },
    ],
    facilitators: [
      {
        id: 'f1',
        name: 'Akosua Mensah',
        title: 'Public Financial Management Specialist (Ghana)',
        bio: 'World Bank governance specialist; connects Ghanaian manufacturers to AfCFTA-ready governance standards.',
        yearsExperience: 14,
      },
    ],
    faq: [
      {
        question: 'Is this suitable for first-time practitioners?',
        answer: 'It is Advanced level; prior institutional or investment experience is expected.',
      },
      {
        question: 'What do participants leave with?',
        answer: 'Deployable, counsel-reviewed supplier-qualification instruments and a certificate.',
      },
    ],
    testimonials: [
      {
        name: 'Partner',
        organization: 'DFI',
        quote: 'Rules-of-origin compliance finally became an enterprise-governance asset, not a paperwork burden.',
      },
    ],
    included: ['Accommodation', 'Meals', 'Local Transportation', 'Guides', 'Academic Sessions', 'Certificate'],
    notIncluded: ['International Flights', 'Visa', 'Travel Insurance', 'Personal Expenses'],
    ownerId: 'u_partner_1',
    status: 'Active',
    createdAt: '2026-06-11',
    applicationsCount: 4,
  },
];

// ── Applications & feedback mock (for dashboards) ────────
export const MOCK_APPLICATIONS: JourneyApplication[] = [
  { id: 'a1', journeyId: 'j_kenya_ethical', journeyTitle: 'Ethical Leadership Safari in Kenya', applicantName: 'Fatou Ndiaye', appliedAt: '2026-07-01', status: 'Pending' },
  { id: 'a2', journeyId: 'j_kenya_ethical', journeyTitle: 'Ethical Leadership Safari in Kenya', applicantName: 'John Mwangi', appliedAt: '2026-06-28', status: 'Accepted' },
  { id: 'a3', journeyId: 'j_senegal_esg', journeyTitle: 'Senegal ESG & Governance Immersion', applicantName: 'Amina Osei', appliedAt: '2026-06-25', status: 'Pending' },
  { id: 'a4', journeyId: 'j_rwanda_coarchitect', journeyTitle: 'Rwanda Sovereign Capital Co-Architecture', applicantName: 'Charles Mutua', appliedAt: '2026-06-20', status: 'Waitlisted' },
];

/** The current explorer's own applications (for the Explorer dashboard). */
export const MOCK_MY_APPLICATIONS: JourneyApplication[] = [
  { id: 'm1', journeyId: 'j_kenya_ethical', journeyTitle: 'Ethical Leadership Safari in Kenya', applicantName: 'Daniel Osei', appliedAt: '2026-06-30', status: 'Accepted' },
  { id: 'm2', journeyId: 'j_senegal_esg', journeyTitle: 'Senegal ESG & Governance Immersion', applicantName: 'Daniel Osei', appliedAt: '2026-06-18', status: 'Pending' },
  { id: 'm3', journeyId: 'j_ghana_afcfta', journeyTitle: 'Ghana AfCFTA Governance Practicum', applicantName: 'Daniel Osei', appliedAt: '2026-05-30', status: 'Completed' },
];

export function getJourneyBySlug(slug: string): Journey | undefined {
  return JOURNEYS.find((j) => j.slug === slug);
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}
