/**
 * /app/admin/capstone — APA evaluator interface (Jalon 2.3, objective 4).
 * Lists submitted capstones with AI pre-score + integrity, for APPROVE/REJECT.
 * ADMIN_APA or AUDITOR only.
 */

import { setRequestLocale, getTranslations } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { prisma, dbAvailable } from '@/infrastructure/prisma/client';
import { getSession } from '@/lib/session';
import { CapstoneReviewCard, type ReviewCardData } from '@/components/admin/capstone-review-card';
import type { IntegrityReport } from '@/domain/capstone/integrity';

export const dynamic = 'force-dynamic';

export default async function AdminCapstonePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('CapstoneReview');

  const session = await getSession();
  const role = (session?.user as { platformRole?: string } | undefined)?.platformRole;
  if (session && role !== 'ADMIN_APA' && role !== 'AUDITOR') redirect({ href: '/app', locale });

  const pending = dbAvailable
    ? await prisma.capstoneSubmission.findMany({
        where: { status: 'SUBMITTED' },
        orderBy: { submittedAt: 'asc' },
        include: { author: { select: { name: true } }, journey: { include: { org: { select: { name: true } } } } },
      })
    : [];

  const cards: ReviewCardData[] = pending.map((c) => {
    const integ = c.integrity as unknown as IntegrityReport | null;
    return {
      id: c.id,
      title: c.title,
      author: c.author.name,
      org: c.journey.org.name,
      aiScore: c.aiScore,
      toolsComplete: integ?.toolsComplete ?? false,
      similarityPct: integ ? Math.round(integ.similarity * 100) : 0,
      wordCount: integ?.wordCount ?? 0,
      contentExcerpt: c.content.slice(0, 400),
    };
  });

  return (
    <main className="min-h-screen bg-black text-neutral-100">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-apa-gold-bright">{t('kicker')}</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{t('title')}</h1>
        <p className="mt-2 text-sm text-neutral-400">{t('subtitle', { n: cards.length })}</p>

        <div className="mt-8 space-y-4">
          {cards.length === 0 && <p className="text-neutral-500">{t('empty')}</p>}
          {cards.map((c) => (
            <CapstoneReviewCard key={c.id} locale={locale} data={c} />
          ))}
        </div>
      </div>
    </main>
  );
}
