import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getCapstonePrescore } from '@/application/ai/prescore-service';
import { getLessonGuidance } from '@/application/ai/guidance-service';
import { buildPrescore } from '@/domain/capstone/prescoring';
import { buildLessonGuidance, type ConciergeContext } from '@/domain/learning/concierge';
import { llmAvailable } from '@/infrastructure/ai/anthropic';

/**
 * The AI adapter auto-switches on ANTHROPIC_API_KEY. With no key, the services
 * must return exactly the deterministic engine output (the offline default and
 * the guaranteed fallback). The live-model path is not exercised here — it would
 * require a real key and a network call.
 */

const savedKey = process.env.ANTHROPIC_API_KEY;

beforeEach(() => {
  delete process.env.ANTHROPIC_API_KEY;
});
afterEach(() => {
  if (savedKey === undefined) delete process.env.ANTHROPIC_API_KEY;
  else process.env.ANTHROPIC_API_KEY = savedKey;
});

describe('AI adapter — availability flag', () => {
  it('reports unavailable when no key is set', () => {
    expect(llmAvailable()).toBe(false);
  });
  it('reports unavailable for an empty/whitespace key', () => {
    process.env.ANTHROPIC_API_KEY = '   ';
    expect(llmAvailable()).toBe(false);
  });
  it('reports available when a key is present', () => {
    process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
    expect(llmAvailable()).toBe(true);
  });
});

describe('prescore-service — deterministic fallback (no key)', () => {
  it('matches buildPrescore exactly', async () => {
    const content = 'Shared value governance reform with community co-ownership and measurement.';
    expect(await getCapstonePrescore(content)).toEqual(buildPrescore(content));
  });
  it('matches buildPrescore for empty content', async () => {
    expect(await getCapstonePrescore('')).toEqual(buildPrescore(''));
  });
});

describe('guidance-service — deterministic fallback (no key)', () => {
  it('matches buildLessonGuidance exactly', async () => {
    const ctx: ConciergeContext = {
      locale: 'en',
      lessonTitle: 'Paradigm Choice',
      lessonKind: 'TOOL',
      lessonState: 'AVAILABLE',
      toolCategory: 'FORM',
      toolNumber: 3,
      domainName: 'Strategic Paradigm',
    };
    expect(await getLessonGuidance(ctx)).toEqual(buildLessonGuidance(ctx));
  });
});
