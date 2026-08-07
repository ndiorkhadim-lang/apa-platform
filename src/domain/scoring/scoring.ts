/**
 * Executive scoring & maturity — pure, deterministic, versioned.
 *
 * Turns a learner/organization's activity into points, an executive level, and
 * verifiable badges. Not a game: levels are professional standing, badges are
 * Open Badges 3.0 -shaped milestones (the infrastructure layer signs them with
 * the same Ed25519 credential machinery). The application layer supplies a plain
 * activity summary; this engine owns the invariant rules.
 */

import type { Maturity } from '@/domain/cspa/engine';

export const SCORING_VERSION = 'scoring-v1';

/** Points awarded per activity — the executive gamification rubric. */
export const POINTS = {
  toolCompleted: 10,
  lessonRead: 5,
  cspaPassed: 25,
  capstoneApproved: 40,
  certificationIssued: 100,
} as const;

export type LevelId = 'PRACTITIONER' | 'STRATEGIST' | 'LEADER' | 'FELLOW';

export interface LevelDef {
  id: LevelId;
  min: number; // cumulative points
  nameEn: string;
  nameFr: string;
}

/** Executive levels — ascending; the highest one whose `min` is met applies. */
export const LEVELS: LevelDef[] = [
  { id: 'PRACTITIONER', min: 0, nameEn: 'Practitioner', nameFr: 'Praticien' },
  { id: 'STRATEGIST', min: 100, nameEn: 'Strategist', nameFr: 'Stratège' },
  { id: 'LEADER', min: 250, nameEn: 'Leader', nameFr: 'Leader' },
  { id: 'FELLOW', min: 500, nameEn: 'Fellow', nameFr: 'Fellow' },
];

export type BadgeId = 'diagnostic' | 'pathway' | 'capstone' | 'certified' | 'csv-leader';

export interface Badge {
  id: BadgeId;
  nameEn: string;
  nameFr: string;
  descEn: string;
  descFr: string;
}

/** The badge catalog — one entry per earnable milestone. */
export const BADGES: Record<BadgeId, Badge> = {
  diagnostic: { id: 'diagnostic', nameEn: 'Diagnostic Cleared', nameFr: 'Diagnostic validé', descEn: 'Passed the C-SPA governance diagnostic (≥ 70).', descFr: 'A réussi le diagnostic de gouvernance C-SPA (≥ 70).' },
  pathway: { id: 'pathway', nameEn: 'Pathway Complete', nameFr: 'Parcours complété', descEn: 'Cleared every required practical tool-lock.', descFr: 'A levé tous les verrous-outils pratiques requis.' },
  capstone: { id: 'capstone', nameEn: 'Capstone Approved', nameFr: 'Capstone approuvé', descEn: 'Institutional transformation project approved by an APA evaluator.', descFr: 'Projet de transformation approuvé par un évaluateur APA.' },
  certified: { id: 'certified', nameEn: 'Certified (CITS)', nameFr: 'Certifié (CITS)', descEn: 'Issued a verifiable APA credential.', descFr: 'A obtenu un titre APA vérifiable.' },
  'csv-leader': { id: 'csv-leader', nameEn: 'CSV Leader', nameFr: 'Leader CSV', descEn: 'Reached the Creating-Shared-Value maturity tier.', descFr: 'A atteint le palier de maturité Valeur Partagée.' },
};

export interface ScoringInput {
  toolsCompleted: number;
  lessonsRead: number;
  cspaPassed: boolean;
  cspaMaturity?: Maturity;
  capstoneApproved: boolean;
  certified: boolean;
}

export interface ScoreResult {
  version: string;
  points: number;
  level: LevelDef;
  levelIndex: number;
  nextLevel: LevelDef | null;
  pointsToNext: number | null; // null at top level
  progressPct: number; // progress within the current level band, 0..100
  badges: Badge[]; // earned, in catalog order
}

function clampCount(n: number): number {
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

/** Compute total points from an activity summary. Deterministic. */
export function computePoints(input: ScoringInput): number {
  return (
    clampCount(input.toolsCompleted) * POINTS.toolCompleted +
    clampCount(input.lessonsRead) * POINTS.lessonRead +
    (input.cspaPassed ? POINTS.cspaPassed : 0) +
    (input.capstoneApproved ? POINTS.capstoneApproved : 0) +
    (input.certified ? POINTS.certificationIssued : 0)
  );
}

/** Earned badges for the given activity, in catalog order. */
export function earnedBadges(input: ScoringInput): Badge[] {
  const out: Badge[] = [];
  if (input.cspaPassed) out.push(BADGES.diagnostic);
  if (input.capstoneApproved) out.push(BADGES.capstone);
  if (input.certified) out.push(BADGES.certified);
  if (input.cspaMaturity === 'CSV_LEADER') out.push(BADGES['csv-leader']);
  return out;
}

/** Full score result: points, level, progress to next, and badges. */
export function computeScore(input: ScoringInput, pathwayComplete = false): ScoreResult {
  const points = computePoints(input);

  let levelIndex = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i].min) levelIndex = i;
  }
  const level = LEVELS[levelIndex];
  const nextLevel = LEVELS[levelIndex + 1] ?? null;

  const pointsToNext = nextLevel ? nextLevel.min - points : null;
  const progressPct = nextLevel
    ? Math.round(((points - level.min) / (nextLevel.min - level.min)) * 100)
    : 100;

  const badges = earnedBadges(input);
  if (pathwayComplete) badges.splice(1, 0, BADGES.pathway); // after 'diagnostic' in catalog order

  return { version: SCORING_VERSION, points, level, levelIndex, nextLevel, pointsToNext, progressPct, badges };
}
