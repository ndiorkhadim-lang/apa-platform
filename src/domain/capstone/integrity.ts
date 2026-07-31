/**
 * Capstone integrity checks — the gate that must pass before the credential
 * issuance flow can be triggered (Jalon 2.3, objective 3).
 *
 * Three deterministic checks:
 *   1. Practical completion — all 12 required APA tools cleared (shared truth
 *      with the C-SPA evidence gate).
 *   2. Anti-plagiarism — shingled Jaccard similarity against prior submissions.
 *   3. Minimum substance — word-count floor.
 *
 * Pure; the application layer supplies the prior-submission corpus and the
 * learner's completed tool numbers.
 */

import { ALL_REQUIRED_TOOL_NUMBERS } from '@/domain/certification/evidence';

export const INTEGRITY_VERSION = 'capstone-integrity-v1';
export const MIN_WORDS = 300;
export const SIMILARITY_THRESHOLD = 0.35; // ≥ → plagiarism flag

/** Normalize to lower-case word tokens. */
function tokens(text: string): string[] {
  return text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);
}

/** k-word shingles as a set (k=3 default). */
export function shingles(text: string, k = 3): Set<string> {
  const t = tokens(text);
  const out = new Set<string>();
  if (t.length < k) {
    if (t.length) out.add(t.join(' '));
    return out;
  }
  for (let i = 0; i + k <= t.length; i++) out.add(t.slice(i, i + k).join(' '));
  return out;
}

/** Jaccard similarity of two shingle sets (0..1). */
export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let inter = 0;
  for (const s of a) if (b.has(s)) inter += 1;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

/** Highest similarity of `content` against any document in the corpus. */
export function maxSimilarity(content: string, corpus: string[]): number {
  const self = shingles(content);
  let max = 0;
  for (const other of corpus) {
    const sim = jaccard(self, shingles(other));
    if (sim > max) max = sim;
  }
  return Math.round(max * 100) / 100;
}

export interface IntegrityInput {
  content: string;
  priorCorpus: string[];
  completedToolNumbers: Iterable<number>;
}

export interface IntegrityReport {
  version: string;
  wordCount: number;
  meetsMinLength: boolean;
  toolsComplete: boolean;
  missingTools: number[];
  similarity: number; // 0..1
  plagiarismFlag: boolean;
  passed: boolean;
}

export function checkCapstoneIntegrity(input: IntegrityInput): IntegrityReport {
  const words = input.content.trim() ? input.content.trim().split(/\s+/).length : 0;
  const meetsMinLength = words >= MIN_WORDS;

  const completed = new Set(input.completedToolNumbers);
  const missingTools = ALL_REQUIRED_TOOL_NUMBERS.filter((n) => !completed.has(n));
  const toolsComplete = missingTools.length === 0;

  const similarity = maxSimilarity(input.content, input.priorCorpus);
  const plagiarismFlag = similarity >= SIMILARITY_THRESHOLD;

  return {
    version: INTEGRITY_VERSION,
    wordCount: words,
    meetsMinLength,
    toolsComplete,
    missingTools,
    similarity,
    plagiarismFlag,
    passed: meetsMinLength && toolsComplete && !plagiarismFlag,
  };
}
