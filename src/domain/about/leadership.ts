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
    bioEn: 'A premier Pan-African humanitarian and philanthropist, Aisha Babangida established APA’s founding mandate: to structurally empower women and to radically decolonize the development approach across Africa. Leveraging the territorial infrastructure and networks of her flagship initiatives — the Women Enterprise Alliance (WenA) and the Better Life Program for the African Rural Woman — she steers APA’s strategy toward the integration of endogenous knowledge systems and women’s access to productive resources. Her work cements the foundation of accountability by transforming local communities into co-creators and legal co-owners of systemic change.',
    bioFr: 'Humanitaire et philanthrope panafricaine de premier plan, Aisha Babangida a établi le mandat fondateur d’APA : autonomiser structurellement les femmes et décoloniser radicalement l’approche du développement en Afrique. S’appuyant sur l’infrastructure territoriale et les réseaux de ses initiatives phares — la Women Enterprise Alliance (WenA) et le Better Life Program for the African Rural Woman — elle oriente la stratégie d’APA vers l’intégration des systèmes de savoirs endogènes et l’accès des femmes aux ressources productives. Son travail scelle le socle de la redevabilité en transformant les communautés locales en co-créatrices et co-propriétaires légales du changement systémique.',
    visionEn: 'An Africa where women are the growth nodes of value chains — not its beneficiaries.',
    visionFr: 'Une Afrique où les femmes sont les nœuds de croissance des chaînes de valeur — non ses bénéficiaires.',
    messageEn: '“We do not ask for a seat at the table. We rebuild the table so accountability is structural.”',
    messageFr: '« Nous ne demandons pas une place à la table. Nous reconstruisons la table pour que la redevabilité soit structurelle. »',
    expertise: ['Women’s Empowerment', 'Decolonisation', 'Co-Governance'],
  },
  {
    slug: 'pape-samb',
    photo: '/founders/pape-samb.jpg',
    name: 'Pape Samb',
    roleEn: 'Co-Founder · Chief Executive Officer · Lead Architect of the APA Framework',
    roleFr: 'Co-Fondateur · Directeur Général · Architecte Principal du Cadre APA',
    bioEn: 'An international strategic leader and systemic investment expert, Pape Samb is the designer and lead architect of APA’s methodology and proprietary governance framework. As Chief Executive Officer, he transforms APA’s Pan-African vision into contractual, technological and measurable governance systems. He is the architect of APA’s flagship innovations, including the Community Verification Portal (CVP) and the 10-Year Systems Change Dashboard. His mission is to eliminate the financial leakage coefficient (Sigma), strengthen institutional accountability and demonstrate to governments, DFIs and MDBs that governance excellence generates measurable value, reduced risk and long-term bankable returns.',
    bioFr: 'Leader stratégique international et expert en investissement systémique, Pape Samb est le concepteur et l’architecte principal de la méthodologie et du cadre de gouvernance propriétaire d’APA. En tant que Directeur Général, il transforme la vision panafricaine d’APA en systèmes de gouvernance contractuels, technologiques et mesurables. Il est l’architecte des innovations phares d’APA, dont le Portail de Vérification Communautaire (CVP) et le Tableau de Bord du Changement Systémique sur 10 ans. Sa mission : éliminer le coefficient de fuite financière (Sigma), renforcer la redevabilité institutionnelle et démontrer aux gouvernements, DFI et BMD que l’excellence de la gouvernance génère une valeur mesurable, un risque réduit et des rendements bancables à long terme.',
    visionEn: 'Trust, made measurable — so African enterprise accesses global capital at fair rates.',
    visionFr: 'La confiance, rendue mesurable — pour que l’entreprise africaine accède au capital mondial à des taux justes.',
    messageEn: '“Accountability is not a compliance cost. It is an economic alpha generator.”',
    messageFr: '« La redevabilité n’est pas un coût de conformité. C’est un générateur d’alpha économique. »',
    expertise: ['Governance (GRC)', 'Systemic Methodology', 'Sigma Suppression', 'DFI & MDB Relations'],
    email: 'pape@theapaafrica.org',
  },
];

/**
 * APA Champions Network — SIMULATED showcase profiles for the About page.
 * Placeholder data (no real individuals) spread across regions to illustrate
 * continental reach; replace with real champions when available.
 */
export interface ShowcaseChampion {
  name: string;
  flag: string;
  country: string;
  region: string;
  roleEn: string; roleFr: string;
  organization: string;
  bioEn: string; bioFr: string;
  expertiseEn: string; expertiseFr: string;
}

export const CHAMPIONS_SHOWCASE: ShowcaseChampion[] = [
  {
    name: 'Ousmane Diallo', flag: '🇸🇳', country: 'Senegal', region: 'West Africa',
    roleEn: 'National Champion — Continental Hub', roleFr: 'Champion National — Hub Continental',
    organization: 'ex-UEMOA Compliance',
    bioEn: 'Former UEMOA compliance director; anchors APA’s continental HQ and OHADA/ECOWAS alignment across Francophone West Africa.',
    bioFr: 'Ancien directeur conformité UEMOA ; ancre le QG continental d’APA et l’alignement OHADA/CEDEAO en Afrique de l’Ouest francophone.',
    expertiseEn: 'Regulatory compliance · OHADA · cross-border governance',
    expertiseFr: 'Conformité réglementaire · OHADA · gouvernance transfrontalière',
  },
  {
    name: 'Wanjiku Kamau', flag: '🇰🇪', country: 'Kenya', region: 'East Africa',
    roleEn: 'National Champion', roleFr: 'Championne Nationale',
    organization: 'Governance advisory',
    bioEn: 'Public-sector reform and digital-governance specialist; drives verifiable accountability across East African institutions.',
    bioFr: 'Spécialiste réforme du secteur public et gouvernance numérique ; porte la redevabilité vérifiable dans les institutions est-africaines.',
    expertiseEn: 'Public-sector reform · digital governance',
    expertiseFr: 'Réforme du secteur public · gouvernance numérique',
  },
  {
    name: 'Ngo’o Manga', flag: '🇨🇲', country: 'Cameroon', region: 'Central Africa',
    roleEn: 'National Champion — Bilingual Bridge', roleFr: 'Champion National — Pont Bilingue',
    organization: 'CEMAC compliance',
    bioEn: 'CEMAC compliance lead and bilingual GRC specialist connecting Francophone and Anglophone Central Africa.',
    bioFr: 'Responsable conformité CEMAC et spécialiste GRC bilingue reliant l’Afrique centrale francophone et anglophone.',
    expertiseEn: 'CEMAC · bilingual GRC · extractives',
    expertiseFr: 'CEMAC · GRC bilingue · industries extractives',
  },
  {
    name: 'Houda El Filali', flag: '🇲🇦', country: 'Morocco', region: 'North Africa',
    roleEn: 'National Champion', roleFr: 'Championne Nationale',
    organization: 'Financial governance (AMMC)',
    bioEn: 'Financial-market governance expert bridging North African capital markets with DFI accountability standards.',
    bioFr: 'Experte en gouvernance des marchés financiers, reliant les marchés de capitaux nord-africains aux standards de redevabilité des DFI.',
    expertiseEn: 'Financial-market governance · capital markets',
    expertiseFr: 'Gouvernance des marchés financiers · marchés de capitaux',
  },
  {
    name: 'Claire Uwimana', flag: '🇷🇼', country: 'Rwanda', region: 'East Africa',
    roleEn: 'National Champion', roleFr: 'Championne Nationale',
    organization: 'Investment (RDB)',
    bioEn: 'Economic-transformation champion translating institutional trust into investment readiness and bankable pipelines.',
    bioFr: 'Championne de la transformation économique, traduisant la confiance institutionnelle en préparation à l’investissement et pipelines bancables.',
    expertiseEn: 'Investment climate · economic transformation',
    expertiseFr: 'Climat d’investissement · transformation économique',
  },
  {
    name: 'Lindiwe Nkosi', flag: '🇿🇦', country: 'South Africa', region: 'Southern Africa',
    roleEn: 'National Champion', roleFr: 'Championne Nationale',
    organization: 'Corporate governance',
    bioEn: 'Corporate-governance and ESG specialist advancing APA certification among Southern African enterprises and supply chains.',
    bioFr: 'Spécialiste gouvernance d’entreprise et ESG, faisant progresser la certification APA parmi les entreprises et chaînes d’appro d’Afrique australe.',
    expertiseEn: 'Corporate governance · ESG · supply chains',
    expertiseFr: 'Gouvernance d’entreprise · ESG · chaînes d’approvisionnement',
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
