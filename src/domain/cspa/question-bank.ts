/**
 * Interactive C-SPA question bank — a compact, bilingual demo set (2 items per
 * section) that composes with the pure `scoreRun` engine. The production audit
 * pulls versioned questions from the `cspa_questions` table; this in-repo bank
 * powers the interactive Terminal wizard (Option B) with the SAME scoring math,
 * so the live score, maturity and recommendations are all real engine output.
 */

import type { QuestionLite } from '@/domain/cspa/engine';

export interface CspaQuestion extends QuestionLite {
  promptEn: string;
  promptFr: string;
}

/** Likert anchors (index = stored answer value 0..3). */
export const LIKERT: { en: string; fr: string }[] = [
  { en: 'Absent', fr: 'Absent' },
  { en: 'Emerging', fr: 'Émergent' },
  { en: 'Established', fr: 'Établi' },
  { en: 'Institutionalized', fr: 'Institutionnalisé' },
];

export const CSPA_QUESTION_BANK: CspaQuestion[] = [
  { id: 'S1Q1', section: 'S1', promptEn: 'Leadership has made an explicit, documented choice of the Creating-Shared-Value paradigm over CSR-as-cost-centre.', promptFr: 'La direction a fait un choix explicite et documenté du paradigme Valeur Partagée plutôt que RSE-centre-de-coût.' },
  { id: 'S1Q2', section: 'S1', promptEn: 'Strategic objectives tie financial return to measurable community outcomes.', promptFr: 'Les objectifs stratégiques lient le rendement financier à des résultats communautaires mesurables.' },
  { id: 'S2Q1', section: 'S2', promptEn: 'Governance bodies include enforceable community or stakeholder representation.', promptFr: 'Les organes de gouvernance incluent une représentation communautaire ou partie-prenante contraignante.' },
  { id: 'S2Q2', section: 'S2', promptEn: 'Decision rights and veto powers are formally shared, not merely consultative.', promptFr: 'Les droits de décision et de veto sont formellement partagés, pas seulement consultatifs.' },
  { id: 'S3Q1', section: 'S3', promptEn: 'Communities hold real co-ownership stakes (equity, trust, or cooperative title).', promptFr: 'Les communautés détiennent une co-propriété réelle (capital, fiducie ou titre coopératif).' },
  { id: 'S3Q2', section: 'S3', promptEn: 'A digital portfolio evidences community assets and their governance.', promptFr: 'Un portfolio numérique atteste des actifs communautaires et de leur gouvernance.' },
  { id: 'S4Q1', section: 'S4', promptEn: 'Impact is measured with audited, third-party-verifiable indicators.', promptFr: 'L’impact est mesuré via des indicateurs audités et vérifiables par un tiers.' },
  { id: 'S4Q2', section: 'S4', promptEn: 'Accountability failures trigger defined, enforced remediation.', promptFr: 'Les défaillances de redevabilité déclenchent une remédiation définie et appliquée.' },
  { id: 'S5Q1', section: 'S5', promptEn: 'Value distribution rules are transparent and favour local capital retention.', promptFr: 'Les règles de distribution de la valeur sont transparentes et favorisent la rétention de capital local.' },
  { id: 'S5Q2', section: 'S5', promptEn: 'Leakage of value out of the community is measured and actively suppressed.', promptFr: 'La fuite de valeur hors de la communauté est mesurée et activement réduite.' },
  { id: 'S6Q1', section: 'S6', promptEn: 'A Moral Exit Clause governs any withdrawal, sale, or succession.', promptFr: 'Une Clause de Sortie Morale encadre tout retrait, cession ou succession.' },
  { id: 'S6Q2', section: 'S6', promptEn: 'Continuity plans protect community stakes beyond current leadership.', promptFr: 'Les plans de continuité protègent les parts communautaires au-delà de la direction actuelle.' },
];

/** Every question starts unanswered (value 0). */
export function blankAnswers(): Record<string, number> {
  return Object.fromEntries(CSPA_QUESTION_BANK.map((q) => [q.id, 0]));
}
