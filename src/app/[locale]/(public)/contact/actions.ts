'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/infrastructure/prisma/client';

const THROTTLE_MAX = 5; // submissions / IP / hour
const ONE_HOUR = 60 * 60 * 1000;

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  organization: z.string().trim().max(160).optional().or(z.literal('')),
  country: z.string().trim().max(80).optional().or(z.literal('')),
  message: z.string().trim().min(10).max(4000),
});

const prequalSchema = contactSchema.omit({ message: true });

async function clientIp(): Promise<string | null> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? h.get('x-real-ip');
}

async function isThrottled(ip: string | null): Promise<boolean> {
  if (!ip) return false;
  const recent = await prisma.lead.count({
    where: { ipAddress: ip, createdAt: { gte: new Date(Date.now() - ONE_HOUR) } },
  });
  return recent >= THROTTLE_MAX;
}

export async function submitContact(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'fr');
  const back = (q: string) => redirect(`/${locale}/contact?${q}#contact-form`);

  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    organization: formData.get('organization'),
    country: formData.get('country'),
    message: formData.get('message'),
  });
  if (!parsed.success) back('err=invalid');

  const ip = await clientIp();
  if (await isThrottled(ip)) back('err=throttled');

  await prisma.lead.create({
    data: {
      type: 'CONTACT',
      name: parsed.data!.name,
      email: parsed.data!.email,
      organization: parsed.data!.organization || null,
      country: parsed.data!.country || null,
      message: parsed.data!.message,
      locale,
      ipAddress: ip,
    },
  });
  back('sent=1');
}

export async function submitPrequal(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'fr');
  const back = (q: string) => redirect(`/${locale}/contact?${q}#prequal-form`);

  const parsed = prequalSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    organization: formData.get('organization'),
    country: formData.get('country'),
  });
  if (!parsed.success) back('perr=invalid');

  const ip = await clientIp();
  if (await isThrottled(ip)) back('perr=throttled');

  await prisma.lead.create({
    data: {
      type: 'PREQUAL',
      name: parsed.data!.name,
      email: parsed.data!.email,
      organization: parsed.data!.organization || null,
      country: parsed.data!.country || null,
      locale,
      ipAddress: ip,
    },
  });
  back('deck=1');
}
