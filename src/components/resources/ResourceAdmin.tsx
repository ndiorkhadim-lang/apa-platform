'use client';

import { useMemo, useState } from 'react';
import type { Resource } from '@/types/resource';
import { RESOURCE_TYPES, INDUSTRIES, GOVERNANCE_DOMAINS, RESOURCE_LANGUAGES } from '@/types/resource';
import { PRIORITY_COUNTRIES } from '@/types/journey';

const compact = (n: number) => Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
const fmt = (iso: string) => new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

export function ResourceAdmin({ resources }: { resources: Resource[] }) {
  const [tab, setTab] = useState<'library' | 'create' | 'analytics'>('library');
  const [featured, setFeatured] = useState<Record<string, boolean>>(Object.fromEntries(resources.map((r) => [r.id, r.featured])));
  const [archived, setArchived] = useState<Record<string, boolean>>({});
  const [flash, setFlash] = useState<string | null>(null);
  const notify = (m: string) => { setFlash(m); setTimeout(() => setFlash(null), 2500); };

  const totals = useMemo(() => ({
    views: resources.reduce((s, r) => s + r.views, 0),
    downloads: resources.reduce((s, r) => s + r.downloads, 0),
    live: resources.filter((r) => !archived[r.id]).length,
  }), [resources, archived]);

  const tabBtn = (id: typeof tab, label: string) => (
    <button type="button" onClick={() => setTab(id)}
      className={`rounded-md px-4 py-2 text-sm font-bold transition-colors ${tab === id ? 'apa-gradient text-white' : 'border border-apa-line bg-white text-apa-navy hover:border-apa-green'}`}>
      {label}
    </button>
  );

  return (
    <div>
      {flash ? <div className="mb-4 rounded-apa border border-apa-green bg-apa-soft px-4 py-2 text-sm font-semibold text-apa-green">{flash}</div> : null}
      <div className="flex flex-wrap gap-2">
        {tabBtn('library', 'Content Library')}
        {tabBtn('create', 'Create / Upload')}
        {tabBtn('analytics', 'Analytics')}
      </div>

      {tab === 'library' && (
        <div className="mt-6 overflow-x-auto rounded-apa-lg border border-apa-line">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-apa-soft text-left text-[11px] uppercase text-apa-grey">
              <tr>
                <th className="px-4 py-3">Title</th><th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Views</th><th className="px-4 py-3">Downloads</th>
                <th className="px-4 py-3">State</th><th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id} className={`border-t border-apa-line ${archived[r.id] ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3 font-semibold text-apa-navy">{r.title}</td>
                  <td className="px-4 py-3">{r.type}</td>
                  <td className="px-4 py-3">{compact(r.views)}</td>
                  <td className="px-4 py-3">{r.hasPdf ? compact(r.downloads) : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${archived[r.id] ? 'bg-apa-soft text-apa-grey' : 'bg-apa-green/10 text-apa-green'}`}>
                      {archived[r.id] ? 'Archived' : 'Published'}
                    </span>
                    {featured[r.id] && !archived[r.id] ? <span className="ml-1 rounded-full bg-apa-gold/20 px-2 py-0.5 text-[11px] font-bold text-apa-bronze">★ Featured</span> : null}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => { setFeatured((f) => ({ ...f, [r.id]: !f[r.id] })); notify(`${r.title}: ${featured[r.id] ? 'unfeatured' : 'featured'}.`); }} className="text-xs font-bold text-apa-bronze hover:underline">{featured[r.id] ? 'Unfeature' : 'Feature'}</button>
                      <button type="button" onClick={() => { setArchived((a) => ({ ...a, [r.id]: !a[r.id] })); notify(`${r.title} ${archived[r.id] ? 'restored' : 'archived'}.`); }} className="text-xs font-bold text-apa-green hover:underline">{archived[r.id] ? 'Restore' : 'Archive'}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'create' && <CreateResourceForm onSubmit={(scheduled) => notify(scheduled ? 'Resource scheduled for publication (preview).' : 'Resource created (preview). In production it persists to the CMS.')} />}

      {tab === 'analytics' && (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <Stat label="Published" value={String(totals.live)} />
            <Stat label="Total views" value={compact(totals.views)} />
            <Stat label="Total downloads" value={compact(totals.downloads)} />
            <Stat label="Avg rating" value={(resources.reduce((s, r) => s + r.rating, 0) / resources.length).toFixed(2)} />
          </div>
          <div className="rounded-apa-lg border border-apa-line p-5">
            <h3 className="text-sm font-bold text-apa-navy">Top resources by views</h3>
            <div className="apa-rule my-3" />
            <div className="space-y-2">
              {[...resources].sort((a, b) => b.views - a.views).slice(0, 8).map((r) => {
                const max = Math.max(...resources.map((x) => x.views));
                return (
                  <div key={r.id} className="flex items-center gap-3 text-xs">
                    <span className="w-64 truncate font-semibold text-apa-ink">{r.title}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-apa-soft"><div className="h-full apa-gradient" style={{ width: `${(r.views / max) * 100}%` }} /></div>
                    <span className="w-12 text-right font-bold text-apa-navy">{compact(r.views)}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <MiniList title="Trending" items={resources.filter((r) => r.trending).map((r) => r.title)} />
            <MiniList title="Recently added" items={[...resources].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 6).map((r) => `${r.title} · ${fmt(r.publishedAt)}`)} />
          </div>
        </div>
      )}
    </div>
  );
}

function CreateResourceForm({ onSubmit }: { onSubmit: (scheduled: boolean) => void }) {
  const inp = 'w-full rounded-md border border-apa-line px-3 py-2 text-sm focus:border-apa-green focus:outline-none';
  const [domains, setDomains] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [scheduled, setScheduled] = useState(false);
  const toggle = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <form className="mt-6 space-y-5" onSubmit={(e) => { e.preventDefault(); onSubmit(scheduled); }}>
      <div className="grid gap-4 sm:grid-cols-2">
        <L label="Title *"><input required className={inp} placeholder="Resource title" /></L>
        <L label="Resource type *"><select className={inp}>{RESOURCE_TYPES.map((t) => <option key={t}>{t}</option>)}</select></L>
        <L label="Author *"><input required className={inp} placeholder="Author name" /></L>
        <L label="Language *"><select className={inp}>{RESOURCE_LANGUAGES.map((l) => <option key={l}>{l}</option>)}</select></L>
        <L label="Industry"><select className={inp}>{INDUSTRIES.map((i) => <option key={i}>{i}</option>)}</select></L>
        <L label="Reading time (min)"><input type="number" min={1} className={inp} defaultValue={12} /></L>
      </div>
      <L label="Executive summary *"><textarea className={`${inp} min-h-20`} placeholder="Card-level abstract…" /></L>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="text-[11px] font-bold uppercase text-apa-grey">Upload file</div>
          <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-apa-lg border-2 border-dashed border-apa-line p-6 text-center hover:border-apa-green">
            <span className="text-2xl">⬆️</span>
            <span className="mt-1 text-xs font-semibold text-apa-navy">Upload PDF / Video</span>
            <span className="text-[11px] text-apa-grey">Drag & drop or click</span>
            <input type="file" className="hidden" />
          </label>
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase text-apa-grey">Governance domains</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {GOVERNANCE_DOMAINS.map((d) => (
              <button type="button" key={d} onClick={() => toggle(domains, setDomains, d)}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${domains.includes(d) ? 'bg-apa-green text-white' : 'border border-apa-line bg-white text-apa-navy hover:border-apa-green'}`}>{d}</button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="text-[11px] font-bold uppercase text-apa-grey">Assign countries</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <button type="button" onClick={() => toggle(countries, setCountries, 'Pan-African')} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${countries.includes('Pan-African') ? 'bg-apa-green text-white' : 'border border-apa-line bg-white text-apa-navy hover:border-apa-green'}`}>🌍 Pan-African</button>
          {PRIORITY_COUNTRIES.map((c) => (
            <button type="button" key={c.code} onClick={() => toggle(countries, setCountries, c.name)}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${countries.includes(c.name) ? 'bg-apa-green text-white' : 'border border-apa-line bg-white text-apa-navy hover:border-apa-green'}`}>{c.flag} {c.name}</button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={scheduled} onChange={(e) => setScheduled(e.target.checked)} />
        Schedule publication for a future date
      </label>
      {scheduled ? <L label="Publish on"><input type="date" className={`${inp} max-w-xs`} /></L> : null}

      <div className="flex gap-3">
        <button type="submit" className="rounded-md bg-apa-green px-6 py-2.5 text-sm font-bold text-white hover:bg-apa-green-mid">Save draft</button>
        <button type="submit" className="rounded-md apa-gradient px-6 py-2.5 text-sm font-bold text-white">{scheduled ? 'Schedule' : 'Publish now'}</button>
      </div>
    </form>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="flex flex-col gap-1 text-[11px] font-bold uppercase text-apa-grey">{label}<span className="font-normal normal-case">{children}</span></label>;
}
function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-apa-lg border border-apa-line bg-white p-4 text-center"><div className="text-2xl font-bold text-apa-green">{value}</div><div className="mt-1 text-xs font-semibold uppercase text-apa-grey">{label}</div></div>;
}
function MiniList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-apa-lg border border-apa-line p-5">
      <h3 className="text-sm font-bold text-apa-navy">{title}</h3>
      <div className="apa-rule my-3" />
      <ul className="space-y-1.5 text-sm text-apa-ink">{items.map((i, k) => <li key={k} className="flex gap-2"><span className="text-apa-gold">◆</span>{i}</li>)}</ul>
    </div>
  );
}
