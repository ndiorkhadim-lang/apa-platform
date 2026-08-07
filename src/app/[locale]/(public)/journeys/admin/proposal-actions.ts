'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/infrastructure/prisma/client';
import { getSession } from '@/lib/session';

const reviewSchema = z.object({
  proposalId: z.string().min(1),
  status: z.enum(['UNDER_REVIEW', 'REVISIONS_REQUESTED', 'APPROVED', 'PUBLISHED', 'REJECTED']),
  reviewNote: z.string().max(2000).optional(),
  assignedReviewer: z.string().max(160).optional(),
  qualityScore: z.coerce.number().int().min(0).max(100).optional(),
  locale: z.string(),
});

/**
 * Admin advances a partner journey proposal through the governance workflow:
 * assign a reviewer, score quality, request changes, approve/publish/reject.
 * Approving (or publishing) also grants the submitter Partner status, which
 * unlocks their Partner Dashboard.
 */
export async function reviewProposal(formData: FormData) {
  const session = await getSession();
  const admin = session?.user as { id?: string; name?: string; platformRole?: string } | undefined;
  if (!admin?.id || admin.platformRole !== 'ADMIN_APA') throw new Error('FORBIDDEN');

  const input = reviewSchema.parse({
    proposalId: formData.get('proposalId'),
    status: formData.get('status'),
    reviewNote: formData.get('reviewNote') || undefined,
    assignedReviewer: formData.get('assignedReviewer') || undefined,
    qualityScore: formData.get('qualityScore') || undefined,
    locale: formData.get('locale') ?? 'en',
  });

  const before = await prisma.journeyProposal.findUnique({
    where: { id: input.proposalId },
    select: { status: true, partnerId: true },
  });
  if (!before) throw new Error('NOT_FOUND');

  const grants = input.status === 'APPROVED' || input.status === 'PUBLISHED';

  await prisma.$transaction(async (tx) => {
    await tx.journeyProposal.update({
      where: { id: input.proposalId },
      data: {
        status: input.status,
        reviewNote: input.reviewNote,
        assignedReviewerId: input.assignedReviewer,
        qualityScore: input.qualityScore,
        publishedAt: input.status === 'PUBLISHED' ? new Date() : undefined,
      },
    });

    // Optional reviewer note posted into the shared review thread.
    if (input.reviewNote) {
      await tx.journeyProposalComment.create({
        data: {
          proposalId: input.proposalId,
          authorId: admin.id!,
          authorName: admin.name ?? 'APA Reviewer',
          authorRole: 'APA',
          body: `[${input.status.replace('_', ' ')}] ${input.reviewNote}`,
        },
      });
    }

    // Journey approval → grant Partner status + mark the PARTNER application accepted.
    if (grants) {
      await tx.user.update({ where: { id: before.partnerId }, data: { journeyPartner: true } });
      await tx.championApplication.updateMany({
        where: { userId: before.partnerId, type: 'PARTNER' },
        data: { status: 'ACCEPTED' },
      });
    }

    await tx.auditLog.create({
      data: {
        actorId: admin.id!,
        action: grants ? 'journey.proposal.approve' : 'journey.proposal.review',
        entityType: 'JourneyProposal',
        entityId: input.proposalId,
        diff: { from: before.status, to: input.status },
      },
    });
  });

  revalidatePath(`/${input.locale}/journeys/admin`);
  revalidatePath(`/${input.locale}/journeys/partner`);
}

const commentSchema = z.object({
  proposalId: z.string().min(1),
  body: z.string().min(1).max(2000),
  locale: z.string(),
});

/** Admin posts a comment into a proposal's review thread. */
export async function addProposalComment(formData: FormData) {
  const session = await getSession();
  const admin = session?.user as { id?: string; name?: string; platformRole?: string } | undefined;
  if (!admin?.id || admin.platformRole !== 'ADMIN_APA') throw new Error('FORBIDDEN');

  const input = commentSchema.parse({
    proposalId: formData.get('proposalId'),
    body: formData.get('body'),
    locale: formData.get('locale') ?? 'en',
  });

  await prisma.journeyProposalComment.create({
    data: {
      proposalId: input.proposalId,
      authorId: admin.id,
      authorName: admin.name ?? 'APA Reviewer',
      authorRole: 'APA',
      body: input.body,
    },
  });
  revalidatePath(`/${input.locale}/journeys/admin`);
  revalidatePath(`/${input.locale}/journeys/partner`);
}
