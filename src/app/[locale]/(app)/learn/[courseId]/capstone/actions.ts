'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/infrastructure/prisma/client';
import type { Prisma } from '@/generated/prisma/client';
import { getSession } from '@/lib/session';
import { resolveLearnerJourneyId } from '@/infrastructure/certification/learner-journey';
import { getCompletedToolNumbers } from '@/infrastructure/learning/completion';
import { getCapstonePrescore } from '@/application/ai/prescore-service';
import { checkCapstoneIntegrity, type IntegrityReport } from '@/domain/capstone/integrity';

async function resolveLearner(): Promise<string | null> {
  const session = await getSession();
  if (session) return session.user.id;
  if (process.env.NODE_ENV === 'production') return null;
  const demo = await prisma.user.findUnique({ where: { email: 'demo-holder@apa.test' }, select: { id: true } });
  return demo?.id ?? null;
}

async function ensureCapstone(journeyId: string, authorId: string) {
  const existing = await prisma.capstoneSubmission.findUnique({ where: { journeyId } });
  if (existing) return existing;
  return prisma.capstoneSubmission.create({ data: { journeyId, authorId, title: '', content: '' } });
}

const draftSchema = z.object({ title: z.string().max(200), content: z.string().max(50000), locale: z.string(), courseSlug: z.string() });

export async function saveCapstoneDraft(input: z.infer<typeof draftSchema>) {
  const learnerId = await resolveLearner();
  if (!learnerId) return { ok: false as const, reason: 'NO_LEARNER' };
  const journeyId = await resolveLearnerJourneyId(learnerId);
  if (!journeyId) return { ok: false as const, reason: 'NO_JOURNEY' };
  const { title, content, locale, courseSlug } = draftSchema.parse(input);

  const capstone = await ensureCapstone(journeyId, learnerId);
  if (capstone.status !== 'DRAFT' && capstone.status !== 'REJECTED') {
    return { ok: false as const, reason: 'LOCKED' };
  }
  await prisma.capstoneSubmission.update({ where: { id: capstone.id }, data: { title, content } });
  revalidatePath(`/${locale}/learn/${courseSlug}/capstone`);
  return { ok: true as const };
}

export type SubmitResult =
  | { ok: true; aiScore: number; integrity: IntegrityReport }
  | { ok: false; reason: 'NO_LEARNER' | 'NO_JOURNEY' | 'LOCKED' | 'INTEGRITY_FAILED'; integrity?: IntegrityReport };

export async function submitCapstone(input: z.infer<typeof draftSchema>): Promise<SubmitResult> {
  const learnerId = await resolveLearner();
  if (!learnerId) return { ok: false, reason: 'NO_LEARNER' };
  const journeyId = await resolveLearnerJourneyId(learnerId);
  if (!journeyId) return { ok: false, reason: 'NO_JOURNEY' };
  const { title, content, locale, courseSlug } = draftSchema.parse(input);

  const capstone = await ensureCapstone(journeyId, learnerId);
  if (capstone.status === 'SUBMITTED' || capstone.status === 'APPROVED') {
    return { ok: false, reason: 'LOCKED' };
  }

  // Integrity: tool completion + anti-plagiarism vs other journeys + length.
  const [completed, corpus] = await Promise.all([
    getCompletedToolNumbers(learnerId),
    prisma.capstoneSubmission.findMany({ where: { NOT: { journeyId } }, select: { content: true } }),
  ]);
  const integrity = checkCapstoneIntegrity({
    content,
    priorCorpus: corpus.map((c) => c.content).filter(Boolean),
    completedToolNumbers: completed,
  });
  const prescore = await getCapstonePrescore(content);

  if (!integrity.passed) {
    // Persist the draft + integrity report, but do NOT advance to SUBMITTED.
    await prisma.capstoneSubmission.update({
      where: { id: capstone.id },
      data: { title, content, integrity: integrity as unknown as Prisma.InputJsonValue },
    });
    await prisma.auditLog.create({
      data: { actorId: learnerId, action: 'capstone.integrity.fail', entityType: 'CapstoneSubmission', entityId: capstone.id, diff: { missingTools: integrity.missingTools, plagiarismFlag: integrity.plagiarismFlag, wordCount: integrity.wordCount } },
    });
    revalidatePath(`/${locale}/learn/${courseSlug}/capstone`);
    return { ok: false, reason: 'INTEGRITY_FAILED', integrity };
  }

  await prisma.$transaction([
    prisma.capstoneSubmission.update({
      where: { id: capstone.id },
      data: {
        title, content, status: 'SUBMITTED', submittedAt: new Date(), reviewVerdict: 'PENDING',
        aiScore: prescore.composite,
        aiBreakdown: prescore as unknown as Prisma.InputJsonValue,
        integrity: integrity as unknown as Prisma.InputJsonValue,
      },
    }),
    prisma.auditLog.create({
      data: { actorId: learnerId, action: 'capstone.submit', entityType: 'CapstoneSubmission', entityId: capstone.id, diff: { aiScore: prescore.composite, similarity: integrity.similarity } },
    }),
  ]);

  revalidatePath(`/${locale}/learn/${courseSlug}/capstone`);
  return { ok: true, aiScore: prescore.composite, integrity };
}
