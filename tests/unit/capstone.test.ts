import { describe, it, expect } from 'vitest';
import { buildPrescore } from '@/domain/capstone/prescoring';
import {
  checkCapstoneIntegrity,
  shingles,
  jaccard,
  maxSimilarity,
  MIN_WORDS,
  SIMILARITY_THRESHOLD,
} from '@/domain/capstone/integrity';
import { ALL_REQUIRED_TOOL_NUMBERS } from '@/domain/certification/evidence';
import { SECTIONS } from '@/domain/cspa/engine';

// ─────────────────────────────────────────────
// Pre-scoring
// ─────────────────────────────────────────────

describe('buildPrescore', () => {
  it('scores an empty document at zero across all C-SPA domains', () => {
    const p = buildPrescore('');
    expect(p.composite).toBe(0);
    expect(p.dimensions).toHaveLength(SECTIONS.length);
    expect(p.dimensions.every((d) => d.score === 0)).toBe(true);
    expect(p.band).toBe('NONE');
  });

  it('rewards a document covering the governance paradigms', () => {
    const doc = `
      Our strategy embraces shared value (CSV) as strategic investment, not cost.
      Governance is redesigned for power-sharing on the board; every decision is accountable.
      The community holds co-ownership through an equity stake; local stakeholders co-decide.
      We measure impact with indicators and continuous monitoring (KPI).
      Capital and value distribution route revenue and benefit back to the community.
      An exit and continuity plan ensures sustainability and succession.`;
    const p = buildPrescore(doc);
    expect(p.composite).toBeGreaterThan(45); // partial concept coverage, weighted
    // Every domain has at least one matched concept.
    expect(p.dimensions.every((d) => d.matched.length > 0)).toBe(true);
  });

  it('is deterministic and weights by C-SPA weight', () => {
    const doc = 'shared value paradigm strategy investment csv';
    const a = buildPrescore(doc);
    const b = buildPrescore(doc);
    expect(a).toEqual(b);
    // Only S1 concepts present → composite ≈ S1 weight share, others 0.
    const s1 = a.dimensions.find((d) => d.code === 'S1')!;
    expect(s1.score).toBeGreaterThan(0);
    expect(a.dimensions.filter((d) => d.code !== 'S1').every((d) => d.score === 0)).toBe(true);
  });
});

// ─────────────────────────────────────────────
// Similarity primitives
// ─────────────────────────────────────────────

describe('similarity', () => {
  it('jaccard of identical text is 1', () => {
    const s = shingles('the quick brown fox jumps');
    expect(jaccard(s, s)).toBe(1);
  });
  it('jaccard of disjoint text is 0', () => {
    expect(jaccard(shingles('alpha beta gamma delta'), shingles('one two three four'))).toBe(0);
  });
  it('maxSimilarity finds the closest corpus match', () => {
    const content = 'institutional transformation through shared value governance reform';
    const corpus = ['completely unrelated text about weather', 'institutional transformation through shared value governance reform'];
    expect(maxSimilarity(content, corpus)).toBe(1);
  });
});

// ─────────────────────────────────────────────
// Integrity gate
// ─────────────────────────────────────────────

const LONG = Array.from({ length: MIN_WORDS + 20 }, (_, i) => `word${i}`).join(' ');

describe('checkCapstoneIntegrity', () => {
  it('passes when long enough, all tools complete, and original', () => {
    const r = checkCapstoneIntegrity({ content: LONG, priorCorpus: [], completedToolNumbers: ALL_REQUIRED_TOOL_NUMBERS });
    expect(r.passed).toBe(true);
    expect(r.toolsComplete).toBe(true);
    expect(r.missingTools).toEqual([]);
    expect(r.plagiarismFlag).toBe(false);
  });

  it('fails when required tools are missing (reports which)', () => {
    const partial = ALL_REQUIRED_TOOL_NUMBERS.slice(0, -2);
    const r = checkCapstoneIntegrity({ content: LONG, priorCorpus: [], completedToolNumbers: partial });
    expect(r.toolsComplete).toBe(false);
    expect(r.missingTools).toHaveLength(2);
    expect(r.passed).toBe(false);
  });

  it('fails on insufficient length', () => {
    const r = checkCapstoneIntegrity({ content: 'too short', priorCorpus: [], completedToolNumbers: ALL_REQUIRED_TOOL_NUMBERS });
    expect(r.meetsMinLength).toBe(false);
    expect(r.passed).toBe(false);
  });

  it('flags plagiarism when similarity crosses the threshold', () => {
    const r = checkCapstoneIntegrity({ content: LONG, priorCorpus: [LONG], completedToolNumbers: ALL_REQUIRED_TOOL_NUMBERS });
    expect(r.similarity).toBeGreaterThanOrEqual(SIMILARITY_THRESHOLD);
    expect(r.plagiarismFlag).toBe(true);
    expect(r.passed).toBe(false);
  });

  it('does not flag an original document against an unrelated corpus', () => {
    const r = checkCapstoneIntegrity({
      content: LONG,
      priorCorpus: ['an entirely different essay on unrelated matters entirely'],
      completedToolNumbers: ALL_REQUIRED_TOOL_NUMBERS,
    });
    expect(r.plagiarismFlag).toBe(false);
    expect(r.passed).toBe(true);
  });
});
