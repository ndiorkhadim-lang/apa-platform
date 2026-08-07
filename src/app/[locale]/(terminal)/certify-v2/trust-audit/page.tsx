import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { StepHeader } from '@/components/terminal/step-header';
import { StakeholderMapper } from '@/components/terminal/stakeholder-mapper';

export const metadata: Metadata = { title: 'Trust Audit · APA Terminal', robots: { index: false } };

export default async function Step2({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';
  return (
    <div>
      <StepHeader n={2} fr={fr} />
      <StakeholderMapper fr={fr} />
    </div>
  );
}
