'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/infrastructure/prisma/client';
import type { Prisma } from '@/generated/prisma/client';
import { getSession } from '@/lib/session';
import { scoreFormAnswers } from '@/domain/tools/workspace-blueprint';

async function requireUser() {
  const session = await getSession();
  if (!session) throw new Error('UNAUTHENTICATED');
  return session.user.id;
}

/** Get or create the user's active session for a tool. */
export async function ensureSession(toolId: string) {
  const userId = await requireUser();
  const existing = await prisma.toolSession.findFirst({
    where: { userId, toolId, status: 'ACTIVE' },
    orderBy: { updatedAt: 'desc' },
  });
  if (existing) return existing.id;
  const created = await prisma.toolSession.create({ data: { userId, toolId } });
  return created.id;
}

const saveSchema = z.object({
  sessionId: z.string().min(1),
  slug: z.string().min(1),
  locale: z.string().min(1),
  data: z.record(z.string(), z.unknown()),
});

/** Save workspace inputs (autosave / explicit save). */
export async function saveSessionData(input: z.infer<typeof saveSchema>) {
  const userId = await requireUser();
  const { sessionId, data } = saveSchema.parse(input);
  const owned = await prisma.toolSession.findFirst({
    where: { id: sessionId, userId },
    select: { id: true },
  });
  if (!owned) throw new Error('FORBIDDEN');
  await prisma.toolSession.update({
    where: { id: sessionId },
    data: { data: data as Prisma.InputJsonValue },
  });
  revalidatePath(`/${input.locale}/app/tools/${input.slug}`);
}

/** Freeze a session into an exportable report (scored for FORM tools). */
export async function generateReport(input: {
  sessionId: string;
  slug: string;
  locale: string;
  title: string;
  category: 'FORM' | 'GUIDE' | 'LEGAL' | 'METRIC';
  data: Record<string, unknown>;
}) {
  const userId = await requireUser();
  const owned = await prisma.toolSession.findFirst({
    where: { id: input.sessionId, userId },
    select: { id: true },
  });
  if (!owned) throw new Error('FORBIDDEN');

  const content: Record<string, unknown> = { inputs: input.data };
  if (input.category === 'FORM') {
    const score = scoreFormAnswers(input.data);
    content.score = score;
    content.passed = score >= 70;
  }

  await prisma.toolReport.create({
    data: {
      sessionId: input.sessionId,
      title: input.title,
      content: content as Prisma.InputJsonValue,
    },
  });
  revalidatePath(`/${input.locale}/app/tools/${input.slug}`);
}
