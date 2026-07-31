/**
 * Required Evidence Gate — the connector between the 63 APA tools, the C-SPA
 * score, and the W3C Verifiable Credential 2.0 emission.
 *
 * Design (ratified): HYBRID coupling.
 *   1. The C-SPA composite stays PURE and reproducible — this module never
 *      mutates it (see domain/cspa/engine.ts · scoreRun). Statistical &
 *      ISO 37000 audit traceability depend on that determinism.
 *   2. Completing the tools mapped to each C-SPA section acts as an ISSUANCE
 *      LOCK: the Verifiable Credential cannot be minted until the required
 *      tools have actually been executed (Règle 04 — "étapes d'évaluation
 *      pratique obligatoires").
 *   3. The tools' frozen results are injected into the credential's
 *      `evidence[]` / `result[]` arrays (Open Badges 3.0), so the proof
 *      carries the real, auditable basis of the claimed competence.
 *
 * This module is pure (no I/O). The application layer reads ToolReport /
 * ToolSession rows and passes plain ToolEvidence objects in.
 */

import { SECTIONS } from '@/domain/cspa/engine';
import type { ToolCategory } from '@/generated/prisma/client';

/** Bump when the required-tools policy or gate math changes — keeps issued
 *  credentials reproducible against the exact rule set that gated them. */
export const EVIDENCE_VERSION = 'evidence-v1';

// ─────────────────────────────────────────────
// REQUIRED-TOOLS POLICY
// ─────────────────────────────────────────────

/**
 * Which of each C-SPA section's mapped tools are MANDATORY for issuance.
 * Derived from the canonical section→tools map in engine.ts (single source of
 * truth). v1 policy: the section's lead tool + its co-ownership/measurement
 * anchor must be completed; the third stays recommended-only. Editable here
 * without touching the scoring engine.
 */
export const REQUIRED_TOOLS_BY_SECTION: Record<string, number[]> = Object.fromEntries(
  SECTIONS.map((s) => [s.code, s.tools.slice(0, 2)]),
);

/** Flat, de-duplicated list of every tool number the gate can require. */
export const ALL_REQUIRED_TOOL_NUMBERS: number[] = [
  ...new Set(Object.values(REQUIRED_TOOLS_BY_SECTION).flat()),
].sort((a, b) => a - b);

// ─────────────────────────────────────────────
// INPUT — what the app layer supplies per completed tool
// ─────────────────────────────────────────────

/**
 * A frozen tool completion, derived by the application layer from a
 * ToolReport (preferred) or an ARCHIVED ToolSession. One per (tool, user).
 */
export interface ToolEvidence {
  toolNumber: number; // official 1–63
  toolSlug: string;
  toolName: string; // localized display name (app layer resolves EN/FR)
  category: ToolCategory; // FORM | GUIDE | LEGAL | METRIC
  /** FORM tools carry a 0–100 alignment score; others are completion-only. */
  score?: number;
  reportId: string; // ToolReport.id — the frozen artifact backing this claim
  completedAt: Date;
}

/**
 * Defensive score normalization. A signed credential must never carry a
 * nonsensical score, so a corrupted report (NaN, ±Infinity, out-of-range,
 * non-number) is coerced: non-finite → null (treated as completion-only),
 * finite → clamped to the valid 0–100 integer band. Deterministic.
 */
export function normalizeScore(score: unknown): number | null {
  if (typeof score !== 'number' || !Number.isFinite(score)) return null;
  return Math.min(100, Math.max(0, Math.round(score)));
}

// ─────────────────────────────────────────────
// GATE COMPUTATION
// ─────────────────────────────────────────────

export interface SectionCoverage {
  code: string;
  nameEn: string;
  nameFr: string;
  requiredTools: number[];
  completedTools: number[];
  missingTools: number[];
  /** Mean score of completed FORM tools in this section, if any (0–100). */
  avgFormScore: number | null;
  covered: boolean; // every required tool completed
}

export interface EvidenceGate {
  version: string; // EVIDENCE_VERSION — frozen into the credential
  passed: boolean; // all sections covered → issuance allowed
  coveragePct: number; // completed required tools / total required, 0–100
  sections: SectionCoverage[];
  missing: { section: string; toolNumber: number }[]; // flat blocking list
}

/**
 * Compute the issuance gate from the user's tool completions.
 * Deterministic: same evidence + same version → same gate.
 */
export function computeGate(evidence: ToolEvidence[]): EvidenceGate {
  const completedNumbers = new Set(evidence.map((e) => e.toolNumber));
  const missing: { section: string; toolNumber: number }[] = [];

  const sections: SectionCoverage[] = SECTIONS.map((s) => {
    const required = REQUIRED_TOOLS_BY_SECTION[s.code] ?? [];
    const completed = required.filter((n) => completedNumbers.has(n));
    const missingHere = required.filter((n) => !completedNumbers.has(n));
    missingHere.forEach((n) => missing.push({ section: s.code, toolNumber: n }));

    const formScores = evidence
      .filter((e) => required.includes(e.toolNumber) && e.category === 'FORM')
      .map((e) => normalizeScore(e.score))
      .filter((s): s is number => s !== null);
    const avgFormScore = formScores.length
      ? Math.round(formScores.reduce((a, b) => a + b, 0) / formScores.length)
      : null;

    return {
      code: s.code,
      nameEn: s.nameEn,
      nameFr: s.nameFr,
      requiredTools: required,
      completedTools: completed,
      missingTools: missingHere,
      avgFormScore,
      covered: missingHere.length === 0,
    };
  });

  const totalRequired = ALL_REQUIRED_TOOL_NUMBERS.length;
  const totalCompleted = ALL_REQUIRED_TOOL_NUMBERS.filter((n) => completedNumbers.has(n)).length;

  return {
    version: EVIDENCE_VERSION,
    passed: missing.length === 0,
    coveragePct: totalRequired ? Math.round((totalCompleted / totalRequired) * 100) : 0,
    sections,
    missing,
  };
}

// ─────────────────────────────────────────────
// W3C VC 2.0 / OPEN BADGES 3.0 PROJECTION
// ─────────────────────────────────────────────

/** OB 3.0 `evidence` entry — one per completed tool backing the credential. */
export interface CredentialEvidenceItem {
  id: string; // resolvable proof URL: /verify/[credentialId]#tool-<n>
  type: ['Evidence'];
  name: string;
  narrative: string;
  // APA extensions (namespaced to survive strict JSON-LD processors)
  'apa:toolNumber': number;
  'apa:toolSlug': string;
  'apa:reportId': string;
}

/** OB 3.0 `result` entry — the C-SPA composite as a machine-readable outcome. */
export interface CredentialResultItem {
  type: ['Result'];
  resultDescription: string;
  value: string; // stringified per OB 3.0
  status: 'Completed';
}

/**
 * Build the `evidence[]` array for the credential from completed tools.
 * `credentialUrn` is the credential's public verify path root, so each item
 * id deep-links back to the tool proof on the /verify page.
 */
export function buildEvidenceItems(
  evidence: ToolEvidence[],
  credentialUrn: string,
): CredentialEvidenceItem[] {
  return [...evidence]
    .sort((a, b) => a.toolNumber - b.toolNumber)
    .map((e) => {
      const score = normalizeScore(e.score);
      return {
      id: `${credentialUrn}#tool-${e.toolNumber}`,
      type: ['Evidence'] as ['Evidence'],
      name: e.toolName,
      narrative:
        score !== null
          ? `APA Tool #${e.toolNumber} completed — alignment score ${score}/100.`
          : `APA Tool #${e.toolNumber} completed — working artifact on record.`,
      'apa:toolNumber': e.toolNumber,
      'apa:toolSlug': e.toolSlug,
      'apa:reportId': e.reportId,
      };
    });
}

/** Build the `result[]` array carrying the (unmodified) C-SPA composite. */
export function buildResultItems(cspaComposite: number, maturity: string): CredentialResultItem[] {
  return [
    {
      type: ['Result'],
      resultDescription: 'cspa-composite',
      value: String(cspaComposite),
      status: 'Completed',
    },
    {
      type: ['Result'],
      resultDescription: 'cspa-maturity',
      value: maturity,
      status: 'Completed',
    },
  ];
}
