import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { TOWER_ITEMS } from '@/components/terminal/control-tower';
import { ModuleHeader } from '@/components/terminal/module-ui';
import { TelemetryModule } from '@/components/terminal/telemetry-modules';

export const metadata: Metadata = { title: 'Governance Telemetry · APA Terminal', robots: { index: false } };

const VALID = new Set(['sigma', 'pqi', 'systems-change', 'grievance']);

export default async function TelemetryPage({ params }: { params: Promise<{ locale: string; metric: string }> }) {
  const { locale, metric } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';
  const href = `/certify-v2/telemetry/${metric}`;
  if (!VALID.has(metric) || !TOWER_ITEMS.some((i) => i.href === href)) notFound();

  return (
    <div>
      <ModuleHeader href={href} fr={fr} />
      <TelemetryModule metric={metric} fr={fr} />
    </div>
  );
}
