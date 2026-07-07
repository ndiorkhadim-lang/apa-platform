import type { ToolCategory } from '@/generated/prisma/client';

/**
 * The APA ecosystem graph — single source of truth for how the 63 tools
 * connect to Solutions, Governance Frameworks (the 6 pillars), Journeys
 * and the Certification pathway. Grounded in the Master Memoire (§III
 * solution architecture, §IV tool suite, §VI certification engine).
 *
 * Navigation philosophy: Business Challenge → Solution → Framework →
 * Tool → Assessment → Certification. Nobody starts from a tool list.
 */

/** Target-audience tags — the /solutions filter axis (from the corpus). */
export type Audience =
  | 'ENTERPRISE'
  | 'INVESTOR'
  | 'GOVERNMENT'
  | 'FOUNDATION'
  | 'SME'
  | 'DIASPORA';

export const AUDIENCE_LABEL: Record<Audience, { en: string; fr: string }> = {
  ENTERPRISE: { en: 'Enterprise', fr: 'Entreprise' },
  INVESTOR: { en: 'Investor / DFI', fr: 'Investisseur / DFI' },
  GOVERNMENT: { en: 'Government', fr: 'Gouvernement' },
  FOUNDATION: { en: 'Foundation', fr: 'Fondation' },
  SME: { en: 'SME / Cooperative', fr: 'PME / Coopérative' },
  DIASPORA: { en: 'Diaspora', fr: 'Diaspora' },
};

export interface SolutionDef {
  id: string; // s1..s6
  code: string; // 01..06 (display)
  nameEn: string; nameFr: string;
  audiences: Audience[]; // explicit target audiences
  challengeEn: string; challengeFr: string; // the business challenge it answers
  purposeEn: string; purposeFr: string;
  contextEn: string; contextFr: string; // strategic context
  outcomesEn: string; outcomesFr: string; // expected outcomes
  valueEn: string; valueFr: string; // governance value
  pillars: string[]; // governance frameworks (pillar codes)
  journeySlug: string; // transformation journey anchor on /journeys
  certificationEn: string; certificationFr: string;
}

export const SOLUTIONS: SolutionDef[] = [
  {
    id: 's1', code: '01',
    nameEn: 'Executive Transition & Strategic Paradigm', nameFr: 'Transition exécutive & paradigme stratégique',
    challengeEn: '“Is our leadership genuinely committed — or is CSR still a cost centre?”',
    challengeFr: '« Notre direction est-elle réellement engagée — ou la RSE reste-t-elle un centre de coût ? »',
    audiences: ['ENTERPRISE', 'FOUNDATION', 'GOVERNMENT'],
    purposeEn: 'Audit and align executive commitment before any capital or certification move.',
    purposeFr: 'Auditer et aligner l’engagement de la direction avant tout mouvement de capital ou de certification.',
    contextEn: 'The 70% project-failure rate starts at the top: undocumented paradigms drift.',
    contextFr: 'Les 70 % d’échecs projets commencent au sommet : un paradigme non documenté dérive.',
    outcomesEn: 'C-SPA alignment score (gate ≥70), documented paradigm choice, 90-day trust agenda.',
    outcomesFr: 'Score d’alignement C-SPA (seuil ≥70), choix de paradigme documenté, agenda de confiance 90 jours.',
    valueEn: 'Converts declared ethics into a scored, auditable executive commitment.',
    valueFr: 'Convertit l’éthique déclarée en engagement exécutif noté et auditable.',
    pillars: ['I', 'V'],
    journeySlug: 'multinationals-esg',
    certificationEn: 'Step 1 of the pathway — the C-SPA diagnostic is the certification gate.',
    certificationFr: 'Étape 1 du parcours — le diagnostic C-SPA est la porte d’entrée de la certification.',
  },
  {
    id: 's2', code: '02',
    nameEn: 'Risk & Territory Intelligence', nameFr: 'Intelligence risque & territoire',
    challengeEn: '“What is the real trust deficit — and what does it cost us?”',
    challengeFr: '« Quel est le vrai déficit de confiance — et combien nous coûte-t-il ? »',
    audiences: ['ENTERPRISE', 'GOVERNMENT', 'INVESTOR'],
    purposeEn: 'Quantify grievances, leakage (σ) and institutional risk before deployment.',
    purposeFr: 'Quantifier griefs, fuite de valeur (σ) et risque institutionnel avant déploiement.',
    contextEn: 'Capital prices Africa on perception; verified territory data reprices it.',
    contextFr: 'Le capital price l’Afrique à la perception ; la donnée territoriale vérifiée la reprice.',
    outcomesEn: 'Trust Deficit Index, grievance catalog, σ-leakage baseline, resilience scores.',
    outcomesFr: 'Indice de Déficit de Confiance, catalogue des griefs, référence σ, scores de résilience.',
    valueEn: 'Turns diffuse country risk into measurable, mitigable line items.',
    valueFr: 'Transforme un risque-pays diffus en postes mesurables et atténuables.',
    pillars: ['I', 'IV', 'VI'],
    journeySlug: 'government-agencies',
    certificationEn: 'Feeds Step 2 — the Trust Audit builds directly on these baselines.',
    certificationFr: 'Alimente l’étape 2 — le Trust Audit s’appuie directement sur ces références.',
  },
  {
    id: 's3', code: '03',
    nameEn: 'Decolonized Impact Measurement (MAE)', nameFr: 'Mesure d’impact décolonisée (MAE)',
    challengeEn: '“Our KPIs satisfy donors — but do they measure anything real here?”',
    challengeFr: '« Nos KPI satisfont les bailleurs — mais mesurent-ils quelque chose de réel ici ? »',
    audiences: ['FOUNDATION', 'GOVERNMENT', 'ENTERPRISE'],
    purposeEn: 'Replace imported metrics with dignity, agency and cohesion outcomes.',
    purposeFr: 'Remplacer les métriques importées par des résultats de dignité, d’agence et de cohésion.',
    contextEn: 'Ubuntu-grounded measurement is the corpus’ answer to metric colonialism.',
    contextFr: 'La mesure ancrée dans Ubuntu est la réponse du corpus au colonialisme métrique.',
    outcomesEn: 'MAE scores, grievance-trend proof of systemic correction, narrative sovereignty.',
    outcomesFr: 'Scores MAE, preuve de correction systémique par tendance des griefs, souveraineté narrative.',
    valueEn: 'Impact that local reality recognizes and global capital can still audit.',
    valueFr: 'Un impact que la réalité locale reconnaît et que le capital mondial peut auditer.',
    pillars: ['IV', 'VI'],
    journeySlug: 'foundations-grantmakers',
    certificationEn: 'MAE evidence is mandatory in the Digital Portfolio (tool #52).',
    certificationFr: 'Les preuves MAE sont obligatoires dans le Portfolio Numérique (outil #52).',
  },
  {
    id: 's4', code: '04',
    nameEn: 'Institutional Capital Gateway', nameFr: 'Passerelle de capital institutionnel',
    challengeEn: '“How do we satisfy DFI diligence and unlock cheaper capital?”',
    challengeFr: '« Comment satisfaire la diligence DFI et débloquer un capital moins cher ? »',
    audiences: ['INVESTOR', 'ENTERPRISE', 'GOVERNMENT'],
    purposeEn: 'Package verified governance into the Authenticity Premium™ investors price.',
    purposeFr: 'Emballer la gouvernance vérifiée dans la Prime d’Authenticité™ que les investisseurs pricent.',
    contextEn: '$80B+/yr of FDI is lost to unverifiable governance — not to real risk.',
    contextFr: '80 Md$+/an d’IDE sont perdus faute de gouvernance vérifiable — pas de risque réel.',
    outcomesEn: 'PQI score, Credibility Score, IFC-PS1-mappable evidence, 10-yr dashboard.',
    outcomesFr: 'Score PQI, Score de Crédibilité, preuves mappables IFC PS1, dashboard 10 ans.',
    valueEn: '300–500 bps of cost-of-capital compression, made bankable.',
    valueFr: '300–500 pb de compression du coût du capital, rendus bancables.',
    pillars: ['II', 'IV'],
    journeySlug: 'investors-dfis',
    certificationEn: 'The certificate + /verify registry are the gateway’s deliverables.',
    certificationFr: 'Le certificat + le registre /verify sont les livrables de la passerelle.',
  },
  {
    id: 's5', code: '05',
    nameEn: 'SME Integrity Pipeline', nameFr: 'Pipeline d’intégrité PME',
    challengeEn: '“How does a Dakar cooperative become supply-chain- and capital-ready?”',
    challengeFr: '« Comment une coopérative de Dakar devient-elle prête pour les chaînes d’appro et le capital ? »',
    audiences: ['SME', 'ENTERPRISE', 'FOUNDATION'],
    purposeEn: 'Bootcamp → Pipeline → Sprint → M&E: certification as a digital passport.',
    purposeFr: 'Bootcamp → Pipeline → Sprint → S&E : la certification comme passeport numérique.',
    contextEn: 'CSDDD/AGOA buyers need certified African suppliers at scale.',
    contextFr: 'Les acheteurs CSDDD/AGOA ont besoin de fournisseurs africains certifiés à l’échelle.',
    outcomesEn: 'Certified SMEs, local-sourcing compliance, AI-governance readiness.',
    outcomesFr: 'PME certifiées, conformité sourcing local, préparation gouvernance IA.',
    valueEn: 'Converts grant recipients into institutional-grade counterparties.',
    valueFr: 'Convertit des bénéficiaires de subventions en contreparties de niveau institutionnel.',
    pillars: ['III', 'V', 'VI'],
    journeySlug: 'multinationals-esg',
    certificationEn: 'The dedicated SME certification track of the 5-step pathway.',
    certificationFr: 'La voie PME dédiée du parcours de certification en 5 étapes.',
  },
  {
    id: 's6', code: '06',
    nameEn: 'Sovereign Partnership Architecture', nameFr: 'Architecture de partenariat souverain',
    challengeEn: '“How do we contract power-sharing so it survives goodwill?”',
    challengeFr: '« Comment contractualiser le partage du pouvoir pour qu’il survive à la bonne volonté ? »',
    audiences: ['ENTERPRISE', 'DIASPORA', 'GOVERNMENT'],
    purposeEn: 'Bind veto rights, co-ownership, parity and exit into enforceable instruments.',
    purposeFr: 'Rendre veto, co-propriété, parité et sortie juridiquement exécutoires.',
    contextEn: 'The 15 contractual mandates are the framework’s enforcement spine.',
    contextFr: 'Les 15 mandats contractuels sont la colonne d’application du cadre.',
    outcomesEn: 'Signed Kinship Equity, CVP live, sunset clause with fixed timeline.',
    outcomesFr: 'Kinship Equity signé, CVP actif, clause sunset à échéance fixe.',
    valueEn: 'Accountability that no leadership change can quietly undo.',
    valueFr: 'Une redevabilité qu’aucun changement de direction ne peut défaire en silence.',
    pillars: ['II', 'III'],
    journeySlug: 'diaspora',
    certificationEn: 'Steps 3–4 of the pathway (KEA execution, CVP activation).',
    certificationFr: 'Étapes 3–4 du parcours (exécution KEA, activation CVP).',
  },
];

/** Every tool belongs to exactly one primary solution (curated from the corpus). */
export const TOOL_SOLUTION: Record<number, string> = {
  1: 's1', 3: 's1', 4: 's1', 7: 's1', 9: 's1', 37: 's1', 38: 's1', 49: 's1',
  2: 's2', 5: 's2', 17: 's2', 34: 's2', 58: 's2', 60: 's2', 63: 's2',
  6: 's3', 8: 's3', 10: 's3', 29: 's3', 32: 's3', 33: 's3', 35: 's3', 40: 's3', 54: 's3', 55: 's3', 59: 's3', 61: 's3',
  14: 's4', 15: 's4', 16: 's4', 28: 's4', 30: 's4', 31: 's4', 39: 's4', 44: 's4', 45: 's4', 47: 's4', 48: 's4', 50: 's4',
  11: 's5', 13: 's5', 19: 's5', 24: 's5', 26: 's5', 36: 's5', 42: 's5', 43: 's5', 46: 's5', 51: 's5', 52: 's5', 53: 's5', 56: 's5', 62: 's5',
  12: 's6', 18: 's6', 20: 's6', 21: 's6', 22: 's6', 23: 's6', 25: 's6', 27: 's6', 41: 's6', 57: 's6',
};

/** Journey overrides at tool level (default = the solution's journey). */
export const TOOL_JOURNEY_OVERRIDE: Record<number, string> = {
  41: 'celebrities-ambassadors',
};

/** Tools surfaced by the C-SPA recommendation engine → AI badge. */
export const AI_RECOMMENDED = new Set([3, 7, 9, 18, 22, 12, 21, 27, 52, 29, 10, 25, 24, 5, 53, 20, 57, 28]);

/** Complexity & duration derive from the official category — one rule, 63 tools. */
export const CATEGORY_META: Record<
  ToolCategory,
  { complexityEn: string; complexityFr: string; timeEn: string; timeFr: string; certEn: string; certFr: string }
> = {
  FORM: {
    complexityEn: 'Moderate', complexityFr: 'Modérée',
    timeEn: '45–90 min', timeFr: '45–90 min',
    certEn: 'Certification evidence', certFr: 'Preuve de certification',
  },
  GUIDE: {
    complexityEn: 'Advanced', complexityFr: 'Avancée',
    timeEn: '2–4 h (team)', timeFr: '2–4 h (équipe)',
    certEn: 'Journey preparation', certFr: 'Préparation du parcours',
  },
  LEGAL: {
    complexityEn: 'Advanced — counsel review', complexityFr: 'Avancée — revue juridique',
    timeEn: '1–2 weeks incl. signature', timeFr: '1–2 sem. signature incluse',
    certEn: 'Certification evidence (binding)', certFr: 'Preuve de certification (contraignante)',
  },
  METRIC: {
    complexityEn: 'Moderate', complexityFr: 'Modérée',
    timeEn: '30–60 min + tracking', timeFr: '30–60 min + suivi',
    certEn: 'Longitudinal tracking', certFr: 'Suivi longitudinal',
  },
};

export function solutionOf(toolNumber: number): SolutionDef {
  const id = TOOL_SOLUTION[toolNumber] ?? 's1';
  return SOLUTIONS.find((s) => s.id === id)!;
}

export function journeyOf(toolNumber: number): string {
  return TOOL_JOURNEY_OVERRIDE[toolNumber] ?? solutionOf(toolNumber).journeySlug;
}

/**
 * Where "Launch Tool" lands. Tool #3 IS the C-SPA — it opens the dedicated
 * diagnostic engine; every other tool opens its secure workspace directly.
 */
export function launchPath(toolNumber: number, slug: string): string {
  return toolNumber === 3 ? '/app/cspa' : `/app/tools/${slug}`;
}

/** AI Concierge rules: challenge id → recommendation. */
export const CONCIERGE_RULES: {
  id: string;
  labelEn: string; labelFr: string;
  solutionId: string;
  toolNumber: number; // best entry tool
}[] = [
  { id: 'commitment', labelEn: 'Prove leadership commitment', labelFr: 'Prouver l’engagement de la direction', solutionId: 's1', toolNumber: 3 },
  { id: 'risk', labelEn: 'Quantify trust & territory risk', labelFr: 'Quantifier le risque confiance & territoire', solutionId: 's2', toolNumber: 2 },
  { id: 'impact', labelEn: 'Measure impact credibly', labelFr: 'Mesurer l’impact avec crédibilité', solutionId: 's3', toolNumber: 29 },
  { id: 'capital', labelEn: 'Unlock institutional capital', labelFr: 'Débloquer du capital institutionnel', solutionId: 's4', toolNumber: 31 },
  { id: 'sme', labelEn: 'Certify an SME / supply chain', labelFr: 'Certifier une PME / chaîne d’appro', solutionId: 's5', toolNumber: 52 },
  { id: 'contracts', labelEn: 'Contract real power-sharing', labelFr: 'Contractualiser le partage du pouvoir', solutionId: 's6', toolNumber: 18 },
];
