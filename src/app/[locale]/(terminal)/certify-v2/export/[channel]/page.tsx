import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { TOWER_ITEMS } from '@/components/terminal/control-tower';
import { ModuleHeader } from '@/components/terminal/module-ui';
import { ExportModule } from '@/components/terminal/export-modules';

export const metadata: Metadata = { title: 'Institutional Export & API · APA Terminal', robots: { index: false } };

const VALID = new Set(['dfi', 'ratings', 'blockchain']);

export default async function ExportPage({ params }: { params: Promise<{ locale: string; channel: string }> }) {
  const { locale, channel } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';
  const href = `/certify-v2/export/${channel}`;
  if (!VALID.has(channel) || !TOWER_ITEMS.some((i) => i.href === href)) notFound();

  return (
    <div>
      <ModuleHeader href={href} fr={fr} />
      <ExportModule channel={channel} fr={fr} />
    </div>
  );
}
