'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/infrastructure/prisma/client';
import { getSession } from '@/lib/session';

const proposalSchema = z.object({
  title: z.string().min(4).max(160),
  roleTier: z.enum(['OBSERVER', 'PRACTITIONER', 'CO_ARCHITECT']),
  country: z.string().min(2).max(80),
  region: z.string().max(40).optional(),
  durationDays: z.coerce.number().int().min(1).max(60).optional(),
  priceUSD: z.coerce.number().int().min(0).max(1_000_000).optional(),
  themes: z.string().max(240).optional(),
  summary: z.string().min(120).max(4000),
});

/** Approved Journey Partner submits a proposal → enters APA review (never auto-published). */
export async function submitJourneyProposal(locale: string, formData: FormData) {
  const session = await getSession();
  const user = session?.user as { id?: string; journeyPartner?: boolean } | undefined;
  if (!user?.id || !user.journeyPartner) throw new Error('FORBIDDEN');

  const input = proposalSchema.parse({
    title: formData.get('title'),
    roleTier: formData.get('roleTier'),
    country: formData.get('country'),
    region: formData.get('region') || undefined,
    durationDays: formData.get('durationDays') || undefined,
    priceUSD: formData.get('priceUSD') || undefined,
    themes: formData.get('themes') || undefined,
    summary: formData.get('summary'),
  });

  const proposal = await prisma.journeyProposal.create({
    data: { partnerId: user.id, status: 'SUBMITTED', ...input },
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: 'journey.proposal.submit',
      entityType: 'JourneyProposal',
      entityId: proposal.id,
    },
  });

  revalidatePath(`/${locale}/journeys/partner`);
  return { ok: true as const };
}
