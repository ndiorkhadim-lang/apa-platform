import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { StepHeader } from '@/components/terminal/step-header';
import { KinshipContract } from '@/components/terminal/kinship-contract';

export const metadata: Metadata = { title: 'Kinship Contracts · APA Terminal', robots: { index: false } };

export default async function Step3({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';
  return (
    <div>
      <StepHeader n={3} fr={fr} />
      <KinshipContract fr={fr} />
    </div>
  );
}
