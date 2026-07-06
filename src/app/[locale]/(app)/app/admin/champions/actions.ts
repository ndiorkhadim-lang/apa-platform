'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/infrastructure/prisma/client';
import { sendEmail, emailTemplates } from '@/infrastructure/email/send';
import { getSession } from '@/lib/session';

async function requireAdmin() {
  const session = await getSession();
  const role = (session?.user as { platformRole?: string } | undefined)?.platformRole;
  if (!session || role !== 'ADMIN_APA') throw new Error('FORBIDDEN');
  return session.user;
}

const reviewSchema = z.object({
  applicationId: z.string().min(1),
  score: z.coerce.number().int().min(0).max(100).optional(),
  notes: z.string().max(4000).optional(),
  decision: z.enum(['SCREENING', 'INTERVIEW', 'ACCEPTED', 'REJECTED']).optional(),
  locale: z.string(),
});

/** Record a review and (optionally) advance the pipeline status. */
export async function reviewApplication(formData: FormData) {
  const admin = await requireAdmin();
  const input = reviewSchema.parse({
    applicationId: formData.get('applicationId'),
    score: formData.get('score') || undefined,
    notes: formData.get('notes') || undefined,
    decision: formData.get('decision') || undefined,
    locale: formData.get('locale') ?? 'fr',
  });

  const app = await prisma.championApplication.findUnique({
    where: { id: input.applicationId },
    include: { user: true },
  });
  if (!app) throw new Error('NOT_FOUND');

  await prisma.championReview.create({
    data: {
      applicationId: app.id,
      reviewerId: admin.id,
      score: input.score,
      notes: input.notes,
      decision: input.decision,
    },
  });

  if (input.decision && input.decision !== app.status) {
    await prisma.championApplication.update({
      where: { id: app.id },
      data: { status: input.decision },
    });
    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: 'champion.application.status',
        entityType: 'ChampionApplication',
        entityId: app.id,
        diff: { from: app.status, to: input.decision },
      },
    });
    const tpl = emailTemplates.championStatusChange(
      app.firstName ?? app.user.name,
      input.decision,
      input.locale
    );
    await sendEmail({ to: app.email ?? app.user.email, ...tpl });
  }

  revalidatePath(`/${input.locale}/app/admin/champions`);
}
