'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/infrastructure/prisma/client';
import { sendEmail, emailTemplates } from '@/infrastructure/email/send';
import { getSession } from '@/lib/session';

/**
 * APA "Apply as a Journey Partner" — unified intelligent intake.
 *
 * A single submission creates:
 *   • a PARTNER ChampionApplication (organization, legal rep, GRC mandates, org-type tags)
 *   • the applicant's FIRST JourneyProposal (fully tagged: themes, audience, SDGs,
 *     framework modules, applicable APA tools, outcomes, community partners, …)
 *
 * Both enter APA governance review together. Admin approval grants Partner
 * status (User.journeyPartner = true), unlocking the Partner Dashboard.
 */
const strArr = z.array(z.string().max(160)).max(60).default([]);

const schema = z.object({
  // §Organization
  organization: z.string().min(2).max(200),
  orgTypeTags: strArr,
  country: z.string().min(2).max(80),
  regionalHub: z.string().min(1).max(80),
  regNumber: z.string().min(2).max(120),
  legalRepName: z.string().min(2).max(160),
  legalRepTitle: z.string().min(2).max(160),
  email: z.string().email().max(200),
  phone: z.string().min(4).max(40),
  website: z.string().max(300).optional().default(''),
  linkedin: z.string().max(300).optional().default(''),

  // §Ethics & GRC
  acceptKinship: z.boolean(),
  acceptPayParity: z.boolean(),
  acceptCVP: z.boolean(),
  licenseFileName: z.string().max(300).optional().default(''),

  // §First Strategic Journey
  jTitle: z.string().min(4).max(200),
  jSector: z.string().min(1).max(120),
  jDurationDays: z.coerce.number().int().min(1).max(60),
  jMaxCapacity: z.coerce.number().int().min(1).max(500),
  jLocation: z.string().min(2).max(200),
  jItinerary: z.string().min(60).max(6000),
  themeTags: strArr,
  audienceTags: strArr,
  languages: strArr,
  sdgs: strArr,
  frameworkModules: strArr,
  toolNumbers: z.array(z.coerce.number().int().min(1).max(63)).max(63).default([]),
  communityPartners: strArr,
  expectedOutcomes: strArr,
  travelType: z.string().max(80).optional().default(''),
  difficulty: z.string().max(40).optional().default(''),
  certificationAlignment: z.string().max(60).optional().default(''),

  locale: z.string().default('en'),
});

export type PartnerSubmitResult =
  | { ok: true }
  | { ok: false; error: 'mandates' | 'already_submitted' | 'invalid' };

export async function submitPartnerApplication(formData: FormData): Promise<PartnerSubmitResult> {
  const session = await getSession();
  const user = session?.user as { id?: string; email?: string } | undefined;
  if (!user?.id) throw new Error('UNAUTHENTICATED');

  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get('payload') ?? '{}'));
  } catch {
    return { ok: false, error: 'invalid' };
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: 'invalid' };
  const input = parsed.data;

  if (!input.acceptKinship || !input.acceptPayParity || !input.acceptCVP) {
    return { ok: false, error: 'mandates' };
  }

  const existing = await prisma.championApplication.findUnique({
    where: { userId_type: { userId: user.id, type: 'PARTNER' } },
    select: { status: true },
  });
  if (existing && existing.status !== 'DRAFT') return { ok: false, error: 'already_submitted' };

  const appData = {
    firstName: input.legalRepName,
    position: input.legalRepTitle,
    email: input.email || user.email,
    phone: input.phone,
    organization: input.organization,
    orgTypeTags: input.orgTypeTags,
    industry: input.orgTypeTags[0] ?? null,
    countryResidence: input.country,
    regionalHub: input.regionalHub,
    website: input.website || null,
    linkedin: input.linkedin || null,
    certifications: `Legal Registration / Tax ID: ${input.regNumber}`,
    certificatesUrl: input.licenseFileName || null,
    acceptEthics: input.acceptKinship,
    acceptResponsibilities: input.acceptPayParity,
    acceptPrivacy: input.acceptCVP,
    signature: input.legalRepName,
  };

  const region = REGION_OF[input.country] ?? null;

  await prisma.$transaction(async (tx) => {
    await tx.championApplication.upsert({
      where: { userId_type: { userId: user.id!, type: 'PARTNER' } },
      update: { status: 'SUBMITTED', submittedAt: new Date(), ...appData },
      create: { userId: user.id!, type: 'PARTNER', status: 'SUBMITTED', submittedAt: new Date(), ...appData },
    });

    await tx.journeyProposal.create({
      data: {
        partnerId: user.id!,
        status: 'SUBMITTED',
        roleTier: 'OBSERVER',
        title: input.jTitle,
        sector: input.jSector,
        country: input.country,
        region,
        durationDays: input.jDurationDays,
        maxCapacity: input.jMaxCapacity,
        location: input.jLocation,
        summary: input.jItinerary,
        themes: input.themeTags.join(', '),
        themeTags: input.themeTags,
        audienceTags: input.audienceTags,
        languages: input.languages,
        sdgs: input.sdgs,
        frameworkModules: input.frameworkModules,
        toolNumbers: input.toolNumbers,
        communityPartners: input.communityPartners,
        expectedOutcomes: input.expectedOutcomes,
        travelType: input.travelType || null,
        difficulty: input.difficulty || null,
        certificationAlignment: input.certificationAlignment || null,
      },
    });

    await tx.auditLog.create({
      data: { actorId: user.id!, action: 'journey.partner.apply', entityType: 'ChampionApplication', entityId: user.id! },
    });
  });

  const tpl = emailTemplates.championSubmitted(input.legalRepName, input.locale, 'PARTNER');
  await sendEmail({ to: appData.email!, ...tpl });

  revalidatePath(`/${input.locale}/journeys/partner`);
  return { ok: true };
}

// Country → APA region, mirrors PRIORITY_COUNTRIES groupings.
const REGION_OF: Record<string, string> = {
  Nigeria: 'West', Ghana: 'West', Senegal: 'West', "Côte d'Ivoire": 'West', 'Côte d’Ivoire': 'West',
  Benin: 'West', Guinea: 'West', Togo: 'West', Gambia: 'West', Mali: 'West',
  Kenya: 'East', Ethiopia: 'East', Tanzania: 'East', Rwanda: 'East', Uganda: 'East', Mauritius: 'East',
  Cameroon: 'Central', 'DR Congo': 'Central', Gabon: 'Central', Chad: 'Central',
  Morocco: 'North', Egypt: 'North', Tunisia: 'North', Algeria: 'North',
  'South Africa': 'Southern', Zambia: 'Southern', Zimbabwe: 'Southern', Mozambique: 'Southern',
  Botswana: 'Southern', Namibia: 'Southern',
};
