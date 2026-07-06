'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/infrastructure/prisma/client';
import { sendEmail, emailTemplates } from '@/infrastructure/email/send';
import { getSession } from '@/lib/session';
import type { Prisma } from '@/generated/prisma/client';

const WORD_LIMIT = 1000;

const draftSchema = z.object({
  firstName: z.string().max(80).optional(),
  lastName: z.string().max(80).optional(),
  gender: z.string().max(30).optional(),
  dateOfBirth: z.string().max(20).optional(),
  nationality: z.string().max(80).optional(),
  countryResidence: z.string().max(80).optional(),
  city: z.string().max(80).optional(),
  phone: z.string().max(40).optional(),
  email: z.string().max(200).optional(),
  linkedin: z.string().max(300).optional(),
  website: z.string().max(300).optional(),
  position: z.string().max(160).optional(),
  organization: z.string().max(160).optional(),
  industry: z.string().max(120).optional(),
  yearsExperience: z.coerce.number().int().min(0).max(60).optional(),
  education: z.string().max(160).optional(),
  certifications: z.string().max(500).optional(),
  languages: z.string().max(200).optional(),
  expertise: z.string().max(500).optional(),
  motivationWhy: z.string().max(8000).optional(),
  motivationLeadership: z.string().max(8000).optional(),
  motivationImpact: z.string().max(8000).optional(),
  motivationValue: z.string().max(8000).optional(),
  cvUrl: z.string().max(500).optional(),
  coverLetterUrl: z.string().max(500).optional(),
  idDocUrl: z.string().max(500).optional(),
  certificatesUrl: z.string().max(500).optional(),
  recommendationUrl: z.string().max(500).optional(),
  portfolioUrl: z.string().max(500).optional(),
  acceptEthics: z.boolean().optional(),
  acceptPrivacy: z.boolean().optional(),
  acceptResponsibilities: z.boolean().optional(),
  signature: z.string().max(160).optional(),
});

export type DraftInput = z.infer<typeof draftSchema>;

async function requireUser() {
  const session = await getSession();
  if (!session) throw new Error('UNAUTHENTICATED');
  return session.user;
}

function wordCount(...texts: (string | undefined)[]): number {
  return texts
    .filter(Boolean)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Create-or-update the caller's draft (Save Draft / Resume Later). */
export async function saveDraft(input: DraftInput, locale: string) {
  const user = await requireUser();
  const data = draftSchema.parse(input);

  const app = await prisma.championApplication.upsert({
    where: { userId: user.id },
    update: data as Prisma.ChampionApplicationUpdateInput,
    create: { userId: user.id, email: user.email, ...data },
  });

  if (app.status !== 'DRAFT') throw new Error('ALREADY_SUBMITTED');
  revalidatePath(`/${locale}/champions/apply`);
  return { ok: true as const, applicationId: app.id };
}

const REQUIRED_FOR_SUBMIT = [
  'firstName',
  'lastName',
  'nationality',
  'countryResidence',
  'city',
  'phone',
  'email',
  'position',
  'organization',
  'yearsExperience',
  'education',
  'languages',
  'expertise',
  'motivationWhy',
  'motivationLeadership',
  'motivationImpact',
  'motivationValue',
  'cvUrl',
  'signature',
] as const;

/** Submit: validates completeness, word limit and declarations, then locks the file. */
export async function submitApplication(input: DraftInput, locale: string) {
  const user = await requireUser();
  const data = draftSchema.parse(input);

  const missing = REQUIRED_FOR_SUBMIT.filter((k) => {
    const v = data[k as keyof DraftInput];
    return v === undefined || v === null || String(v).trim() === '';
  });
  if (!data.acceptEthics || !data.acceptPrivacy || !data.acceptResponsibilities) {
    missing.push('declarations' as (typeof REQUIRED_FOR_SUBMIT)[number]);
  }
  if (missing.length > 0) return { ok: false as const, missing };

  const words = wordCount(
    data.motivationWhy,
    data.motivationLeadership,
    data.motivationImpact,
    data.motivationValue
  );
  if (words > WORD_LIMIT) {
    return { ok: false as const, missing: [], wordCount: words, limit: WORD_LIMIT };
  }

  const existing = await prisma.championApplication.findUnique({
    where: { userId: user.id },
    select: { status: true },
  });
  if (existing && existing.status !== 'DRAFT') throw new Error('ALREADY_SUBMITTED');

  const app = await prisma.championApplication.upsert({
    where: { userId: user.id },
    update: {
      ...(data as Prisma.ChampionApplicationUpdateInput),
      status: 'SUBMITTED',
      submittedAt: new Date(),
    },
    create: {
      userId: user.id,
      ...data,
      status: 'SUBMITTED',
      submittedAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: 'champion.application.submit',
      entityType: 'ChampionApplication',
      entityId: app.id,
    },
  });

  const tpl = emailTemplates.championSubmitted(data.firstName ?? user.name, locale);
  await sendEmail({ to: data.email ?? user.email, ...tpl });

  revalidatePath(`/${locale}/champions/apply`);
  return { ok: true as const, applicationId: app.id };
}
