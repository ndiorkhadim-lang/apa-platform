// APA Journey Partner — chip/tag taxonomy for the unified application wizard.
// Kept framework-aligned (pillars, SDGs, APA journey themes/audiences).

export const ORG_TYPES = [
  'Government', 'NGO / Non-Profit', 'University / Academic', 'Private Company',
  'Development Bank / DFI', 'Foundation', 'Investor / Fund', 'Startup',
  'Cooperative', 'State-Owned Enterprise', 'Multilateral / IGO',
] as const;

export const JOURNEY_THEMES = [
  'Governance', 'ESG', 'Mining', 'Agriculture', 'Health', 'Education',
  'Energy', 'Tourism', 'Infrastructure', 'Innovation', 'AI',
  'Digital Transformation', 'Impact Investing', 'Ethical Leadership',
  'Community Development', 'Sustainable Development',
] as const;

export const JOURNEY_AUDIENCES = [
  'Executives', 'Ministers', 'Investors', 'DFIs', 'SMEs', 'Students',
  'ESG Officers', 'Project Directors', 'Investment Managers',
  'Development Practitioners', 'Foundation Leaders', 'Sovereign Funds',
] as const;

export const JOURNEY_LANGUAGES = [
  'English', 'French', 'Portuguese', 'Arabic', 'Swahili', 'Amharic', 'Hausa',
] as const;

export const TRAVEL_TYPES = [
  'Immersion', 'Executive Mission', 'Learning Expedition', 'Study Tour',
  'Certification Journey', 'Field Research', 'Community Initiative',
] as const;

export const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;

export const CERTIFICATION_ALIGNMENT = ['APA Certified', 'Under Review', 'Pilot Journey'] as const;

// APA six pillars (Framework Modules).
export const FRAMEWORK_MODULES = [
  { code: 'I', label: 'Pillar I — Ethical Foundation' },
  { code: 'II', label: 'Pillar II — Kinship Equity' },
  { code: 'III', label: 'Pillar III — Power-Sharing Governance' },
  { code: 'IV', label: 'Pillar IV — Decolonized Impact (MAE)' },
  { code: 'V', label: 'Pillar V — Community Verification (CVP)' },
  { code: 'VI', label: 'Pillar VI — Regenerative Value' },
] as const;

// UN Sustainable Development Goals.
export const SDGS = [
  'SDG 1 — No Poverty', 'SDG 2 — Zero Hunger', 'SDG 3 — Good Health',
  'SDG 4 — Quality Education', 'SDG 5 — Gender Equality', 'SDG 6 — Clean Water',
  'SDG 7 — Affordable Energy', 'SDG 8 — Decent Work & Growth', 'SDG 9 — Industry & Innovation',
  'SDG 10 — Reduced Inequalities', 'SDG 11 — Sustainable Cities', 'SDG 12 — Responsible Consumption',
  'SDG 13 — Climate Action', 'SDG 14 — Life Below Water', 'SDG 15 — Life on Land',
  'SDG 16 — Peace & Strong Institutions', 'SDG 17 — Partnerships',
] as const;

export const EXPECTED_OUTCOMES = [
  'Policy Reform', 'Investment Deals', 'Capacity Building', 'Certification',
  'Institutional Partnerships', 'Community Impact', 'Knowledge Transfer',
  'Governance Roadmap', 'ESG Alignment', 'MoU / Agreements', 'Research Output',
] as const;

export const APA_REGIONAL_HUBS = [
  'West Africa Hub', 'East Africa Hub', 'Central Africa Hub',
  'North Africa Hub', 'Southern Africa Hub',
] as const;

export const SECTOR_FOCUS = [
  'Governance & Public Sector', 'Mining & Extractives', 'Energy & Renewables',
  'Agriculture & Agri-food', 'Finance & Fintech', 'Health', 'Education',
  'Infrastructure & Construction', 'Manufacturing', 'Technology',
  'Tourism & Culture', 'Development Finance',
] as const;

export const DURATION_DAYS = [3, 5, 6, 7, 10, 14] as const;
