import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { TOWER_ITEMS } from '@/components/terminal/control-tower';
import { ModuleHeader } from '@/components/terminal/module-ui';
import { CommunityModule } from '@/components/terminal/community-modules';

export const metadata: Metadata = { title: 'Community Sovereignty · APA Terminal', robots: { index: false } };

const VALID = new Set(['cvp-matrix', 'data-vault', 'repair-protocol', 'veto-settings']);

export default async function CommunityPage({ params }: { params: Promise<{ locale: string; module: string }> }) {
  const { locale, module } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';
  const href = `/certify-v2/community/${module}`;
  if (!VALID.has(module) || !TOWER_ITEMS.some((i) => i.href === href)) notFound();

  return (
    <div>
      <ModuleHeader href={href} fr={fr} />
      <CommunityModule module={module} fr={fr} />
    </div>
  );
}
