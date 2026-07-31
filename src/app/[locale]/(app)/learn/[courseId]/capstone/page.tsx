/**
 * /learn/[courseId]/capstone — Capstone Workbench (Jalon 2.3).
 * Submit the institutional transformation project; on submit it is integrity-
 * checked and AI pre-scored, then routed to an APA evaluator.
 */

import { setRequestLocale, getTranslations } from 'next-intl/server';
import { prisma, dbAvailable } from '@/infrastructure/prisma/client';
import { getSession } from '@/lib/session';
import { requireCandidate } from '@/lib/guards';
import { resolveLearnerJourneyId } from '@/infrastructure/certification/learner-journey';
import { CapstoneWorkbench, type CapstoneView } from '@/components/learn/capstone-workbench';

export const dynamic = 'force-dynamic';

async function resolveLearnerId(sessionUserId: string | undefined): Promise<string | null> {
  if (sessionUserId) return sessionUserId;
  if (process.env.NODE_ENV === 'production') return null;
  const demo = await prisma.user.findUnique({ where: { email: 'demo-holder@apa.test' }, select: { id: true } });
  return demo?.id ?? null;
}

export default async function CapstonePage({
  params,
}: {
  params: Promise<{ locale: string; courseId: string }>;
}) {
  const { locale, courseId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Capstone');
  await requireCandidate(locale, `/${locale}/learn/${courseId}/capstone`);

  const session = await getSession();
  const learnerId = dbAvailable ? await resolveLearnerId(session?.user?.id) : null;
  const journeyId = learnerId ? await resolveLearnerJourneyId(learnerId) : null;
  const capstone = journeyId
    ? await prisma.capstoneSubmission.findUnique({ where: { journeyId } })
    : null;

  const view: CapstoneView = {
    title: capstone?.title ?? '',
    content: capstone?.content ?? '',
    status: capstone?.status ?? 'DRAFT',
    aiScore: capstone?.aiScore ?? null,
    aiBreakdown: (capstone?.aiBreakdown as CapstoneView['aiBreakdown']) ?? null,
    integrity: (capstone?.integrity as CapstoneView['integrity']) ?? null,
    reviewVerdict: capstone?.reviewVerdict ?? 'PENDING',
    reviewNotes: capstone?.reviewNotes ?? null,
  };

  return (
    <main className="min-h-screen bg-black text-neutral-100">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-apa-gold-bright">{t('kicker')}</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{t('title')}</h1>
          </div>
          <a href={`/${locale}/learn/${courseId}`} className="rounded-md border border-[#262626] px-4 py-2 text-sm font-semibold text-neutral-300 hover:bg-neutral-900">← {t('backPlayer')}</a>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-neutral-400">{t('intro')}</p>

        <CapstoneWorkbench locale={locale} courseSlug={courseId} initial={view} />
      </div>
    </main>
  );
}
