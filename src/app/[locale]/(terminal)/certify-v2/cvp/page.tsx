import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { StepHeader } from '@/components/terminal/step-header';
import { CvpConsent } from '@/components/terminal/cvp-consent';

export const metadata: Metadata = { title: 'CVP Live Consent · APA Terminal', robots: { index: false } };

export default async function Step4({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';
  return (
    <div>
      <StepHeader n={4} fr={fr} />
      <CvpConsent fr={fr} />
    </div>
  );
}
