/**
 * C-SPA — Core Strategic Paradigm Audit engine.
 * Source of truth: APA Master Memoire (Tool #3: explicit, documented choice
 * between the "Old Paradigm" — CSR as cost centre — and the "New Vision" —
 * Creating Shared Value as strategic investment; pass gate ≥ 70; a score
 * below 70 fires the Colonial Architecture Warning).
 *
 * Questions live in the cspa_questions table (versioned). This module owns
 * the invariant parts: sections, weights, scoring, maturity, recommendations.
 */

export const CSPA_VERSION = 'cspa-v1';
export const CSPA_PASS = 70;

export interface SectionDef {
  code: string;
  weight: number; // out of 100
  nameEn: string;
  nameFr: string;
  /** Tool numbers recommended when the section scores < 60. */
  tools: number[];
}

export const SECTIONS: SectionDef[] = [
  { code: 'S1', weight: 20, nameEn: 'Strategic Paradigm', nameFr: 'Paradigme stratégique', tools: [3, 7, 9] },
  { code: 'S2', weight: 20, nameEn: 'Power-Sharing & Governance', nameFr: 'Partage du pouvoir & gouvernance', tools: [18, 22, 12] },
  { code: 'S3', weight: 20, nameEn: 'Community Co-Ownership', nameFr: 'Co-propriété communautaire', tools: [21, 27, 52] },
  { code: 'S4', weight: 15, nameEn: 'Measurement & Accountability', nameFr: 'Mesure & redevabilité', tools: [29, 10, 25] },
  { code: 'S5', weight: 15, nameEn: 'Capital & Value Distribution', nameFr: 'Capital & distribution de valeur', tools: [24, 5, 53] },
  { code: 'S6', weight: 10, nameEn: 'Exit & Continuity', nameFr: 'Sortie & continuité', tools: [20, 57, 28] },
];

export type Maturity = 'TRADITIONAL' | 'TRANSITIONAL' | 'TRANSFORMATIONAL' | 'CSV_LEADER';

export const MATURITY_LEVELS: {
  level: Maturity; min: number;
  labelEn: string; labelFr: string; descEn: string; descFr: string;
}[] = [
  {
    level: 'CSV_LEADER', min: 85,
    labelEn: 'CSV Leader', labelFr: 'Leader CSV',
    descEn: 'Shared-value governance is institutionalized. Fast-track candidate: proceed directly to Trust Audit with a strong Authenticity Premium™ outlook.',
    descFr: 'La gouvernance à valeur partagée est institutionnalisée. Candidat fast-track : passez directement au Trust Audit avec une Prime d’Authenticité™ prometteuse.',
  },
  {
    level: 'TRANSFORMATIONAL', min: CSPA_PASS,
    labelEn: 'Transformational (CSV-aligned)', labelFr: 'Transformationnel (aligné CSV)',
    descEn: 'Pass gate met (≥70). The organization operates in the Creating-Shared-Value paradigm; certification journey opens.',
    descFr: 'Seuil atteint (≥70). L’organisation opère dans le paradigme de la valeur partagée ; le parcours de certification s’ouvre.',
  },
  {
    level: 'TRANSITIONAL', min: 40,
    labelEn: 'Transitional — Colonial Architecture Warning', labelFr: 'Transitionnel — Alerte d’Architecture Coloniale',
    descEn: 'Below the 70 gate: structures still carry transactional patterns. Deploy the recommended tools, then retake the audit.',
    descFr: 'Sous le seuil de 70 : les structures portent encore des schémas transactionnels. Déployez les outils recommandés, puis repassez l’audit.',
  },
  {
    level: 'TRADITIONAL', min: 0,
    labelEn: 'Traditional / Transactional', labelFr: 'Traditionnel / Transactionnel',
    descEn: 'CSR-as-cost-centre paradigm. Begin with the foundational diagnostics (Pillar I) before any certification attempt.',
    descFr: 'Paradigme RSE-centre-de-coût. Commencez par les diagnostics fondamentaux (pilier I) avant toute certification.',
  },
];

export interface QuestionLite {
  id: string;
  section: string;
}

export interface CspaResult {
  sectionScores: Record<string, number>; // 0..100
  composite: number; // 0..100
  passed: boolean;
  maturity: Maturity;
}

/** answers: { [questionId]: 0..3 } · question value v → v/3 × 100. */
export function scoreRun(questions: QuestionLite[], answers: Record<string, number>): CspaResult {
  const sectionScores: Record<string, number> = {};
  for (const s of SECTIONS) {
    const qs = questions.filter((q) => q.section === s.code);
    const vals = qs.map((q) => ((answers[q.id] ?? 0) / 3) * 100);
    sectionScores[s.code] = qs.length
      ? Math.round(vals.reduce((a, b) => a + b, 0) / qs.length)
      : 0;
  }
  const composite = Math.round(
    SECTIONS.reduce((acc, s) => acc + (sectionScores[s.code] * s.weight) / 100, 0)
  );
  const maturity = (MATURITY_LEVELS.find((m) => composite >= m.min) ?? MATURITY_LEVELS[3]).level;
  return { sectionScores, composite, passed: composite >= CSPA_PASS, maturity };
}

export interface Recommendation {
  section: SectionDef;
  score: number;
  tools: number[];
}

/** Sections under 60 → their mapped remediation tools, weakest first. */
export function recommend(result: CspaResult): Recommendation[] {
  return SECTIONS
    .map((s) => ({ section: s, score: result.sectionScores[s.code] ?? 0, tools: s.tools }))
    .filter((r) => r.score < 60)
    .sort((a, b) => a.score - b.score);
}

/** Next steps keyed by maturity — the personalized pathway. */
export function nextSteps(maturity: Maturity, locale: string): string[] {
  const fr = locale !== 'en';
  const map: Record<Maturity, string[]> = {
    CSV_LEADER: fr
      ? ['Ouvrir le parcours de certification (étape 2 : Trust Audit).', 'Préparer le Portfolio Numérique (outil #52).', 'Briefer votre conseil sur la Prime d’Authenticité™ attendue.']
      : ['Open the certification journey (step 2: Trust Audit).', 'Prepare the Digital Portfolio (tool #52).', 'Brief your board on the expected Authenticity Premium™.'],
    TRANSFORMATIONAL: fr
      ? ['Ouvrir le parcours de certification.', 'Consolider les sections < 75 avec les outils recommandés.', 'Planifier le Trust Audit avec l’équipe APA.']
      : ['Open the certification journey.', 'Strengthen sections < 75 with the recommended tools.', 'Schedule the Trust Audit with the APA team.'],
    TRANSITIONAL: fr
      ? ['Déployer les outils recommandés ci-dessous (priorité aux sections les plus faibles).', 'Constituer les preuves dans vos ateliers d’outils.', 'Repasser le C-SPA — vos brouillons sont conservés.']
      : ['Deploy the recommended tools below (weakest sections first).', 'Build evidence in your tool workspaces.', 'Retake the C-SPA — your drafts are preserved.'],
    TRADITIONAL: fr
      ? ['Commencer par le pilier I : Évaluation de préparation (#1) et Audit de confiance (#2).', 'Engager la direction sur le choix de paradigme (outil #3).', 'Solliciter un accompagnement via le Concierge IA.']
      : ['Start with Pillar I: Readiness Assessment (#1) and Trust Audit (#2).', 'Engage leadership on the paradigm choice (tool #3).', 'Request guidance via the AI Concierge.'],
  };
  return map[maturity];
}
