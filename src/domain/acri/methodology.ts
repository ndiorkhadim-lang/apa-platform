/**
 * ACRI — Africa Country Readiness Index.
 * Source of truth: APA Master Memoire §V (7-criteria weighted model,
 * Tier 1 ACRI 77–94 → Months 1–4 · Tier 2 ACRI 66–75 → Months 5–8).
 *
 * Every number rendered by the Executive Dashboard traces back to this
 * module + the acri_scores table. No visualization owns its own data.
 */

export const ACRI_VERSION = 'v1.0';
export const ACRI_MIN = 0;
export const ACRI_MAX = 100;

export interface CriterionDoc {
  id: number;
  weight: number; // fraction of 1
  nameEn: string;
  nameFr: string;
  measuresEn: string;
  measuresFr: string;
  definitionEn: string;
  definitionFr: string;
  purposeEn: string;
  purposeFr: string;
  dataSourcesEn: string;
  dataSourcesFr: string;
  interpretationEn: string;
  interpretationFr: string;
}

export const CRITERIA: CriterionDoc[] = [
  {
    id: 1, weight: 0.2,
    nameEn: 'Economic Scale & FDI Magnetism', nameFr: 'Échelle économique & attractivité IDE',
    measuresEn: 'GDP size · FDI volume · density of investable SMEs · growth · investment attractiveness',
    measuresFr: 'Taille du PIB · volume d’IDE · densité de PME investissables · croissance · attractivité',
    definitionEn: 'Size and dynamism of the addressable economy for certified enterprises.',
    definitionFr: 'Taille et dynamisme de l’économie adressable pour les entités certifiées.',
    purposeEn: 'Certification creates value fastest where capital already wants to flow.',
    purposeFr: 'La certification crée de la valeur plus vite là où le capital veut déjà affluer.',
    dataSourcesEn: 'World Bank WDI · UNCTAD FDI reports · national SME registries',
    dataSourcesFr: 'Banque Mondiale WDI · rapports IDE CNUCED · registres nationaux de PME',
    interpretationEn: '≥80: continental anchor market · 60–79: strong pipeline · <60: opportunistic entry only.',
    interpretationFr: '≥80 : marché d’ancrage continental · 60–79 : pipeline solide · <60 : entrée opportuniste.',
  },
  {
    id: 2, weight: 0.2,
    nameEn: 'Governance & Institutional Readiness', nameFr: 'Gouvernance & maturité institutionnelle',
    measuresEn: 'World Bank Governance Indicators · TI CPI · judicial independence · institutional capacity · stability',
    measuresFr: 'Indicateurs de gouvernance BM · IPC Transparency Int. · indépendance judiciaire · capacité institutionnelle · stabilité',
    definitionEn: 'Institutional substrate on which verifiable accountability can anchor.',
    definitionFr: 'Substrat institutionnel sur lequel la redevabilité vérifiable peut s’ancrer.',
    purposeEn: 'The Authenticity Premium™ compounds where institutions can co-sign it.',
    purposeFr: 'La Prime d’Authenticité™ se compose là où les institutions peuvent la co-signer.',
    dataSourcesEn: 'WB WGI · Transparency International CPI · Afrobarometer',
    dataSourcesFr: 'WGI Banque Mondiale · IPC Transparency International · Afrobaromètre',
    interpretationEn: '≥80: regulator-partner ready · 60–79: reform corridor · <60: firewall diagnostics first (Tool #17).',
    interpretationFr: '≥80 : régulateur-partenaire · 60–79 : corridor de réforme · <60 : diagnostics pare-feu d’abord (outil #17).',
  },
  {
    id: 3, weight: 0.15,
    nameEn: 'AfCFTA Integration & Trade Activity', nameFr: 'Intégration ZLECAf & activité commerciale',
    measuresEn: 'AfCFTA ratification depth · intra-African trade flows · corridors · cross-border activity',
    measuresFr: 'Profondeur de ratification ZLECAf · flux commerciaux intra-africains · corridors · activité transfrontalière',
    definitionEn: 'Exposure to continental trade where certification is a passport.',
    definitionFr: 'Exposition au commerce continental où la certification est un passeport.',
    purposeEn: 'Rules-of-origin compliance makes APA certification commercially mandatory.',
    purposeFr: 'La conformité règles d’origine rend la certification APA commercialement incontournable.',
    dataSourcesEn: 'AfCFTA Secretariat · UNECA · trade ministries',
    dataSourcesFr: 'Secrétariat ZLECAf · CEA-ONU · ministères du commerce',
    interpretationEn: 'High scores mark corridor economies where one certification unlocks multiple markets.',
    interpretationFr: 'Un score élevé signale une économie-corridor où une certification ouvre plusieurs marchés.',
  },
  {
    id: 4, weight: 0.15,
    nameEn: 'Digital Infrastructure & AI Adoption', nameFr: 'Infrastructure numérique & adoption IA',
    measuresEn: 'Mobile-internet penetration · digital government · fintech density · AI readiness',
    measuresFr: 'Pénétration internet mobile · e-gouvernement · densité fintech · préparation IA',
    definitionEn: 'Capacity to run digital-first certification and live dashboards.',
    definitionFr: 'Capacité à opérer une certification digital-first et des tableaux de bord live.',
    purposeEn: 'The One-Person AI Engine scales only where rails are digital.',
    purposeFr: 'Le One-Person AI Engine ne passe à l’échelle que sur des rails numériques.',
    dataSourcesEn: 'GSMA · ITU · Oxford Government AI Readiness',
    dataSourcesFr: 'GSMA · UIT · Oxford Government AI Readiness',
    interpretationEn: '≥80 enables full digital deployment; below, hybrid facilitation via champions.',
    interpretationFr: '≥80 : déploiement 100 % digital ; en deçà, facilitation hybride via les champions.',
  },
  {
    id: 5, weight: 0.15,
    nameEn: 'Diaspora Capital & Network Density', nameFr: 'Capital diaspora & densité de réseaux',
    measuresEn: 'Diaspora size · remittance volume · organised investment & professional networks',
    measuresFr: 'Taille de la diaspora · volume de transferts · réseaux d’investissement & professionnels organisés',
    definitionEn: 'Strength of the diaspora demand-side for accountable investment.',
    definitionFr: 'Force de la demande diaspora pour l’investissement redevable.',
    purposeEn: 'Diaspora Sovereign Capital Pathway converts remittances into governed equity.',
    purposeFr: 'La Voie de Capital Souverain Diaspora convertit les transferts en capital gouverné.',
    dataSourcesEn: 'World Bank remittances · IOM · diaspora bond issuances',
    dataSourcesFr: 'Transferts Banque Mondiale · OIM · émissions d’obligations diaspora',
    interpretationEn: 'High density = ready-made certified-deal distribution channel.',
    interpretationFr: 'Forte densité = canal de distribution tout prêt pour les deals certifiés.',
  },
  {
    id: 6, weight: 0.1,
    nameEn: 'Sector-Specific Certification Opportunity', nameFr: 'Opportunité de certification sectorielle',
    measuresEn: 'Accountability-sensitive sectors: cocoa, minerals, agriculture, AGOA apparel · certification demand',
    measuresFr: 'Secteurs sensibles à la redevabilité : cacao, minerais, agriculture, textile AGOA · demande de certification',
    definitionEn: 'Concentration of export sectors already under buyer accountability pressure.',
    definitionFr: 'Concentration de secteurs export déjà sous pression de redevabilité acheteur.',
    purposeEn: 'CSDDD/AGOA-driven demand converts sectors into certification pipelines.',
    purposeFr: 'La demande CSDDD/AGOA convertit ces secteurs en pipelines de certification.',
    dataSourcesEn: 'ITC trade map · AGOA reports · commodity bodies',
    dataSourcesFr: 'ITC trade map · rapports AGOA · organismes de filières',
    interpretationEn: 'Targets the first 100 certified enterprises by sector concentration.',
    interpretationFr: 'Cible les 100 premières entités certifiées par concentration sectorielle.',
  },
  {
    id: 7, weight: 0.05,
    nameEn: 'Regional Hub & Spillover Potential', nameFr: 'Potentiel de hub régional & d’entraînement',
    measuresEn: 'Regional influence · logistics · economic spillover · cross-border expansion capacity',
    measuresFr: 'Influence régionale · logistique · effet d’entraînement · capacité d’expansion transfrontalière',
    definitionEn: 'Capacity to drive APA adoption in neighbouring nations.',
    definitionFr: 'Capacité à entraîner l’adoption d’APA dans les nations voisines.',
    purposeEn: 'One hub activation seeds an entire region (HQ effects: Dakar, Accra, Nairobi…).',
    purposeFr: 'Un hub activé ensemence toute une région (effets QG : Dakar, Accra, Nairobi…).',
    dataSourcesEn: 'Regional bodies (ECOWAS, EAC, SADC, COMESA) · logistics indices',
    dataSourcesFr: 'Organisations régionales (CEDEAO, EAC, SADC, COMESA) · indices logistiques',
    interpretationEn: 'Tie-breaker between similar composites: hubs first.',
    interpretationFr: 'Départage des composites proches : les hubs d’abord.',
  },
];

// ── Classification (Master Memoire §V) ──────────────────
export type AcriTier = 'TIER1' | 'TIER2' | 'WATCHLIST';

export const TIER_RULES = {
  TIER1: { min: 77, monthsEn: 'Months 1–4', monthsFr: 'Mois 1–4' },
  TIER2: { min: 66, monthsEn: 'Months 5–8', monthsFr: 'Mois 5–8' },
} as const;

export function classify(composite: number): AcriTier {
  if (composite >= TIER_RULES.TIER1.min) return 'TIER1';
  if (composite >= TIER_RULES.TIER2.min) return 'TIER2';
  return 'WATCHLIST';
}

/** Composite = Σ wᵢ·sᵢ over the 7 criteria (weights sum to 1). */
export function composite(scores: number[]): number {
  return scores.reduce((acc, s, i) => acc + s * (CRITERIA[i]?.weight ?? 0), 0);
}

export const METHODOLOGY = {
  normalizationEn:
    'Each raw indicator is min–max normalised to 0–100 across the assessed cohort; criterion score = weighted mean of its normalised indicators.',
  normalizationFr:
    'Chaque indicateur brut est normalisé min–max sur 0–100 au sein de la cohorte évaluée ; le score du critère = moyenne pondérée de ses indicateurs normalisés.',
  compositeFormula: 'ACRI = Σᵢ wᵢ · sᵢ  (i = 1…7, Σwᵢ = 1, s ∈ [0,100])',
  rankingEn: 'Nations ranked by composite, descending; ties broken by Criterion 7 (hub potential), then Criterion 2.',
  rankingFr: 'Nations classées par composite décroissant ; égalités départagées par le critère 7 (hub), puis le critère 2.',
  sensitivityEn:
    '±5 pts on any single 20%-weight criterion moves the composite by ±1.0 pt — a nation within 1 pt of a tier boundary is flagged “boundary-sensitive”.',
  sensitivityFr:
    '±5 pts sur un critère à 20 % déplace le composite de ±1,0 pt — une nation à moins de 1 pt d’un seuil est marquée « sensible au seuil ».',
  confidenceEn:
    'Confidence: MEASURED when fed by connected datasets; ILLUSTRATIVE (current, dataVersion illustrative-v1) = traceable decomposition of the official Atlas composite pending dataset connections.',
  confidenceFr:
    'Confiance : MEASURED quand les jeux de données sont connectés ; ILLUSTRATIVE (actuel, dataVersion illustrative-v1) = décomposition traçable du composite officiel de l’Atlas en attendant les connexions de données.',
  tierMovementEn:
    'A nation moves up when a re-scored composite crosses 77 (→ Tier 1) or 66 (→ Tier 2); movements are recomputed on every dataset refresh, never edited by hand.',
  tierMovementFr:
    'Une nation monte quand son composite recalculé franchit 77 (→ Tier 1) ou 66 (→ Tier 2) ; les mouvements sont recalculés à chaque rafraîchissement de données, jamais édités à la main.',
} as const;
