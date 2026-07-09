'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Journey } from '@/types/journey';
import { MOCK_APPLICATIONS } from '@/data/journeys';
import { ROLE_META, ROLE_ORDER, PRIORITY_COUNTRIES, DELIVERY_FORMATS, DIFFICULTIES } from '@/types/journey';

type AdminApp = {
  id: string;
  reference?: string;
  journeyTitle: string;
  applicantName: string;
  country?: string;
  appliedAt: string;
  status: string;
};

const APP_STATUSES = ['Pending', 'Under Review', 'Interview Scheduled', 'Accepted', 'Waitlisted', 'Rejected', 'Completed'];
const money = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmt = (iso: string) => new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

export function JourneyAdmin({ journeys }: { journeys: Journey[] }) {
  const [tab, setTab] = useState<'journeys' | 'applications' | 'create' | 'reports'>('journeys');
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [published, setPublished] = useState<Record<string, boolean>>(
    Object.fromEntries(journeys.map((j) => [j.id, j.status === 'Active']))
  );
  const [apps, setApps] = useState<AdminApp[]>([]);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    let stored: AdminApp[] = [];
    try {
      const raw = JSON.parse(localStorage.getItem('apa.journey.applications') || '[]');
      stored = raw.map((a: { reference: string; journeyTitle: string; applicant: string; country: string; appliedAt: string; status: string }) => ({
        id: a.reference, reference: a.reference, journeyTitle: a.journeyTitle,
        applicantName: a.applicant, country: a.country, appliedAt: a.appliedAt, status: a.status,
      }));
    } catch { /* ignore */ }
    setApps([...stored, ...MOCK_APPLICATIONS.map((m) => ({ ...m }))]);
  }, []);

  const notify = (msg: string) => { setFlash(msg); setTimeout(() => setFlash(null), 2500); };
  const setAppStatus = (id: string, status: string) => {
    setStatuses((s) => ({ ...s, [id]: status }));
    notify(`Application ${id}: status → ${status}. Notification queued to applicant.`);
  };
  const effStatus = (a: AdminApp) => statuses[a.id] ?? a.status;

  const stats = useMemo(() => {
    const total = apps.length;
    const byStatus = apps.reduce<Record<string, number>>((acc, a) => {
      const s = effStatus(a); acc[s] = (acc[s] || 0) + 1; return acc;
    }, {});
    const revenue = journeys.reduce((sum, j) => sum + j.priceUSD * j.applicationsCount, 0);
    return { total, byStatus, revenue, live: Object.values(published).filter(Boolean).length };
  }, [apps, statuses, journeys, published]);

  const tabBtn = (id: typeof tab, label: string) => (
    <button
      type="button"
      onClick={() => setTab(id)}
      className={`rounded-md px-4 py-2 text-sm font-bold transition-colors ${tab === id ? 'apa-gradient text-white' : 'border border-apa-line bg-white text-apa-navy hover:border-apa-green'}`}
    >
      {label}
    </button>
  );

  return (
    <div>
      {flash ? <div className="mb-4 rounded-apa border border-apa-green bg-apa-soft px-4 py-2 text-sm font-semibold text-apa-green">{flash}</div> : null}

      <div className="flex flex-wrap gap-2">
        {tabBtn('journeys', 'Manage Journeys')}
        {tabBtn('applications', 'Applications')}
        {tabBtn('create', 'Create Journey')}
        {tabBtn('reports', 'Reports')}
      </div>

      {/* ── Manage journeys ── */}
      {tab === 'journeys' && (
        <div className="mt-6 overflow-hidden rounded-apa-lg border border-apa-line">
          <table className="w-full text-sm">
            <thead className="bg-apa-soft text-left text-[11px] uppercase text-apa-grey">
              <tr>
                <th className="px-4 py-3">Journey</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Apps</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {journeys.map((j) => (
                <tr key={j.id} className="border-t border-apa-line">
                  <td className="px-4 py-3 font-semibold text-apa-navy">{j.title}</td>
                  <td className="px-4 py-3">{ROLE_META[j.roleFilter].label}</td>
                  <td className="px-4 py-3">{j.countryFlag} {j.country}</td>
                  <td className="px-4 py-3">{money(j.priceUSD)}</td>
                  <td className="px-4 py-3">{j.applicationsCount}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${published[j.id] ? 'bg-apa-green/10 text-apa-green' : 'bg-apa-soft text-apa-grey'}`}>
                      {published[j.id] ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => { setPublished((p) => ({ ...p, [j.id]: !p[j.id] })); notify(`${j.title} ${published[j.id] ? 'unpublished' : 'published'}.`); }}
                      className="text-xs font-bold text-apa-green hover:underline"
                    >
                      {published[j.id] ? 'Unpublish' : 'Publish'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Applications ── */}
      {tab === 'applications' && (
        <div className="mt-6 space-y-3">
          {apps.length === 0 ? (
            <div className="apa-box p-6 text-sm text-apa-grey">No applications yet.</div>
          ) : apps.map((a) => (
            <div key={a.id} className="rounded-apa-lg border border-apa-line p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-apa-navy">{a.applicantName} <span className="text-xs font-normal text-apa-grey">→ {a.journeyTitle}</span></div>
                  <div className="text-xs text-apa-grey">{a.reference ? `Ref ${a.reference} · ` : ''}{a.country ? `${a.country} · ` : ''}applied {fmt(a.appliedAt)}</div>
                </div>
                <span className="rounded-full bg-apa-navy px-3 py-1 text-xs font-bold text-white">{effStatus(a)}</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => notify(`Opened document review for ${a.applicantName}.`)} className="rounded border border-apa-line px-2.5 py-1 text-xs font-semibold text-apa-navy hover:border-apa-green">Review docs</button>
                <button type="button" onClick={() => setAppStatus(a.id, 'Interview Scheduled')} className="rounded border border-apa-line px-2.5 py-1 text-xs font-semibold text-apa-navy hover:border-apa-green">Schedule interview</button>
                <button type="button" onClick={() => setAppStatus(a.id, 'Accepted')} className="rounded bg-apa-green px-2.5 py-1 text-xs font-bold text-white">Approve</button>
                <button type="button" onClick={() => setAppStatus(a.id, 'Rejected')} className="rounded bg-apa-bronze px-2.5 py-1 text-xs font-bold text-white">Reject</button>
                <select
                  value={effStatus(a)}
                  onChange={(e) => setAppStatus(a.id, e.target.value)}
                  className="ml-auto rounded-md border border-apa-line px-2 py-1 text-xs"
                >
                  {APP_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create journey ── */}
      {tab === 'create' && <CreateJourneyForm onSubmit={() => notify('Journey draft created (preview). In production this persists and appears under Manage Journeys.')} />}

      {/* ── Reports ── */}
      {tab === 'reports' && (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <Stat label="Live journeys" value={String(stats.live)} />
            <Stat label="Total applications" value={String(stats.total)} />
            <Stat label="Accepted" value={String(stats.byStatus['Accepted'] || 0)} />
            <Stat label="Pipeline value" value={money(stats.revenue)} />
          </div>
          <div className="rounded-apa-lg border border-apa-line p-5">
            <h3 className="text-sm font-bold text-apa-navy">Applications by status</h3>
            <div className="apa-rule my-3" />
            <div className="space-y-2">
              {APP_STATUSES.map((s) => {
                const n = stats.byStatus[s] || 0;
                const pct = stats.total ? Math.round((n / stats.total) * 100) : 0;
                return (
                  <div key={s} className="flex items-center gap-3 text-xs">
                    <span className="w-40 font-semibold text-apa-grey">{s}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-apa-soft">
                      <div className="h-full apa-gradient" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-10 text-right font-bold text-apa-navy">{n}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-apa-lg border border-apa-line p-5">
            <h3 className="text-sm font-bold text-apa-navy">Journeys by role</h3>
            <div className="apa-rule my-3" />
            <div className="grid gap-3 sm:grid-cols-3">
              {ROLE_ORDER.map((r) => (
                <div key={r} className="apa-box p-3 text-center">
                  <div className="text-2xl font-bold text-apa-green">{journeys.filter((j) => j.roleFilter === r).length}</div>
                  <div className="text-xs font-semibold text-apa-grey">{ROLE_META[r].label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CreateJourneyForm({ onSubmit }: { onSubmit: () => void }) {
  const inp = 'w-full rounded-md border border-apa-line px-3 py-2 text-sm focus:border-apa-green focus:outline-none';
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const toggle = (name: string) => setSelectedCountries((s) => s.includes(name) ? s.filter((c) => c !== name) : [...s, name]);

  return (
    <form
      className="mt-6 space-y-5"
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <L label="Title *"><input required className={inp} placeholder="e.g. Nigeria Governance Immersion" /></L>
        <L label="Role tier *">
          <select className={inp} defaultValue="OBSERVER">
            {ROLE_ORDER.map((r) => <option key={r} value={r}>{ROLE_META[r].label}</option>)}
          </select>
        </L>
        <L label="Difficulty *">
          <select className={inp}>{DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}</select>
        </L>
        <L label="Delivery format *">
          <select className={inp}>{DELIVERY_FORMATS.map((d) => <option key={d}>{d}</option>)}</select>
        </L>
        <L label="Duration (days) *"><input type="number" min={1} className={inp} defaultValue={5} /></L>
        <L label="Price (USD) *"><input type="number" min={0} step={100} className={inp} defaultValue={3000} /></L>
      </div>
      <L label="Overview / description *"><textarea className={`${inp} min-h-28`} placeholder="Long-form description…" /></L>

      <div>
        <div className="text-[11px] font-bold uppercase text-apa-grey">Assign countries *</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {PRIORITY_COUNTRIES.map((c) => (
            <button
              type="button"
              key={c.code}
              onClick={() => toggle(c.name)}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${selectedCountries.includes(c.name) ? 'bg-apa-green text-white' : 'border border-apa-line bg-white text-apa-navy hover:border-apa-green'}`}
            >
              {c.flag} {c.name}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-apa-grey">{selectedCountries.length} selected</p>
      </div>

      <div className="flex gap-3">
        <button type="submit" className="rounded-md bg-apa-green px-6 py-2.5 text-sm font-bold text-white hover:bg-apa-green-mid">Save draft</button>
        <button type="submit" className="rounded-md apa-gradient px-6 py-2.5 text-sm font-bold text-white">Save & publish</button>
      </div>
    </form>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="flex flex-col gap-1 text-[11px] font-bold uppercase text-apa-grey">{label}<span className="font-normal normal-case">{children}</span></label>;
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-apa-lg border border-apa-line bg-white p-4 text-center">
      <div className="text-2xl font-bold text-apa-green">{value}</div>
      <div className="mt-1 text-xs font-semibold uppercase text-apa-grey">{label}</div>
    </div>
  );
}
