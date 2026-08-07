/**
 * /learn/[courseId] — Executive Learning Player (Jalon 2.2).
 *
 * RSC: loads the curriculum, the learner's lesson progress and completed tools,
 * computes gating (domain/learning/curriculum.ts), and hands a serializable
 * view-model to the client player. TOOL lessons are practical locks whose
 * completion (a passing ToolReport) also feeds the C-SPA evidence engine.
 */

import { setRequestLocale, getTranslations } from 'next-intl/server';
import { prisma, dbAvailable } from '@/infrastructure/prisma/client';
import { getSession } from '@/lib/session';
import { requireCandidate } from '@/lib/guards';
import { PREVIEW_ACCESS } from '@/lib/demo';
import { getCompletedToolNumbers } from '@/infrastructure/learning/completion';
import { computeCurriculumState, type CourseInput, type LessonState } from '@/domain/learning/curriculum';
import { CoursePlayer, type PlayerModule } from '@/components/learn/course-player';

export const dynamic = 'force-dynamic';

/** Dev-only preview identity so the player is demoable without an auth session. */
async function resolveLearnerId(sessionUserId: string | undefined): Promise<string | null> {
  if (sessionUserId) return sessionUserId;
  if (!PREVIEW_ACCESS) return null;
  const demo = await prisma.user.findUnique({ where: { email: 'demo-holder@apa.test' }, select: { id: true } });
  return demo?.id ?? null;
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ locale: string; courseId: string }>;
}) {
  const { locale, courseId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('LearnPlayer');
  // RBAC: authenticated candidate (redirects to sign-in in production).
  await requireCandidate(locale, `/${locale}/learn/${courseId}`);

  const course = dbAvailable
    ? await prisma.course.findUnique({
        where: { slug: courseId },
        include: {
          modules: {
            orderBy: { order: 'asc' },
            include: {
              lessons: {
                orderBy: { order: 'asc' },
                include: { tool: { select: { number: true, slug: true, nameEn: true, nameFr: true, category: true } } },
              },
            },
          },
        },
      })
    : null;

  if (!course) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black p-8">
        <div className="rounded-2xl border border-[#262626] bg-neutral-950 p-8 text-center">
          <p className="text-4xl font-black text-neutral-700">∅</p>
          <h1 className="mt-4 text-lg font-bold text-white">{t('notFound.title')}</h1>
          <p className="mt-2 max-w-md text-sm text-neutral-400">{t('notFound.detail', { id: courseId })}</p>
        </div>
      </main>
    );
  }

  const session = await getSession();
  const learnerId = await resolveLearnerId(session?.user?.id);

  const [progressRows, completedTools] = await Promise.all([
    learnerId
      ? prisma.lessonProgress.findMany({ where: { userId: learnerId }, select: { lessonId: true, status: true } })
      : Promise.resolve([]),
    learnerId ? getCompletedToolNumbers(learnerId) : Promise.resolve(new Set<number>()),
  ]);
  const progressByLesson = new Map(progressRows.map((p) => [p.lessonId, p.status]));

  const courseInput: CourseInput = {
    modules: course.modules.map((m) => ({
      id: m.id,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        kind: l.kind,
        toolNumber: l.tool?.number,
        progress: progressByLesson.get(l.id) ?? 'NOT_STARTED',
      })),
    })),
  };
  const curriculum = computeCurriculumState(courseInput, completedTools);
  const stateById = new Map<string, LessonState>(curriculum.lessons.map((l) => [l.id, l.state]));

  const modules: PlayerModule[] = course.modules.map((m) => ({
    id: m.id,
    title: locale === 'en' ? m.titleEn : m.titleFr,
    lessons: m.lessons.map((l) => ({
      id: l.id,
      kind: l.kind,
      title: locale === 'en' ? l.titleEn : l.titleFr,
      body: locale === 'en' ? l.bodyEn : l.bodyFr,
      toolNumber: l.tool?.number,
      toolSlug: l.tool?.slug,
      toolName: l.tool ? (locale === 'en' ? l.tool.nameEn : l.tool.nameFr) : undefined,
      toolCategory: l.tool?.category,
      state: stateById.get(l.id) ?? 'LOCKED',
    })),
  }));

  return (
    <CoursePlayer
      locale={locale}
      courseSlug={course.slug}
      courseTitle={locale === 'en' ? course.titleEn : course.titleFr}
      modules={modules}
      progressPct={curriculum.progressPct}
      currentLessonId={curriculum.currentLessonId}
      authed={Boolean(session)}
    />
  );
}
