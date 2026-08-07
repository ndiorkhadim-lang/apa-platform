import { describe, it, expect } from 'vitest';
import { computePremiumTelemetry, MAX_BPS, GATE_BPS, MAX_VALUATION_USD } from '@/domain/certification/premium-telemetry';
import { scoreRun } from '@/domain/cspa/engine';
import { CSPA_QUESTION_BANK, blankAnswers, LIKERT } from '@/domain/cspa/question-bank';

describe('computePremiumTelemetry', () => {
  it('is zero at composite 0 and clamps negatives', () => {
    const t = computePremiumTelemetry(-5);
    expect(t.composite).toBe(0);
    expect(t.bpsCompression).toBe(0);
    expect(t.valuationUpliftUsd).toBe(0);
    expect(t.gatePassed).toBe(false);
  });
  it('hits exactly GATE_BPS at the pass gate (70)', () => {
    expect(computePremiumTelemetry(70).bpsCompression).toBe(GATE_BPS);
    expect(computePremiumTelemetry(70).gatePassed).toBe(true);
  });
  it('tops out at MAX_BPS / MAX_VALUATION at 100 and clamps >100', () => {
    const t = computePremiumTelemetry(120);
    expect(t.composite).toBe(100);
    expect(t.bpsCompression).toBe(MAX_BPS);
    expect(t.valuationUpliftUsd).toBe(MAX_VALUATION_USD);
  });
  it('monotonically increases bps with composite', () => {
    const seq = [0, 30, 70, 85, 100].map((c) => computePremiumTelemetry(c).bpsCompression);
    for (let i = 1; i < seq.length; i++) expect(seq[i]).toBeGreaterThan(seq[i - 1]);
  });
});

describe('CSPA_QUESTION_BANK wires the real engine', () => {
  it('has 2 questions per section, all valid Likert range', () => {
    expect(CSPA_QUESTION_BANK).toHaveLength(12);
    expect(LIKERT).toHaveLength(4);
  });
  it('blank answers score to composite 0 (Traditional)', () => {
    const r = scoreRun(CSPA_QUESTION_BANK, blankAnswers());
    expect(r.composite).toBe(0);
    expect(r.passed).toBe(false);
  });
  it('all-max answers pass the gate as CSV_LEADER (composite 100)', () => {
    const maxed = Object.fromEntries(CSPA_QUESTION_BANK.map((q) => [q.id, 3]));
    const r = scoreRun(CSPA_QUESTION_BANK, maxed);
    expect(r.composite).toBe(100);
    expect(r.passed).toBe(true);
    expect(r.maturity).toBe('CSV_LEADER');
  });
});
