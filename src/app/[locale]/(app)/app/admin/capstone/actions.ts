'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/infrastructure/prisma/client';
import { getSession } from '@/lib/session';

/** APA evaluators: ADMIN_APA or AUDITOR may decide a capstone. */
async function requireEvaluator() {
  const session = await getSession();
  const role = (session?.user as { platformRole?: string } | undefined)?.platformRole;
  if (!session || (role !== 'ADMIN_APA' && role !== 'AUDITOR')) throw new Error('FORBIDDEN');
  return session.user.id;
}

const schema = z.object({
  capstoneId: z.string().min(1),
  verdict: z.enum(['APPROVED', 'REJECTED']),
  notes: z.string().max(4000).optional(),
  locale: z.string().min(1),
});

export async function reviewCapstone(input: z.infer<typeof schema>) {
  const reviewerId = await requireEvaluator();
  const { capstoneId, verdict, notes, locale } = schema.parse(input);

  const capstone = await prisma.capstoneSubmission.findUnique({ where: { id: capstoneId }, select: { status: true } });
  if (!capstone) return { ok: false as const, reason: 'NOT_FOUND' };
  if (capstone.status !== 'SUBMITTED') return { ok: false as const, reason: 'NOT_PENDING' };

  await prisma.$transaction([
    prisma.capstoneSubmission.update({
      where: { id: capstoneId },
      data: {
        status: verdict, // APPROVED | REJECTED
        reviewVerdict: verdict,
        reviewNotes: notes ?? null,
        reviewerId,
        decidedAt: new Date(),
      },
    }),
    prisma.auditLog.create({
      data: { actorId: reviewerId, action: 'capstone.review', entityType: 'CapstoneSubmission', entityId: capstoneId, diff: { verdict } },
    }),
  ]);

  revalidatePath(`/${locale}/app/admin/capstone`);
  return { ok: true as const };
}
