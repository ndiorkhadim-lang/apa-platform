/**
 * Capstone AI pre-scoring — advisory, deterministic, framework-grounded.
 *
 * Scores a transformation-project document against a rubric whose dimensions
 * mirror the six C-SPA / ISO 37000 governance paradigms. Each dimension is
 * evidenced by concept coverage (bilingual key terms from the Master Mémoire).
 * This is a PRE-score to orient the human evaluator — never an autonomous
 * decision. Pure; swappable for a live model behind the same signature.
 */

import { SECTIONS } from '@/domain/cspa/engine';
import { coverageBand, type CoverageBand } from '@/domain/enterprise/skills-matrix';

export const PRESCORING_VERSION = 'capstone-prescore-v1';

/** Bilingual concept terms per C-SPA domain (lower-case, matched as substrings). */
const CONCEPTS: Record<string, string[]> = {
  S1: ['shared value', 'valeur partagée', 'paradigm', 'paradigme', 'strategy', 'stratégie', 'investment', 'investissement', 'csv'],
  S2: ['governance', 'gouvernance', 'power-sharing', 'partage du pouvoir', 'board', 'conseil', 'decision', 'décision', 'accountab', 'redevab'],
  S3: ['community', 'communauté', 'co-ownership', 'co-propriété', 'equity', 'équité', 'stakeholder', 'partie prenante', 'local'],
  S4: ['measure', 'mesure', 'indicator', 'indicateur', 'kpi', 'impact', 'monitoring', 'suivi', 'evaluation', 'évaluation'],
  S5: ['capital', 'value distribution', 'distribution de valeur', 'revenue', 'revenu', 'benefit', 'bénéfice', 'financ'],
  S6: ['exit', 'sortie', 'continuity', 'continuité', 'sustainab', 'durab', 'succession', 'handover', 'transmission'],
};

export interface DimensionScore {
  code: string;
  nameEn: string;
  nameFr: string;
  weight: number;
  matched: string[];
  total: number;
  score: number; // 0..100
}

export interface Prescore {
  version: string;
  dimensions: DimensionScore[];
  composite: number; // 0..100 weighted
  band: CoverageBand;
  wordCount: number;
}

function wordCount(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

/** Compute the advisory pre-score for a capstone document. */
export function buildPrescore(content: string): Prescore {
  const haystack = content.toLowerCase();
  const dimensions: DimensionScore[] = SECTIONS.map((s) => {
    const concepts = CONCEPTS[s.code] ?? [];
    const matched = concepts.filter((c) => haystack.includes(c));
    const score = concepts.length ? Math.round((matched.length / concepts.length) * 100) : 0;
    return { code: s.code, nameEn: s.nameEn, nameFr: s.nameFr, weight: s.weight, matched, total: concepts.length, score };
  });

  const composite = Math.round(
    dimensions.reduce((acc, d) => acc + (d.score * d.weight) / 100, 0),
  );

  return { version: PRESCORING_VERSION, dimensions, composite, band: coverageBand(composite), wordCount: wordCount(content) };
}
