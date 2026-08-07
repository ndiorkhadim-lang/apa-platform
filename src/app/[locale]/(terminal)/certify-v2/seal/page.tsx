import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { setRequestLocale } from 'next-intl/server';
import { prisma, dbAvailable } from '@/infrastructure/prisma/client';
import { toCertificateViewModel } from '@/domain/certification/certificate-view-model';
import { qrSvg } from '@/infrastructure/pdf/qr';
import { StepHeader } from '@/components/terminal/step-header';
import { HoloSeal, type HoloSealProps } from '@/components/terminal/holo-seal';
import type { SignedCredential } from '@/domain/certification/credential';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Authenticity Seal · APA Terminal', robots: { index: false } };

const DEMO_SERIAL = 'APA-2026-SN-000001';

async function baseUrl(): Promise<string> {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (env) return env;
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'https';
  return host ? `${proto}://${host}` : '';
}

export default async function Step5({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';

  const record = dbAvailable
    ? await prisma.certificate.findFirst({
        where: { publicNumber: DEMO_SERIAL },
        select: { publicNumber: true, document: true },
      })
    : null;

  const base = await baseUrl();
  let seal: Omit<HoloSealProps, 'fr'>;

  if (record) {
    const vm = toCertificateViewModel(record.document as unknown as SignedCredential);
    const verifyUrl = `${base}/${locale}/verify/${record.publicNumber}`;
    seal = {
      holderName: vm.holderName,
      achievementName: vm.achievementName,
      composite: vm.composite,
      maturity: vm.maturity,
      serial: record.publicNumber ?? DEMO_SERIAL,
      issuerName: vm.issuerName,
      issuerDid: vm.issuerDid,
      proofValue: vm.proofValue,
      validUntil: vm.validUntil,
      qr: await qrSvg(verifyUrl, { dark: '#0B3D2E' }),
      verifyUrl,
    };
  } else {
    // Resilient demo fallback (page renders even without a seeded DB).
    const verifyUrl = `${base}/${locale}/verify/${DEMO_SERIAL}`;
    seal = {
      holderName: fr ? 'Ministère des Finances (démo)' : 'Ministry of Finance (Demo)',
      achievementName: 'Certified Institutional Transformation Strategist (CITS)',
      composite: 87,
      maturity: 'TRANSFORMATIONAL',
      serial: DEMO_SERIAL,
      issuerName: 'African Public Administration Institute',
      issuerDid: 'did:web:apa-platform-five.vercel.app',
      proofValue: 'z4DVR3WnyDkj1t6ucxZwRf46preview',
      validUntil: '2029-08-02T00:00:00.000Z',
      qr: await qrSvg(verifyUrl, { dark: '#0B3D2E' }),
      verifyUrl,
    };
  }

  return (
    <div>
      <StepHeader n={5} fr={fr} />
      <HoloSeal fr={fr} {...seal} />
    </div>
  );
}
