'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/infrastructure/prisma/client';
import type { Prisma } from '@/generated/prisma/client';
import { getSession } from '@/lib/session';
import { CSPA_VERSION, scoreRun } from '@/domain/cspa/engine';

const answersSchema = z.record(z.string(), z.number().int().min(0).max(3));

async function requireUser() {
  const session = await getSession();
  if (!session) throw new Error('UNAUTHENTICATED');
  return session.user;
}

async function getOrCreateDraft(userId: string) {
  const existing = await prisma.cspaRun.findFirst({
    where: { userId, status: 'DRAFT', version: CSPA_VERSION },
    orderBy: { updatedAt: 'desc' },
  });
  if (existing) return existing;
  return prisma.cspaRun.create({ data: { userId, version: CSPA_VERSION } });
}

export async function saveCspaDraft(rawAnswers: Record<string, number>, locale: string) {
  const user = await requireUser();
  const answers = answersSchema.parse(rawAnswers);
  const draft = await getOrCreateDraft(user.id);
  await prisma.cspaRun.update({
    where: { id: draft.id },
    data: { answers: answers as Prisma.InputJsonValue },
  });
  revalidatePath(`/${locale}/app/cspa`);
  return { ok: true as const };
}

export async function submitCspa(rawAnswers: Record<string, number>, locale: string) {
  const user = await requireUser();
  const answers = answersSchema.parse(rawAnswers);

  const questions = await prisma.cspaQuestion.findMany({
    where: { version: CSPA_VERSION },
    select: { id: true, section: true },
  });
  const unanswered = questions.filter((q) => answers[q.id] === undefined);
  if (unanswered.length > 0) {
    return { ok: false as const, unanswered: unanswered.length };
  }

  const result = scoreRun(questions, answers);
  const draft = await getOrCreateDraft(user.id);
  await prisma.cspaRun.update({
    where: { id: draft.id },
    data: {
      answers: answers as Prisma.InputJsonValue,
      sectionScores: result.sectionScores as Prisma.InputJsonValue,
      composite: result.composite,
      maturity: result.maturity,
      status: 'COMPLETED',
      completedAt: new Date(),
    },
  });
  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: 'cspa.run.complete',
      entityType: 'CspaRun',
      entityId: draft.id,
      diff: { composite: result.composite, maturity: result.maturity },
    },
  });
  revalidatePath(`/${locale}/app/cspa`);
  return { ok: true as const, composite: result.composite };
}

/** Start a fresh run (previous results are kept for history). */
export async function restartCspa(locale: string) {
  const user = await requireUser();
  await prisma.cspaRun.create({ data: { userId: user.id, version: CSPA_VERSION } });
  revalidatePath(`/${locale}/app/cspa`);
}
