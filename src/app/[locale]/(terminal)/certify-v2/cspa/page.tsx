import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { StepHeader } from '@/components/terminal/step-header';
import { CspaWizard } from '@/components/terminal/cspa-wizard';

export const metadata: Metadata = { title: 'C-SPA Engine · APA Terminal', robots: { index: false } };

export default async function Step1({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';
  return (
    <div>
      <StepHeader n={1} fr={fr} />
      <CspaWizard fr={fr} />
    </div>
  );
}
