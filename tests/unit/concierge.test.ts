import { describe, it, expect } from 'vitest';
import { buildLessonGuidance } from '@/domain/learning/concierge';

describe('buildLessonGuidance', () => {
  it('explains the lock for a LOCKED lesson', () => {
    const g = buildLessonGuidance({ locale: 'en', lessonTitle: 'X', lessonKind: 'READING', lessonState: 'LOCKED' });
    expect(g.headline).toMatch(/locked/i);
    expect(g.steps.join(' ')).toMatch(/previous lesson/i);
  });

  it('guides a TOOL lesson with category-specific action and evidence framing', () => {
    const g = buildLessonGuidance({
      locale: 'en', lessonTitle: 'Paradigm', lessonKind: 'TOOL', lessonState: 'AVAILABLE',
      toolCategory: 'FORM', toolNumber: 3, domainName: 'Strategic Paradigm',
    });
    expect(g.headline).toMatch(/#3/);
    expect(g.headline).toMatch(/Strategic Paradigm/);
    expect(g.steps.join(' ')).toMatch(/≥ 70/); // FORM-specific
    expect(g.steps.join(' ')).toMatch(/evidence|C-SPA/i);
  });

  it('varies the action by tool category', () => {
    const legal = buildLessonGuidance({ locale: 'en', lessonTitle: 'C', lessonKind: 'TOOL', lessonState: 'AVAILABLE', toolCategory: 'LEGAL', toolNumber: 1 });
    expect(legal.steps.join(' ')).toMatch(/clause|counsel/i);
    const metric = buildLessonGuidance({ locale: 'en', lessonTitle: 'M', lessonKind: 'TOOL', lessonState: 'AVAILABLE', toolCategory: 'METRIC', toolNumber: 2 });
    expect(metric.steps.join(' ')).toMatch(/measured|baseline/i);
  });

  it('guides a READING lesson toward completion', () => {
    const g = buildLessonGuidance({ locale: 'en', lessonTitle: 'Intro', lessonKind: 'READING', lessonState: 'AVAILABLE' });
    expect(g.steps.join(' ')).toMatch(/mark the lesson as read/i);
  });

  it('localizes to French', () => {
    const g = buildLessonGuidance({ locale: 'fr', lessonTitle: 'Intro', lessonKind: 'READING', lessonState: 'AVAILABLE' });
    expect(g.steps.join(' ')).toMatch(/lue/i);
  });
});
