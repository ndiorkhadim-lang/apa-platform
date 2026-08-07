import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { prisma, dbAvailable } from '@/infrastructure/prisma/client';
import { TOWER_ITEMS } from '@/components/terminal/control-tower';
import { ModuleHeader, KpiCard } from '@/components/terminal/module-ui';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'GRC Suite · APA Terminal', robots: { index: false } };

export default async function GrcPillar({ params }: { params: Promise<{ locale: string; pillar: string }> }) {
  const { locale, pillar } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';

  const href = `/certify-v2/grc/${pillar}`;
  const item = TOWER_ITEMS.find((i) => i.href === href);
  if (!item || !item.tools) notFound();

  const tools = dbAvailable
    ? await prisma.tool.findMany({
        where: { number: { in: item.tools } },
        orderBy: { number: 'asc' },
        select: { number: true, slug: true, nameEn: true, nameFr: true, typeOfficialEn: true, typeFr: true, descEn: true, descFr: true, category: true },
      })
    : [];

  const categories = Array.from(new Set(tools.map((t) => t.category)));

  return (
    <div>
      <ModuleHeader href={href} fr={fr} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label={fr ? 'Instruments' : 'Instruments'} value={item.tools.length} tone="amber" />
        <KpiCard label={fr ? 'Chargés (BD)' : 'Loaded (DB)'} value={tools.length} tone="emerald" />
        <KpiCard label={fr ? 'Catégories' : 'Categories'} value={categories.length} />
        <KpiCard label={fr ? 'Suite totale' : 'Full suite'} value="63" hint={fr ? '6 piliers GRC' : '6 GRC pillars'} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(tools.length > 0 ? tools : item.tools.map((n) => ({ number: n, slug: '', nameEn: `Tool #${n}`, nameFr: `Outil #${n}`, typeOfficialEn: '', typeFr: '', descEn: fr ? '' : 'Awaiting data source.', descFr: fr ? 'Source de données en attente.' : '', category: '' as string }))).map((t) => (
          <div key={t.number} className="t-glass t-glass-hover rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="t-mono t-amber text-sm font-bold">#{String(t.number).padStart(2, '0')}</span>
              {t.category && <span className="t-chip t-mono text-[9px]">{t.category}</span>}
            </div>
            <h3 className="t-display mt-2 text-sm font-bold leading-tight">{fr ? t.nameFr : t.nameEn}</h3>
            {(fr ? t.typeFr : t.typeOfficialEn) && <p className="mt-0.5 text-[11px] t-faint">{fr ? t.typeFr : t.typeOfficialEn}</p>}
            <p className="mt-2 line-clamp-3 text-xs t-muted">{fr ? t.descFr : t.descEn}</p>
            {t.slug && (
              <a href={`/${locale}/app/tools/${t.slug}`} target="_blank" rel="noopener noreferrer"
                className="mt-3 inline-block text-[11px] font-semibold t-amber hover:underline">
                {fr ? 'Ouvrir l’atelier' : 'Open workspace'} ↗
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
