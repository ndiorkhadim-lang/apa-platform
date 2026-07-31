import { describe, it, expect } from 'vitest';
import {
  EVIDENCE_VERSION,
  REQUIRED_TOOLS_BY_SECTION,
  ALL_REQUIRED_TOOL_NUMBERS,
  normalizeScore,
  computeGate,
  buildEvidenceItems,
  buildResultItems,
  type ToolEvidence,
} from '@/domain/certification/evidence';
import { SECTIONS } from '@/domain/cspa/engine';

// ─────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────

const AT = new Date('2026-07-01T00:00:00.000Z');

/** Factory for a completed tool. Category defaults to FORM (scored). */
function ev(toolNumber: number, over: Partial<ToolEvidence> = {}): ToolEvidence {
  return {
    toolNumber,
    toolSlug: `tool-${toolNumber}`,
    toolName: `Tool ${toolNumber}`,
    category: 'FORM',
    score: 80,
    reportId: `rpt_${toolNumber}`,
    completedAt: AT,
    ...over,
  };
}

/** The full set of the 12 required tools, all completed. */
function fullRequiredSet(): ToolEvidence[] {
  return ALL_REQUIRED_TOOL_NUMBERS.map((n) => ev(n));
}

// ─────────────────────────────────────────────
// Required-tools policy
// ─────────────────────────────────────────────

describe('required-tools policy', () => {
  it('requires exactly the first two mapped tools of every C-SPA section', () => {
    for (const s of SECTIONS) {
      expect(REQUIRED_TOOLS_BY_SECTION[s.code]).toEqual(s.tools.slice(0, 2));
    }
  });

  it('exposes a de-duplicated, sorted flat list of required tool numbers', () => {
    expect(ALL_REQUIRED_TOOL_NUMBERS).toEqual([3, 5, 7, 10, 18, 20, 21, 22, 24, 27, 29, 57]);
    // sorted ascending
    expect([...ALL_REQUIRED_TOOL_NUMBERS].sort((a, b) => a - b)).toEqual(ALL_REQUIRED_TOOL_NUMBERS);
    // unique
    expect(new Set(ALL_REQUIRED_TOOL_NUMBERS).size).toBe(ALL_REQUIRED_TOOL_NUMBERS.length);
  });
});

// ─────────────────────────────────────────────
// normalizeScore — corrupted-report guard
// ─────────────────────────────────────────────

describe('normalizeScore', () => {
  it('rounds a finite in-range number to an integer', () => {
    expect(normalizeScore(87.4)).toBe(87);
    expect(normalizeScore(87.6)).toBe(88);
    expect(normalizeScore(80)).toBe(80);
  });

  it('preserves the 0 and 100 boundaries', () => {
    expect(normalizeScore(0)).toBe(0);
    expect(normalizeScore(100)).toBe(100);
  });

  it('clamps out-of-range finite values into [0,100]', () => {
    expect(normalizeScore(150)).toBe(100);
    expect(normalizeScore(-10)).toBe(0);
  });

  it('rejects non-finite numbers (NaN / ±Infinity) as null', () => {
    expect(normalizeScore(NaN)).toBeNull();
    expect(normalizeScore(Infinity)).toBeNull();
    expect(normalizeScore(-Infinity)).toBeNull();
  });

  it('rejects non-number inputs as null', () => {
    expect(normalizeScore(undefined)).toBeNull();
    expect(normalizeScore(null)).toBeNull();
    expect(normalizeScore('90')).toBeNull();
    expect(normalizeScore({})).toBeNull();
  });
});

// ─────────────────────────────────────────────
// computeGate — the issuance lock
// ─────────────────────────────────────────────

describe('computeGate — blocking', () => {
  it('blocks issuance with no evidence at all', () => {
    const gate = computeGate([]);
    expect(gate.passed).toBe(false);
    expect(gate.coveragePct).toBe(0);
    expect(gate.missing).toHaveLength(ALL_REQUIRED_TOOL_NUMBERS.length); // 12
    expect(gate.sections.every((s) => !s.covered)).toBe(true);
    expect(gate.sections.every((s) => s.avgFormScore === null)).toBe(true);
    expect(gate.version).toBe(EVIDENCE_VERSION);
  });

  it('blocks when only some sections are covered, and reports what is missing', () => {
    // Complete only S1's required tools (3, 7).
    const gate = computeGate([ev(3), ev(7)]);
    expect(gate.passed).toBe(false);
    expect(gate.coveragePct).toBe(Math.round((2 / 12) * 100)); // 17
    const s1 = gate.sections.find((s) => s.code === 'S1')!;
    expect(s1.covered).toBe(true);
    expect(s1.completedTools).toEqual([3, 7]);
    expect(s1.missingTools).toEqual([]);
    // Every other section still blocking.
    expect(gate.sections.filter((s) => s.code !== 'S1').every((s) => !s.covered)).toBe(true);
    expect(gate.missing).toHaveLength(10);
    expect(gate.missing).toContainEqual({ section: 'S2', toolNumber: 18 });
  });

  it('ignores recommended-only and unknown tools for the gate', () => {
    // Tool 9 is S1-recommended but NOT required; 999 is unknown.
    const gate = computeGate([ev(9), ev(999)]);
    expect(gate.passed).toBe(false);
    expect(gate.coveragePct).toBe(0);
    const s1 = gate.sections.find((s) => s.code === 'S1')!;
    expect(s1.completedTools).toEqual([]);
    expect(s1.missingTools).toEqual([3, 7]);
  });
});

describe('computeGate — passing', () => {
  it('passes when every required tool is completed', () => {
    const gate = computeGate(fullRequiredSet());
    expect(gate.passed).toBe(true);
    expect(gate.coveragePct).toBe(100);
    expect(gate.missing).toEqual([]);
    expect(gate.sections.every((s) => s.covered)).toBe(true);
  });

  it('still passes with extra non-required tools present', () => {
    const gate = computeGate([...fullRequiredSet(), ev(9), ev(999)]);
    expect(gate.passed).toBe(true);
    expect(gate.coveragePct).toBe(100);
  });
});

describe('computeGate — avgFormScore', () => {
  it('averages FORM scores of a section and rounds', () => {
    const gate = computeGate([ev(3, { score: 90 }), ev(7, { score: 70 })]);
    expect(gate.sections.find((s) => s.code === 'S1')!.avgFormScore).toBe(80);
  });

  it('rounds a fractional mean', () => {
    const gate = computeGate([ev(3, { score: 91 }), ev(7, { score: 70 })]);
    expect(gate.sections.find((s) => s.code === 'S1')!.avgFormScore).toBe(81); // 80.5 → 81
  });

  it('excludes non-FORM tools from the FORM average', () => {
    // Tool 3 GUIDE (no score), tool 7 FORM 60 → avg is 60, not affected by GUIDE.
    const gate = computeGate([ev(3, { category: 'GUIDE', score: undefined }), ev(7, { score: 60 })]);
    const s1 = gate.sections.find((s) => s.code === 'S1')!;
    expect(s1.avgFormScore).toBe(60);
    expect(s1.covered).toBe(true); // completion is category-independent
  });

  it('drops a corrupted (NaN) FORM score from the average but still counts completion', () => {
    const gate = computeGate([ev(3, { score: NaN }), ev(7, { score: 60 })]);
    const s1 = gate.sections.find((s) => s.code === 'S1')!;
    expect(s1.avgFormScore).toBe(60); // NaN excluded
    expect(s1.completedTools).toEqual([3, 7]); // completion unaffected
    expect(s1.covered).toBe(true);
  });

  it('clamps out-of-range FORM scores before averaging', () => {
    const gate = computeGate([ev(3, { score: 150 }), ev(7, { score: 50 })]);
    // 100 (clamped) and 50 → 75
    expect(gate.sections.find((s) => s.code === 'S1')!.avgFormScore).toBe(75);
  });

  it('is null for a section whose completed required tools are all unscored', () => {
    const gate = computeGate([
      ev(3, { category: 'LEGAL', score: undefined }),
      ev(7, { category: 'GUIDE', score: undefined }),
    ]);
    expect(gate.sections.find((s) => s.code === 'S1')!.avgFormScore).toBeNull();
  });
});

// ─────────────────────────────────────────────
// Determinism — priority-1 reproducibility
// ─────────────────────────────────────────────

describe('determinism', () => {
  it('produces identical output for identical input across calls', () => {
    const input = [ev(3), ev(7), ev(18)];
    expect(computeGate(input)).toEqual(computeGate(input));
  });

  it('is order-independent — shuffled evidence yields an identical gate', () => {
    const ordered = [ev(3), ev(7), ev(18), ev(22)];
    const shuffled = [ev(22), ev(3), ev(18), ev(7)];
    expect(computeGate(shuffled)).toEqual(computeGate(ordered));
  });

  it('does not mutate its input array', () => {
    const input = [ev(7), ev(3)];
    const snapshot = input.map((e) => e.toolNumber);
    computeGate(input);
    expect(input.map((e) => e.toolNumber)).toEqual(snapshot);
  });

  it('counts a duplicated tool report once for the gate', () => {
    // Two frozen reports for tool 3 (e.g. a re-run) must not double-count.
    const gate = computeGate([ev(3), ev(3, { reportId: 'rpt_3b' }), ev(7)]);
    const s1 = gate.sections.find((s) => s.code === 'S1')!;
    expect(s1.completedTools).toEqual([3, 7]);
    expect(s1.covered).toBe(true);
  });
});

// ─────────────────────────────────────────────
// buildEvidenceItems — OB 3.0 projection
// ─────────────────────────────────────────────

const URN = 'urn:uuid:8f310e42-9a3b-417d-8622-4401a7bdf821';

describe('buildEvidenceItems', () => {
  it('returns an empty array for no evidence', () => {
    expect(buildEvidenceItems([], URN)).toEqual([]);
  });

  it('sorts items by tool number regardless of input order', () => {
    const items = buildEvidenceItems([ev(27), ev(3), ev(18)], URN);
    expect(items.map((i) => i['apa:toolNumber'])).toEqual([3, 18, 27]);
  });

  it('deep-links each item id back to the verify page anchor', () => {
    const [item] = buildEvidenceItems([ev(3)], URN);
    expect(item.id).toBe(`${URN}#tool-3`);
    expect(item.type).toEqual(['Evidence']);
    expect(item['apa:toolSlug']).toBe('tool-3');
    expect(item['apa:reportId']).toBe('rpt_3');
  });

  it('writes a scored narrative for FORM tools', () => {
    const [item] = buildEvidenceItems([ev(3, { score: 91 })], URN);
    expect(item.narrative).toBe('APA Tool #3 completed — alignment score 91/100.');
  });

  it('writes a completion-only narrative when the score is absent', () => {
    const [item] = buildEvidenceItems([ev(3, { category: 'GUIDE', score: undefined })], URN);
    expect(item.narrative).toBe('APA Tool #3 completed — working artifact on record.');
  });

  it('never emits an impossible score into the narrative (corrupted report)', () => {
    expect(buildEvidenceItems([ev(3, { score: NaN })], URN)[0].narrative).toBe(
      'APA Tool #3 completed — working artifact on record.',
    );
    expect(buildEvidenceItems([ev(3, { score: 150 })], URN)[0].narrative).toBe(
      'APA Tool #3 completed — alignment score 100/100.',
    );
  });
});

// ─────────────────────────────────────────────
// buildResultItems — C-SPA composite carried unmodified
// ─────────────────────────────────────────────

describe('buildResultItems', () => {
  it('carries the composite and maturity as stringified OB 3.0 results', () => {
    const results = buildResultItems(87, 'CSV_LEADER');
    expect(results).toEqual([
      { type: ['Result'], resultDescription: 'cspa-composite', value: '87', status: 'Completed' },
      { type: ['Result'], resultDescription: 'cspa-maturity', value: 'CSV_LEADER', status: 'Completed' },
    ]);
  });

  it('stringifies a zero composite', () => {
    expect(buildResultItems(0, 'TRADITIONAL')[0].value).toBe('0');
  });
});
