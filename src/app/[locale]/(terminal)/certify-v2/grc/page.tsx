import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { CONTROL_TOWER } from '@/components/terminal/control-tower';

export const metadata: Metadata = { title: 'GRC Suite Workspace · APA Terminal', robots: { index: false } };

export default async function GrcIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';
  const grc = CONTROL_TOWER.find((g) => g.id === 'grc')!;

  return (
    <div>
      <h1 className="t-display text-2xl font-extrabold sm:text-3xl"><span className="t-amber">⚙</span> {fr ? 'Atelier Suite GRC — 63 instruments' : 'GRC Suite Workspace — 63 instruments'}</h1>
      <p className="mt-1 text-sm t-muted">{fr ? 'Six piliers propriétaires. Sélectionnez un pilier pour ouvrir ses instruments.' : 'Six proprietary pillars. Select a pillar to open its instruments.'}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {grc.items.map((it) => (
          <Link key={it.slug} href={it.href} className="t-glass t-glass-hover rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span className="t-amber text-2xl">{it.glyph}</span>
              <span className="t-mono text-xs t-faint">{it.tools?.length} {fr ? 'outils' : 'tools'}</span>
            </div>
            <h3 className="t-display mt-3 text-base font-bold leading-tight">{fr ? it.titleFr : it.titleEn}</h3>
            <p className="mt-1 text-xs t-muted">{fr ? it.subFr : it.subEn}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
