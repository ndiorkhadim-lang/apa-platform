/**
 * Executive LMS — pure curriculum gating & progress.
 *
 * Sequential locks: a lesson unlocks only once every prior lesson is complete.
 * A TOOL lesson's completion is NOT self-declared — it is satisfied only when
 * the linked APA tool has a passing ToolReport. That is the exact same source
 * of truth the C-SPA evidence engine reads (domain/certification/evidence.ts),
 * so finishing a practical lock in the player directly feeds evidence[].
 *
 * Pure: the application layer supplies plain inputs (lessons + progress rows +
 * the set of completed tool numbers). No I/O here.
 */

export type LessonKind = 'READING' | 'TOOL' | 'ASSESSMENT';
export type LessonCompletion = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
export type LessonState = 'LOCKED' | 'AVAILABLE' | 'COMPLETED';

export interface LessonInput {
  id: string;
  kind: LessonKind;
  /** For TOOL lessons: the APA tool number that gates this lock. */
  toolNumber?: number;
  /** LessonProgress row status for READING/ASSESSMENT lessons. */
  progress?: LessonCompletion;
}

export interface ModuleInput {
  id: string;
  lessons: LessonInput[];
}

export interface CourseInput {
  modules: ModuleInput[];
}

export interface LessonView {
  id: string;
  moduleId: string;
  kind: LessonKind;
  toolNumber?: number;
  state: LessonState;
}

export interface CurriculumState {
  lessons: LessonView[];
  totalLessons: number;
  completedLessons: number;
  progressPct: number; // 0..100
  /** First AVAILABLE lesson — the resume point. Null when the course is done. */
  currentLessonId: string | null;
  /** TOOL lessons not yet completed — the outstanding practical locks. */
  pendingToolNumbers: number[];
  courseComplete: boolean;
}

/** A lesson is complete via its tool (TOOL) or its acknowledged progress. */
export function isLessonCompleted(lesson: LessonInput, completedTools: ReadonlySet<number>): boolean {
  if (lesson.kind === 'TOOL') {
    return lesson.toolNumber !== undefined && completedTools.has(lesson.toolNumber);
  }
  return lesson.progress === 'COMPLETED';
}

/**
 * Compute the full curriculum state. `completedToolNumbers` are the tools with
 * a passing ToolReport for the learner.
 */
export function computeCurriculumState(
  course: CourseInput,
  completedToolNumbers: Iterable<number>,
): CurriculumState {
  const completedTools = new Set(completedToolNumbers);
  const lessons: LessonView[] = [];
  const pendingToolNumbers: number[] = [];

  let allPriorCompleted = true;
  let completedLessons = 0;
  let currentLessonId: string | null = null;

  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      const completed = isLessonCompleted(lesson, completedTools);
      const state: LessonState = completed ? 'COMPLETED' : allPriorCompleted ? 'AVAILABLE' : 'LOCKED';

      lessons.push({
        id: lesson.id,
        moduleId: mod.id,
        kind: lesson.kind,
        toolNumber: lesson.toolNumber,
        state,
      });

      if (completed) {
        completedLessons += 1;
      } else {
        if (state === 'AVAILABLE' && currentLessonId === null) currentLessonId = lesson.id;
        if (lesson.kind === 'TOOL' && lesson.toolNumber !== undefined) {
          pendingToolNumbers.push(lesson.toolNumber);
        }
        allPriorCompleted = false; // everything after an incomplete lesson is locked
      }
    }
  }

  const totalLessons = lessons.length;
  return {
    lessons,
    totalLessons,
    completedLessons,
    progressPct: totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0,
    currentLessonId,
    pendingToolNumbers,
    courseComplete: totalLessons > 0 && completedLessons === totalLessons,
  };
}
