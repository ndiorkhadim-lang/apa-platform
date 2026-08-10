'use client';

import { useMemo, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { ProposalForm } from '@/components/journey/ProposalForm';

export type DashProposal = {
  id: string; title: string; status: string; sector: string | null; location: string | null;
  country: string; durationDays: number | null; maxCapacity: number | null; priceUSD: number | null;
  createdAt: string; publishedAt: string | null; reviewNote: string | null; qualityScore: number | null;
  themeTags: string[]; certificationAlignment: string | null; licenseFileName: string | null;
  comments: { id: string; authorName: string; authorRole: string; body: string; createdAt: string }[];
};

const STATUS_STYLE: Record<string, string> = {
  DRAFT: 'bg-apa-soft text-apa-grey', SUBMITTED: 'bg-apa-navy text-white',
  UNDER_REVIEW: 'bg-apa-gold text-apa-ink', REVISIONS_REQUESTED: 'bg-apa-bronze text-white',
  APPROVED: 'bg-apa-green text-white', PUBLISHED: 'bg-apa-green-mid text-white', REJECTED: 'bg-red-700 text-white',
};
const fmt = (iso: string) => new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
const money = (n: number | null) => (n == null ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n));

const TABS = [
  { id: 'overview', label: 'Overview', icon: '◆' },
  { id: 'journeys', label: 'Journeys', icon: '🧭' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
  { id: 'documents', label: 'Documents', icon: '📁' },
  { id: 'messages', label: 'Messages', icon: '💬' },
  { id: 'assistant', label: 'AI Assistant', icon: '✦' },
] as const;

export function PartnerDashboard({
  locale, partnerName, applicationStatus, proposals,
}: {
  locale: string; partnerName?: string; applicationStatus: string | null; proposals: DashProposal[];
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('overview');

  const counts = useMemo(() => ({
    total: proposals.length,
    review: proposals.filter((p) => ['SUBMITTED', 'UNDER_REVIEW', 'REVISIONS_REQUESTED'].includes(p.status)).length,
    published: proposals.filter((p) => p.status === 'PUBLISHED' || p.status === 'APPROVED').length,
    drafts: proposals.filter((p) => p.status === 'DRAFT').length,
  }), [proposals]);

  const avgQuality = useMemo(() => {
    const scored = proposals.filter((p) => p.qualityScore != null);
    if (!scored.length) return null;
    return Math.round(scored.reduce((s, p) => s + (p.qualityScore ?? 0), 0) / scored.length);
  }, [proposals]);

  const allComments = useMemo(
    () => proposals.flatMap((p) => p.comments.map((c) => ({ ...c, journey: p.title })))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [proposals],
  );

  const themeTally = useMemo(() => {
    const m = new Map<string, number>();
    proposals.forEach((p) => p.themeTags.forEach((t) => m.set(t, (m.get(t) ?? 0) + 1)));
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [proposals]);

  const totalSeats = proposals.reduce((s, p) => s + (p.maxCapacity ?? 0), 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-apa-green/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-apa-green">✦ Partner Workspace</span>
          <h1 className="mt-3 text-3xl font-bold text-apa-green">Partner Dashboard</h1>
          <p className="mt-1 text-sm text-apa-grey">Welcome{partnerName ? `, ${partnerName}` : ''}. Manage journeys, track approvals and communicate with APA.</p>
        </div>
        <Link href="/journeys" className="text-xs font-semibold text-apa-grey hover:text-apa-green">← All journeys</Link>
      </header>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-1 border-b border-apa-line">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`-mb-px rounded-t-md px-4 py-2.5 text-sm font-semibold transition ${tab === t.id ? 'border-b-2 border-apa-green text-apa-green' : 'text-apa-grey hover:text-apa-navy'}`}>
            <span className="mr-1.5" aria-hidden>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'overview' && (
          <div className="space-y-6">
            {applicationStatus && applicationStatus !== 'ACCEPTED' ? (
              <div className="apa-box apa-box-gold p-4 text-sm">
                <b className="text-apa-navy">Application status: {applicationStatus.replace('_', ' ')}.</b> APA is reviewing your partner application — you’ll be notified by email.
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-4">
              <Stat n={counts.total} label="Total journeys" tone="green" />
              <Stat n={counts.review} label="In review" tone="gold" />
              <Stat n={counts.published} label="Approved / live" tone="mid" />
              <Stat n={avgQuality ?? '—'} label="Avg quality" tone="navy" />
            </div>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide text-apa-grey">Approval timeline</h2>
              <div className="apa-rule my-3" />
              <ol className="space-y-2">
                {proposals.slice(0, 6).map((p) => (
                  <li key={p.id} className="flex items-center gap-3 rounded-lg border border-apa-line bg-white p-3">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${STATUS_STYLE[p.status]}`}>{p.status.replace('_', ' ')}</span>
                    <span className="flex-1 text-sm font-semibold text-apa-navy">{p.title}</span>
                    <span className="text-xs text-apa-grey">{p.publishedAt ? `Published ${fmt(p.publishedAt)}` : `Submitted ${fmt(p.createdAt)}`}</span>
                  </li>
                ))}
                {proposals.length === 0 ? <li className="apa-box p-4 text-sm text-apa-grey">No journeys yet. Head to the Journeys tab to submit your next one.</li> : null}
              </ol>
            </section>
          </div>
        )}

        {tab === 'journeys' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide text-apa-grey">Submit a new journey</h2>
              <div className="apa-rule my-3" />
              <ProposalForm locale={locale} />
            </section>
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide text-apa-grey">My journeys ({proposals.length})</h2>
              <div className="apa-rule my-3" />
              {proposals.length === 0 ? (
                <div className="apa-box p-6 text-sm text-apa-grey">No journeys yet — submit your first above.</div>
              ) : (
                <div className="space-y-3">
                  {proposals.map((p) => (
                    <div key={p.id} className="rounded-apa-lg border border-apa-line bg-white p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="font-bold text-apa-navy">{p.title}</div>
                          <div className="text-xs text-apa-grey">{p.sector ?? p.country} · {p.location ?? p.country} · {p.durationDays ?? '—'} days{p.maxCapacity ? ` · ${p.maxCapacity} seats` : ''} · {money(p.priceUSD)}</div>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${STATUS_STYLE[p.status] ?? 'bg-apa-soft'}`}>{p.status.replace('_', ' ')}</span>
                      </div>
                      {p.themeTags.length ? <div className="mt-2 flex flex-wrap gap-1.5">{p.themeTags.map((t) => <span key={t} className="rounded-full border border-apa-line px-2 py-0.5 text-[11px] text-apa-green">{t}</span>)}</div> : null}
                      {p.reviewNote ? <p className="mt-2 rounded-apa bg-apa-soft p-2 text-xs text-apa-ink"><b>APA note:</b> {p.reviewNote}</p> : null}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {tab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-4">
              <Stat n={counts.published} label="Published journeys" tone="green" />
              <Stat n={totalSeats} label="Total seats offered" tone="navy" />
              <Stat n={avgQuality ?? '—'} label="Avg quality score" tone="gold" />
              <Stat n={counts.review} label="Awaiting review" tone="mid" />
            </div>
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide text-apa-grey">Top themes across your journeys</h2>
              <div className="apa-rule my-3" />
              {themeTally.length === 0 ? <p className="text-sm text-apa-grey">No theme data yet.</p> : (
                <div className="space-y-2">
                  {themeTally.map(([theme, n]) => (
                    <div key={theme} className="flex items-center gap-3">
                      <span className="w-40 shrink-0 text-sm text-apa-navy">{theme}</span>
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-apa-soft">
                        <div className="h-full rounded-full bg-apa-green" style={{ width: `${(n / (themeTally[0]?.[1] || 1)) * 100}%` }} />
                      </div>
                      <span className="w-6 text-right text-xs font-semibold text-apa-grey">{n}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
            <p className="text-xs text-apa-grey">Engagement metrics (views, applications, completion, feedback scores) activate once a journey is published and live on the marketplace.</p>
          </div>
        )}

        {tab === 'documents' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-apa-grey">Document library</h2>
            <div className="apa-rule my-3" />
            <ul className="space-y-2">
              <DocRow name="Operating license / registration" meta={proposals.find((p) => p.licenseFileName)?.licenseFileName ?? 'From your application'} />
              {proposals.map((p) => (
                <DocRow key={p.id} name={`Journey brief — ${p.title}`} meta={`${p.status.replace('_', ' ')} · ${fmt(p.createdAt)}`} />
              ))}
            </ul>
            <p className="text-xs text-apa-grey">Signed agreements, certificates and journey collateral will appear here. Direct file upload activates with storage credentials.</p>
          </div>
        )}

        {tab === 'messages' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-apa-grey">Communication with APA · Review history</h2>
            <div className="apa-rule my-3" />
            {allComments.length === 0 ? (
              <div className="apa-box p-6 text-sm text-apa-grey">No messages yet. APA reviewers will post decisions and feedback here as your journeys move through governance.</div>
            ) : (
              <ol className="space-y-2">
                {allComments.map((c) => (
                  <li key={c.id} className="rounded-lg border border-apa-line bg-white p-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-apa-navy">{c.authorName} <span className="rounded bg-apa-soft px-1.5 py-0.5 text-[10px] font-bold text-apa-grey">{c.authorRole}</span></span>
                      <span className="text-apa-grey">{fmt(c.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-sm text-apa-ink">{c.body}</p>
                    <p className="mt-0.5 text-[11px] text-apa-grey">on “{c.journey}”</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {tab === 'assistant' && (
          <div className="rounded-apa-lg border border-apa-line bg-gradient-to-br from-apa-green/5 to-apa-gold/5 p-8 text-center">
            <div className="text-3xl">✦</div>
            <h2 className="mt-2 text-lg font-bold text-apa-navy">APA Journey Co-Architect</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-apa-grey">
              Get AI help drafting itineraries, mapping the right APA tools and SDGs, aligning with governance mandates, and strengthening a journey before you submit it for review.
            </p>
            <Link href="/platform" className="mt-5 inline-block rounded-md bg-apa-green px-5 py-2.5 text-sm font-bold text-white hover:bg-apa-green-mid">Open the AI Concierge →</Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ n, label, tone }: { n: number | string; label: string; tone: 'green' | 'gold' | 'mid' | 'navy' }) {
  const color = tone === 'green' ? 'text-apa-green' : tone === 'gold' ? 'text-apa-gold-bright' : tone === 'mid' ? 'text-apa-green-mid' : 'text-apa-navy';
  return (
    <div className="rounded-apa-lg border border-apa-line bg-white p-4 text-center">
      <div className={`text-3xl font-bold ${color}`}>{n}</div>
      <div className="text-xs font-semibold uppercase text-apa-grey">{label}</div>
    </div>
  );
}

function DocRow({ name, meta }: { name: string; meta: string }) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-apa-line bg-white p-3">
      <span className="flex items-center gap-2 text-sm text-apa-navy"><span aria-hidden>📄</span>{name}</span>
      <span className="text-xs text-apa-grey">{meta}</span>
    </li>
  );
}
