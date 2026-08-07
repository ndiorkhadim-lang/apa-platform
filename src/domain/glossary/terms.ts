/**
 * Glossaire Souverain — canonical APA concepts, grounded in the 12-volume
 * Master Memoire. Pure data (no I/O) so it can power search, print, and export.
 * Each term carries bilingual definitions, a category, and related tool numbers.
 */

export type GlossaryCategory =
  | 'ECONOMICS'
  | 'CERTIFICATION'
  | 'GOVERNANCE'
  | 'METRICS'
  | 'TECHNICAL'
  | 'STRATEGY';

export interface GlossaryTerm {
  id: string;
  term: string;
  termFr?: string;
  category: GlossaryCategory;
  defEn: string;
  defFr: string;
  tools?: number[];
  volume?: string;
}

export const GLOSSARY_CATEGORIES: { id: GlossaryCategory; en: string; fr: string; glyph: string }[] = [
  { id: 'ECONOMICS', en: 'Economics', fr: 'Économie', glyph: '$' },
  { id: 'CERTIFICATION', en: 'Certification', fr: 'Certification', glyph: '❖' },
  { id: 'GOVERNANCE', en: 'Governance', fr: 'Gouvernance', glyph: '⚖' },
  { id: 'METRICS', en: 'Metrics', fr: 'Indicateurs', glyph: '∆' },
  { id: 'TECHNICAL', en: 'Technical', fr: 'Technique', glyph: '⛓' },
  { id: 'STRATEGY', en: 'Strategy', fr: 'Stratégie', glyph: '◎' },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'authenticity-premium',
    term: 'Authenticity Premium™',
    termFr: 'Prime d’Authenticité™',
    category: 'ECONOMICS',
    defEn: 'The economic multiplier that converts verified, community-validated governance conduct into portable enterprise value — revaluing resident output from a 1.0× baseline toward a 15.0×–17.6× multiplier as leakage (σ) is suppressed.',
    defFr: 'Le multiplicateur économique qui convertit une conduite de gouvernance vérifiée et validée par la communauté en valeur d’entreprise portable — revalorisant la production résidente d’une base de 1,0× vers un multiplicateur de 15,0×–17,6× à mesure que la fuite (σ) est supprimée.',
    volume: 'Vol 02',
  },
  {
    id: 'africa-risk-premium',
    term: 'Africa Risk Premium',
    termFr: 'Prime de Risque Africaine',
    category: 'ECONOMICS',
    defEn: 'The 300–500 basis-point capital penalty charged to African enterprises. APA’s thesis: it prices the absence of verifiable trust data — an information penalty masquerading as a risk penalty.',
    defFr: 'La pénalité de capital de 300 à 500 points de base imposée aux entreprises africaines. La thèse d’APA : elle facture l’absence de données de confiance vérifiables — une pénalité d’information déguisée en pénalité de risque.',
    volume: 'Vol 02',
  },
  {
    id: 'trust-tax',
    term: 'Trust Tax™',
    termFr: 'Taxe de Confiance™',
    category: 'ECONOMICS',
    defEn: 'The recurring cost an enterprise pays for the absence of independently verifiable trust — the premium demanded by capital when governance cannot be proven. APA’s certification is designed to dissolve it.',
    defFr: 'Le coût récurrent qu’une entreprise paie pour l’absence de confiance vérifiable de manière indépendante — la prime exigée par le capital lorsque la gouvernance ne peut être prouvée. La certification APA vise à la dissoudre.',
    volume: 'Vol 01',
  },
  {
    id: 'leakage-coefficient',
    term: 'Leakage Coefficient (σ)',
    termFr: 'Coefficient de Fuite (σ)',
    category: 'METRICS',
    defEn: 'σ = (C_committed − B_resident) / C_committed. The share of committed capital lost to illicit flows, tied aid, and intermediation before reaching residents. Historical ≈ 0.65–0.70; APA target ≤ 0.05.',
    defFr: 'σ = (C_engagé − B_résident) / C_engagé. La part du capital engagé perdue au profit des flux illicites, de l’aide liée et de l’intermédiation avant d’atteindre les résidents. Historique ≈ 0,65–0,70 ; cible APA ≤ 0,05.',
    tools: [5, 53],
    volume: 'Vol 02',
  },
  {
    id: 'sigma-suppression',
    term: 'Sigma-Suppression™',
    termFr: 'Suppression Sigma™',
    category: 'STRATEGY',
    defEn: 'The mechanism compressing σ toward zero via real-time consent tracking, a minimum 40% local procurement quota (Tool #53), and financial firewalls (Tool #26).',
    defFr: 'Le mécanisme comprimant σ vers zéro via le suivi du consentement en temps réel, un quota de 40% d’approvisionnement local minimum (Outil #53) et des pare-feux financiers (Outil #26).',
    tools: [26, 53],
    volume: 'Vol 02',
  },
  {
    id: 'kinship-equity',
    term: 'Kinship Equity™ Agreement',
    termFr: 'Accord d’Équité de Parenté™',
    category: 'GOVERNANCE',
    defEn: 'The binding co-ownership instrument executed at Step 3, combining the Veto Power Clause (#18), the Pay Parity Mandate (#19), and the Model Sunset Clause (#20).',
    defFr: 'L’instrument contraignant de copropriété exécuté à l’Étape 3, combinant la Clause de Veto (#18), le Mandat de Parité Salariale (#19) et la Clause de Sortie du Modèle (#20).',
    tools: [18, 19, 20],
    volume: 'Vol 06',
  },
  {
    id: 'cspa',
    term: 'C-SPA Diagnostic',
    termFr: 'Diagnostic C-SPA',
    category: 'CERTIFICATION',
    defEn: 'Core Strategic Paradigm Audit (Tool #3) — Step 1 of the pathway. A weighted diagnostic; a composite score ≥ 70 opens the certification journey, below 70 fires the Colonial Architecture Warning.',
    defFr: 'Core Strategic Paradigm Audit (Outil #3) — Étape 1 du parcours. Un diagnostic pondéré ; un score composite ≥ 70 ouvre le parcours de certification, en dessous de 70 déclenche l’Alerte d’Architecture Coloniale.',
    tools: [3],
    volume: 'Vol 06',
  },
  {
    id: 'colonial-architecture-warning',
    term: 'Colonial Architecture Warning',
    termFr: 'Alerte d’Architecture Coloniale',
    category: 'CERTIFICATION',
    defEn: 'The non-punitive signal fired when a C-SPA composite falls below 70. It places the enterprise in a guided 90-day remediation roadmap rather than rejecting it.',
    defFr: 'Le signal non punitif déclenché lorsqu’un composite C-SPA passe sous 70. Il place l’entreprise dans une feuille de route de remédiation guidée de 90 jours plutôt que de la rejeter.',
    tools: [3],
    volume: 'Vol 06',
  },
  {
    id: 'cvp',
    term: 'Community Verification Portal (CVP)',
    termFr: 'Portail de Vérification Communautaire (CVP)',
    category: 'GOVERNANCE',
    defEn: 'Tool #27 — the community-held veto gate (Step 4). Final verification authority belongs to the local community, which co-signs or vetoes certification via real-time consent telemetry.',
    defFr: 'Outil #27 — la porte de veto détenue par la communauté (Étape 4). L’autorité finale de vérification appartient à la communauté locale, qui co-signe ou oppose son veto à la certification via une télémétrie de consentement en temps réel.',
    tools: [27],
    volume: 'Vol 06',
  },
  {
    id: 'relational-repair',
    term: 'Relational Repair Phase',
    termFr: 'Phase de Réparation Relationnelle',
    category: 'GOVERNANCE',
    defEn: 'Tool #56 — the mandatory 90-day protocol triggered by a CVP veto, ending in a Relational Compact before certification can resume.',
    defFr: 'Outil #56 — le protocole obligatoire de 90 jours déclenché par un veto CVP, se terminant par un Pacte Relationnel avant que la certification puisse reprendre.',
    tools: [56, 62],
    volume: 'Vol 05',
  },
  {
    id: 'credibility-score',
    term: 'Credibility Score',
    termFr: 'Score de Crédibilité',
    category: 'METRICS',
    defEn: 'The quantified governance score issued at Step 5 alongside the Authenticity Premium™ Seal, streamed into the DFI / MSCI / Moody’s rating API layer.',
    defFr: 'Le score de gouvernance quantifié émis à l’Étape 5 aux côtés du Sceau de Prime d’Authenticité™, diffusé vers la couche API de notation DFI / MSCI / Moody’s.',
    volume: 'Vol 06',
  },
  {
    id: 'authenticity-seal',
    term: 'Authenticity Premium™ Seal',
    termFr: 'Sceau de Prime d’Authenticité™',
    category: 'CERTIFICATION',
    defEn: 'The cryptographically signed credential (W3C Verifiable Credential 2.0) issued at Step 5, with a dynamic QR code and a public verification URL.',
    defFr: 'Le titre signé cryptographiquement (W3C Verifiable Credential 2.0) émis à l’Étape 5, avec un QR code dynamique et une URL de vérification publique.',
    volume: 'Vol 06',
  },
  {
    id: 'mae',
    term: 'Made-in-Africa Evaluation (MAE)',
    termFr: 'Évaluation Made-in-Africa (MAE)',
    category: 'METRICS',
    defEn: 'Tool #29 — replaces donor KPIs with relational outcomes measured against local definitions of success (dignity, agency, cohesion) via non-extractive data.',
    defFr: 'Outil #29 — remplace les KPI des bailleurs par des résultats relationnels mesurés selon les définitions locales du succès (dignité, agentivité, cohésion) via des données non extractives.',
    tools: [29, 35],
    volume: 'Vol 05',
  },
  {
    id: 'pqi',
    term: 'Partnership Quality Index (PQI)',
    termFr: 'Indice de Qualité du Partenariat (PQI)',
    category: 'METRICS',
    defEn: 'Tool #31 — an anonymous 360-degree feedback score (target > 4.0 / 5.0) feeding the information-penalty compression model.',
    defFr: 'Outil #31 — un score de feedback anonyme à 360 degrés (cible > 4,0 / 5,0) alimentant le modèle de compression de la pénalité d’information.',
    tools: [31],
    volume: 'Vol 02',
  },
  {
    id: 'acri',
    term: 'ACRI — Africa Country Readiness Index',
    termFr: 'ACRI — Indice de Préparation des Pays Africains',
    category: 'STRATEGY',
    defEn: 'A proprietary 7-criteria weighted model (0–100) scoring and sequencing all 54 African nations to set tier placement and the month of in-country activation.',
    defFr: 'Un modèle propriétaire pondéré à 7 critères (0–100) notant et séquençant les 54 nations africaines pour définir le placement par palier et le mois d’activation dans le pays.',
    volume: 'Vol 03',
  },
  {
    id: 'digital-portfolio',
    term: 'Digital Portfolio',
    termFr: 'Portfolio Numérique',
    category: 'CERTIFICATION',
    defEn: 'Tool #52 — the accumulating record of an enterprise’s Trust Audits, GRM logs, and MAE reports, audited and community-verified via the CVP.',
    defFr: 'Outil #52 — le dossier cumulatif des Audits de Confiance, journaux GRM et rapports MAE d’une entreprise, audité et vérifié par la communauté via le CVP.',
    tools: [52],
    volume: 'Vol 05',
  },
  {
    id: 'zkp',
    term: 'Zero-Knowledge Proof (ZKP)',
    termFr: 'Preuve à Divulgation Nulle (ZKP)',
    category: 'TECHNICAL',
    defEn: 'Cryptographic proofs that let DFIs and rating agencies verify compliance (σ ≤ 0.05) without accessing the underlying raw community data (Tool #59).',
    defFr: 'Des preuves cryptographiques permettant aux DFI et agences de notation de vérifier la conformité (σ ≤ 0,05) sans accéder aux données communautaires brutes sous-jacentes (Outil #59).',
    tools: [59],
    volume: 'Vol 12',
  },
  {
    id: 'statuslist2021',
    term: 'StatusList2021',
    termFr: 'StatusList2021',
    category: 'TECHNICAL',
    defEn: 'The revocation registry standard used by the credential engine — a compressed bitstring where each certificate holds a slot, letting verifiers check revocation offline.',
    defFr: 'La norme de registre de révocation utilisée par le moteur de titres — une chaîne de bits compressée où chaque certificat détient un emplacement, permettant aux vérificateurs de contrôler la révocation hors ligne.',
    volume: 'Vol 12',
  },
  {
    id: 'sovereign-credits',
    term: 'Sovereign Credits™',
    termFr: 'Crédits Souverains™',
    category: 'STRATEGY',
    defEn: 'Aggregated national certification telemetry offered to sovereign debt underwriters as empirical proof of systemic governance reform, compressing national borrowing costs.',
    defFr: 'La télémétrie de certification nationale agrégée, offerte aux souscripteurs de dette souveraine comme preuve empirique d’une réforme systémique de la gouvernance, comprimant les coûts d’emprunt nationaux.',
    volume: 'Vol 12',
  },
  {
    id: 'local-value-capture',
    term: 'Local Value Capture (LVC)',
    termFr: 'Capture de Valeur Locale (LVC)',
    category: 'GOVERNANCE',
    defEn: 'Tool #5 — quantifies structural leakage (illicit flows, tied aid) and enforces the minimum 40% local procurement quota required for certification.',
    defFr: 'Outil #5 — quantifie la fuite structurelle (flux illicites, aide liée) et applique le quota minimum de 40% d’approvisionnement local requis pour la certification.',
    tools: [5, 53],
    volume: 'Vol 05',
  },
];
