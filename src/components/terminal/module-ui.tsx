import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { CONTROL_TOWER, TOWER_ITEMS } from './control-tower';

/** Server-safe module banner — breadcrumb, title, tool chips. */
export function ModuleHeader({ href, fr }: { href: string; fr: boolean }) {
  const item = TOWER_ITEMS.find((i) => i.href === href);
  const group = CONTROL_TOWER.find((g) => g.items.some((i) => i.href === href));
  if (!item || !group) return null;
  return (
    <div className="mb-6">
      <p className="t-mono text-[11px] t-faint">
        <span className="t-amber">{group.glyph}</span> {fr ? group.titleFr : group.titleEn}
      </p>
      <h1 className="t-display mt-2 flex items-center gap-3 text-2xl font-extrabold sm:text-3xl">
        <span className="t-amber">{item.glyph}</span>
        {fr ? item.titleFr : item.titleEn}
      </h1>
      <p className="mt-1 text-sm t-muted">{fr ? item.subFr : item.subEn}</p>
      {item.tools && item.tools.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tools.map((n) => <span key={n} className="t-chip t-mono">Tool #{n}</span>)}
        </div>
      )}
    </div>
  );
}

export function KpiCard({ label, value, hint, tone = 'default' }: { label: string; value: ReactNode; hint?: string; tone?: 'default' | 'amber' | 'emerald' | 'red' }) {
  const color = tone === 'amber' ? 't-amber' : tone === 'emerald' ? 't-emerald' : tone === 'red' ? '' : '';
  const glow = tone === 'amber' ? 't-glow-amber' : tone === 'emerald' ? 't-glow-emerald' : '';
  return (
    <div className={`t-glass ${glow} rounded-2xl p-4`}>
      <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{label}</p>
      <div className={`mt-1.5 text-2xl font-bold leading-none ${color}`} style={tone === 'red' ? { color: 'var(--t-red)' } : undefined}>{value}</div>
      {hint && <p className="mt-1.5 text-xs t-muted">{hint}</p>}
    </div>
  );
}

export function Panel({ title, children, right }: { title: string; children: ReactNode; right?: ReactNode }) {
  return (
    <section className="t-glass rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{title}</p>
        {right}
      </div>
      {children}
    </section>
  );
}
