'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/infrastructure/prisma/client';
import { getSession } from '@/lib/session';

const schema = z.object({
  proposalId: z.string().min(1),
  status: z.enum(['UNDER_REVIEW', 'REVISIONS_REQUESTED', 'APPROVED', 'PUBLISHED', 'REJECTED']),
  reviewNote: z.string().max(2000).optional(),
  locale: z.string(),
});

/** Admin advances a partner journey proposal through the governance workflow. */
export async function reviewProposal(formData: FormData) {
  const session = await getSession();
  const admin = session?.user as { id?: string; platformRole?: string } | undefined;
  if (!admin?.id || admin.platformRole !== 'ADMIN_APA') throw new Error('FORBIDDEN');

  const input = schema.parse({
    proposalId: formData.get('proposalId'),
    status: formData.get('status'),
    reviewNote: formData.get('reviewNote') || undefined,
    locale: formData.get('locale') ?? 'en',
  });

  const before = await prisma.journeyProposal.findUnique({ where: { id: input.proposalId }, select: { status: true } });
  if (!before) throw new Error('NOT_FOUND');

  await prisma.journeyProposal.update({
    where: { id: input.proposalId },
    data: { status: input.status, reviewNote: input.reviewNote },
  });
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: 'journey.proposal.review',
      entityType: 'JourneyProposal',
      entityId: input.proposalId,
      diff: { from: before.status, to: input.status },
    },
  });
  revalidatePath(`/${input.locale}/journeys/admin`);
}
