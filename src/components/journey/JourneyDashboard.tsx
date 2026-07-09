'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Journey } from '@/types/journey';
import { ROLE_META } from '@/types/journey';

type StoredApplication = {
  reference: string;
  journeyId: string;
  journeyTitle: string;
  country: string;
  appliedAt: string;
  status: string;
  applicant: string;
};

type StoredAlert = {
  country: string; region: string; journeyRole: string; activityType: string;
  language: string; deliveryMode: string; email: string; createdAt: string;
};

const STAGES = ['Submitted', 'Under Review', 'Interview', 'Decision'];

const fmt = (iso: string) => new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
const money = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export function JourneyDashboard({ recommended, locale }: { recommended: Journey[]; locale: string }) {
  const [apps, setApps] = useState<StoredApplication[]>([]);
  const [alerts, setAlerts] = useState<StoredAlert[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setApps(JSON.parse(localStorage.getItem('apa.journey.applications') || '[]'));
      setAlerts(JSON.parse(localStorage.getItem('apa.journey.alerts') || '[]'));
      setSaved(JSON.parse(localStorage.getItem('apa.journey.saved') || '[]'));
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  const upcoming = useMemo(
    () => recommended.flatMap((j) => j.dates.map((d) => ({ j, d }))).sort((a, b) => a.d.startDate.localeCompare(b.d.startDate)).slice(0, 4),
    [recommended]
  );

  const savedJourneys = recommended.filter((j) => saved.includes(j.id));
  const notifications = [
    ...apps.map((a) => ({ when: a.appliedAt, text: `Application ${a.reference} for “${a.journeyTitle}” received.` })),
    ...alerts.map((al) => ({ when: al.createdAt, text: `Journey alert set for ${al.country === 'ANY' ? 'any country' : al.country}.` })),
  ].sort((a, b) => b.when.localeCompare(a.when)).slice(0, 6);

  if (!ready) return <div className="apa-box p-6 text-sm text-apa-grey">Loading your dashboard…</div>;

  return (
    <div className="space-y-10">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Active applications" value={apps.length} />
        <Stat label="Journey alerts" value={alerts.length} />
        <Stat label="Saved journeys" value={savedJourneys.length} />
        <Stat label="Completed" value={apps.filter((a) => a.status === 'Completed').length} />
      </div>

      {/* Active applications + progress */}
      <Panel title="Active Applications" num="01">
        {apps.length === 0 ? (
          <Empty text="You have no applications yet." cta={{ href: `/${locale}/journeys`, label: 'Browse journeys' }} />
        ) : (
          <div className="space-y-4">
            {apps.map((a) => {
              const stageIdx = Math.max(0, STAGES.indexOf(a.status === 'Submitted' ? 'Submitted' : a.status));
              return (
                <div key={a.reference} className="rounded-apa-lg border border-apa-line p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-apa-navy">{a.journeyTitle}</div>
                      <div className="text-xs text-apa-grey">{a.country} · Ref {a.reference} · applied {fmt(a.appliedAt)}</div>
                    </div>
                    <span className="rounded-full bg-apa-green/10 px-3 py-1 text-xs font-bold text-apa-green">{a.status}</span>
                  </div>
                  {/* Progress tracker */}
                  <div className="mt-4 flex items-center">
                    {STAGES.map((s, i) => (
                      <div key={s} className="flex flex-1 items-center last:flex-none">
                        <div className="flex flex-col items-center">
                          <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${i <= stageIdx ? 'bg-apa-green text-white' : 'bg-apa-soft text-apa-grey'}`}>{i + 1}</div>
                          <span className="mt-1 whitespace-nowrap text-[10px] font-semibold text-apa-grey">{s}</span>
                        </div>
                        {i < STAGES.length - 1 ? <div className={`mx-1 h-0.5 flex-1 ${i < stageIdx ? 'bg-apa-green' : 'bg-apa-line'}`} /> : null}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      {/* Upcoming */}
      <Panel title="Upcoming Sessions" num="02">
        <div className="grid gap-3 sm:grid-cols-2">
          {upcoming.map(({ j, d }) => (
            <a key={d.id} href={`/${locale}/journeys/${j.slug}`} className="flex items-center justify-between rounded-apa border border-apa-line p-3 hover:border-apa-green">
              <div>
                <div className="text-sm font-bold text-apa-navy">{j.title}</div>
                <div className="text-xs text-apa-grey">{j.countryFlag} {j.country}</div>
              </div>
              <div className="text-right text-xs font-semibold text-apa-green">{fmt(d.startDate)}</div>
            </a>
          ))}
        </div>
      </Panel>

      {/* Saved + Recommended */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Saved Journeys" num="03">
          {savedJourneys.length === 0 ? (
            <Empty text="Nothing saved yet — tap the bookmark on any journey." />
          ) : (
            <ul className="space-y-2">
              {savedJourneys.map((j) => (
                <li key={j.id}><a href={`/${locale}/journeys/${j.slug}`} className="text-sm font-semibold text-apa-green hover:underline">{j.title}</a></li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Recommended For You" num="04">
          <div className="space-y-2">
            {recommended.slice(0, 4).map((j) => (
              <a key={j.id} href={`/${locale}/journeys/${j.slug}`} className="flex items-center justify-between rounded-apa border border-apa-line p-3 hover:border-apa-green">
                <div>
                  <div className="text-sm font-bold text-apa-navy">{j.title}</div>
                  <div className="text-xs text-apa-grey">{ROLE_META[j.roleFilter].label} · {j.country}</div>
                </div>
                <span className="text-xs font-bold text-apa-green">{money(j.priceUSD)}</span>
              </a>
            ))}
          </div>
        </Panel>
      </div>

      {/* Notifications + Alerts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Notifications" num="05">
          {notifications.length === 0 ? <Empty text="No notifications yet." /> : (
            <ul className="space-y-3">
              {notifications.map((n, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="mt-0.5 text-apa-gold">🔔</span>
                  <span><span className="text-apa-ink">{n.text}</span><span className="ml-2 text-xs text-apa-grey">{fmt(n.when)}</span></span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="My Journey Alerts" num="06">
          {alerts.length === 0 ? (
            <Empty text="No alerts set." cta={{ href: `/${locale}/journeys`, label: 'Set an alert' }} />
          ) : (
            <ul className="space-y-2">
              {alerts.map((al, i) => (
                <li key={i} className="rounded-apa bg-apa-soft px-3 py-2 text-xs text-apa-ink">
                  {al.journeyRole === 'ANY' ? 'Any role' : al.journeyRole} · {al.country === 'ANY' ? 'Any country' : al.country} · {al.deliveryMode === 'ANY' ? 'Any format' : al.deliveryMode}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-apa-lg border border-apa-line bg-white p-4 text-center">
      <div className="text-3xl font-bold text-apa-green">{value}</div>
      <div className="mt-1 text-xs font-semibold uppercase text-apa-grey">{label}</div>
    </div>
  );
}
function Panel({ title, num, children }: { title: string; num: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3">
        <span className="apa-secnum text-sm">{num}</span>
        <h2 className="text-lg font-bold text-apa-navy">{title}</h2>
      </div>
      <div className="apa-rule my-3" />
      <div className="mt-3">{children}</div>
    </section>
  );
}
function Empty({ text, cta }: { text: string; cta?: { href: string; label: string } }) {
  return (
    <div className="apa-box p-5 text-sm text-apa-grey">
      {text}{cta ? <> <a href={cta.href} className="font-semibold text-apa-green underline">{cta.label} →</a></> : null}
    </div>
  );
}
