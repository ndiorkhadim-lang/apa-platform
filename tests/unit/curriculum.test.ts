import { describe, it, expect } from 'vitest';
import {
  computeCurriculumState,
  isLessonCompleted,
  type CourseInput,
} from '@/domain/learning/curriculum';

// R1(read) → T1(tool #3) → R2(read) → T2(tool #7)
function course(): CourseInput {
  return {
    modules: [
      {
        id: 'm1',
        lessons: [
          { id: 'r1', kind: 'READING', progress: 'IN_PROGRESS' },
          { id: 't1', kind: 'TOOL', toolNumber: 3 },
        ],
      },
      {
        id: 'm2',
        lessons: [
          { id: 'r2', kind: 'READING', progress: 'IN_PROGRESS' },
          { id: 't2', kind: 'TOOL', toolNumber: 7 },
        ],
      },
    ],
  };
}

function stateById(s: ReturnType<typeof computeCurriculumState>) {
  return Object.fromEntries(s.lessons.map((l) => [l.id, l.state]));
}

describe('isLessonCompleted', () => {
  it('completes a TOOL lesson only when its tool is in the completed set', () => {
    expect(isLessonCompleted({ id: 't', kind: 'TOOL', toolNumber: 3 }, new Set([3]))).toBe(true);
    expect(isLessonCompleted({ id: 't', kind: 'TOOL', toolNumber: 3 }, new Set([9]))).toBe(false);
  });
  it('completes a READING lesson only when progress is COMPLETED', () => {
    expect(isLessonCompleted({ id: 'r', kind: 'READING', progress: 'COMPLETED' }, new Set())).toBe(true);
    expect(isLessonCompleted({ id: 'r', kind: 'READING', progress: 'IN_PROGRESS' }, new Set())).toBe(false);
  });
});

describe('computeCurriculumState — sequential gating', () => {
  it('unlocks only the first lesson at the start', () => {
    const s = computeCurriculumState(course(), []);
    expect(stateById(s)).toEqual({ r1: 'AVAILABLE', t1: 'LOCKED', r2: 'LOCKED', t2: 'LOCKED' });
    expect(s.currentLessonId).toBe('r1');
    expect(s.progressPct).toBe(0);
    expect(s.courseComplete).toBe(false);
  });

  it('a TOOL lock blocks the rest until the tool is completed', () => {
    // r1 read, but tool #3 not completed → t1 available, r2/t2 locked.
    const c = course();
    c.modules[0].lessons[0].progress = 'COMPLETED';
    const s = computeCurriculumState(c, []);
    expect(stateById(s)).toEqual({ r1: 'COMPLETED', t1: 'AVAILABLE', r2: 'LOCKED', t2: 'LOCKED' });
    expect(s.currentLessonId).toBe('t1');
    expect(s.pendingToolNumbers).toEqual([3, 7]);
  });

  it('completing the tool unlocks the next lesson', () => {
    const c = course();
    c.modules[0].lessons[0].progress = 'COMPLETED';
    const s = computeCurriculumState(c, [3]); // tool #3 now done
    expect(stateById(s)).toEqual({ r1: 'COMPLETED', t1: 'COMPLETED', r2: 'AVAILABLE', t2: 'LOCKED' });
    expect(s.currentLessonId).toBe('r2');
    expect(s.pendingToolNumbers).toEqual([7]); // only #7 remains
    expect(s.progressPct).toBe(50);
  });

  it('marks the course complete when every lesson is done', () => {
    const c = course();
    c.modules[0].lessons[0].progress = 'COMPLETED';
    c.modules[1].lessons[0].progress = 'COMPLETED';
    const s = computeCurriculumState(c, [3, 7]);
    expect(s.courseComplete).toBe(true);
    expect(s.currentLessonId).toBeNull();
    expect(s.pendingToolNumbers).toEqual([]);
    expect(s.progressPct).toBe(100);
  });

  it('handles an empty course without dividing by zero', () => {
    const s = computeCurriculumState({ modules: [] }, []);
    expect(s).toMatchObject({ progressPct: 0, courseComplete: false, currentLessonId: null });
  });

  it('does not mark a TOOL lesson complete from progress alone (tool is the gate)', () => {
    const c: CourseInput = { modules: [{ id: 'm', lessons: [{ id: 't', kind: 'TOOL', toolNumber: 5, progress: 'COMPLETED' }] }] };
    const s = computeCurriculumState(c, []); // progress says COMPLETED but tool not done
    expect(stateById(s)).toEqual({ t: 'AVAILABLE' });
    expect(s.courseComplete).toBe(false);
  });
});
