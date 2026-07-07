/**
 * Institutional leadership data — Founders, Advisory Board, global hubs and
 * the Champion career pathway. Grounded in the Master Memoire (§II leadership,
 * §III mandate/values, §V champions & 5 capital hubs).
 *
 * Photos are provided later: `photo` holds a path when available, else the
 * card renders an initials avatar — no redesign needed to swap them in.
 */

export interface Founder {
  slug: string;
  photo?: string;
  name: string;
  roleEn: string; roleFr: string;
  bioEn: string; bioFr: string;
  visionEn: string; visionFr: string;
  messageEn: string; messageFr: string;
  expertise: string[];
  linkedin?: string;
  email?: string;
}

export const FOUNDERS: Founder[] = [
  {
    slug: 'aisha-babangida',
    photo: '/founders/aisha-babangida.jpg',
    name: 'Aisha Babangida',
    roleEn: 'Founder · Visionary President',
    roleFr: 'Fondatrice · Présidente Visionnaire',
    bioEn: 'A leading pan-African humanitarian and philanthropist, she conceived APA’s founding mandate: to structurally empower women and radically decolonize development across Africa. She built the Women Enterprise Alliance (WenA) and the Better Life Program for the African Rural Woman.',
    bioFr: 'Humanitaire et philanthrope panafricaine de premier plan, elle a conçu le mandat fondateur d’APA : autonomiser structurellement les femmes et décoloniser radicalement le développement en Afrique. Elle a bâti la Women Enterprise Alliance (WenA) et le Better Life Program for the African Rural Woman.',
    visionEn: 'An Africa where women are the growth nodes of value chains — not its beneficiaries.',
    visionFr: 'Une Afrique où les femmes sont les nœuds de croissance des chaînes de valeur — non ses bénéficiaires.',
    messageEn: '“We do not ask for a seat at the table. We rebuild the table so accountability is structural.”',
    messageFr: '« Nous ne demandons pas une place à la table. Nous reconstruisons la table pour que la redevabilité soit structurelle. »',
    expertise: ['Women’s economic empowerment', 'Decolonization', 'Co-governance', 'Endogenous knowledge systems'],
  },
  {
    slug: 'pape-samb',
    photo: '/founders/pape-samb.jpg',
    name: 'Pape Samb',
    roleEn: 'Co-Founder · CEO · Principal Architect — GRC Strategist',
    roleFr: 'Co-Fondateur · CEO · Architecte Principal — Stratège GRC',
    bioEn: 'An international strategic leader and systemic-investment expert, he is the designer and principal architect of the APA methodology and its 63-tool GRC suite. As CEO he designed the Authenticity Premium™, Trust Tax™ and Sigma-Suppression™ frameworks, and architected the CVP and the 10-Year Change Dashboard. 15+ years in governance, risk & compliance across Francophone Africa.',
    bioFr: 'Leader stratégique international et expert en investissement systémique, il est le concepteur et l’architecte principal de la méthodologie APA et de sa suite de 63 outils GRC. En tant que CEO, il a conçu les cadres Prime d’Authenticité™, Taxe de Confiance™ et Suppression-Sigma™, et architecturé le CVP et le Tableau de Bord du Changement sur 10 ans. 15+ ans en gouvernance, risque & conformité à travers l’Afrique francophone.',
    visionEn: 'Trust, made measurable — so African enterprise accesses global capital at fair rates.',
    visionFr: 'La confiance, rendue mesurable — pour que l’entreprise africaine accède au capital mondial à des taux justes.',
    messageEn: '“Accountability is not a compliance cost. It is an economic alpha generator.”',
    messageFr: '« La redevabilité n’est pas un coût de conformité. C’est un générateur d’alpha économique. »',
    expertise: ['GRC methodology', 'Authenticity Premium™', 'Systemic investment', 'Certification architecture'],
    email: 'pape@theapaafrica.org',
  },
];

export interface Advisor {
  name: string;
  flag: string;
  country: string;
  titleEn: string; titleFr: string;
  organization: string;
  region: string;
  expertiseEn: string; expertiseFr: string;
  photo?: string;
  linkedin?: string;
}

export const ADVISORS: Advisor[] = [
  { name: 'Prof. James Otieno', flag: '🇰🇪', country: 'Kenya', region: 'East Africa', organization: 'ex-World Bank', titleEn: 'Former Director, Africa Division', titleFr: 'Ancien Directeur, Division Afrique', expertiseEn: 'Governance & accountability, 30+ years', expertiseFr: 'Gouvernance & redevabilité, 30+ ans' },
  { name: 'Dr. Fatima Diallo', flag: '🇸🇳', country: 'Senegal', region: 'West Africa', organization: 'African Union', titleEn: 'Commissioner, Political Affairs', titleFr: 'Commissaire aux Affaires Politiques', expertiseEn: 'Democracy & accountability', expertiseFr: 'Démocratie & redevabilité' },
  { name: 'Mr. Emmanuel Nkrumah', flag: '🇬🇭', country: 'Ghana', region: 'West Africa', organization: 'IFC', titleEn: 'Regional Director, West Africa', titleFr: 'Directeur Régional, Afrique de l’Ouest', expertiseEn: 'FDI facilitation & institutional reform', expertiseFr: 'Facilitation IDE & réforme institutionnelle' },
  { name: 'Dr. Amina Osei', flag: '🇳🇬', country: 'Nigeria', region: 'West Africa', organization: 'ex-IMF', titleEn: 'Former Senior Economist', titleFr: 'Ancienne Économiste Senior', expertiseEn: 'Fiscal governance & transparency', expertiseFr: 'Gouvernance fiscale & transparence' },
  { name: 'Prof. Leila Mansouri', flag: '🇲🇦', country: 'Morocco', region: 'North Africa', organization: 'Harvard Kennedy School', titleEn: 'Faculty', titleFr: 'Enseignante-chercheuse', expertiseEn: 'Rule of law & MENA governance', expertiseFr: 'État de droit & gouvernance MENA' },
  { name: 'Mr. Charles Mutua', flag: '🇷🇼', country: 'Rwanda', region: 'East Africa', organization: 'McKinsey Africa', titleEn: 'Partner', titleFr: 'Partner', expertiseEn: 'Institutional reform & capacity building', expertiseFr: 'Réforme institutionnelle & renforcement des capacités' },
];

/** The 5 global capital hubs (Master Memoire §V). */
export const GLOBAL_HUBS = [
  { code: 'WASHINGTON', city: 'Washington, D.C.', flag: '🇺🇸' },
  { code: 'LONDON', city: 'London', flag: '🇬🇧' },
  { code: 'PARIS', city: 'Paris', flag: '🇫🇷' },
  { code: 'DUBAI', city: 'Dubai', flag: '🇦🇪' },
  { code: 'NEW_YORK', city: 'New York', flag: '🇺🇸' },
] as const;

/** Champion career pathway. */
export const CAREER_PATH = [
  { code: 'APPLICANT', en: 'Applicant', fr: 'Candidat' },
  { code: 'CHAMPION', en: 'APA Champion', fr: 'Champion APA' },
  { code: 'FACILITATOR', en: 'Facilitator', fr: 'Facilitateur' },
  { code: 'MASTER_TRAINER', en: 'Master Trainer', fr: 'Master Trainer' },
  { code: 'GLOBAL_AUDITOR', en: 'Global Auditor', fr: 'Auditeur Global' },
] as const;
