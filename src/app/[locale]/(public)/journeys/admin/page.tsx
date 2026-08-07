import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { dbAvailable, prisma } from '@/infrastructure/prisma/client';
import { JOURNEYS } from '@/data/journeys';
import { JourneyAdmin } from '@/components/journey/JourneyAdmin';
import { reviewProposal, addProposalComment } from './proposal-actions';

export const dynamic = 'force-dynamic';

const PS: Record<string, string> = {
  SUBMITTED: 'bg-apa-navy text-white', UNDER_REVIEW: 'bg-apa-gold text-apa-ink',
  REVISIONS_REQUESTED: 'bg-apa-bronze text-white', APPROVED: 'bg-apa-green text-white',
  PUBLISHED: 'bg-apa-green-mid text-white', REJECTED: 'bg-red-700 text-white', DRAFT: 'bg-apa-soft text-apa-grey',
};

export default async function JourneyAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getSession();
  const role = (session?.user as { platformRole?: string } | undefined)?.platformRole;
  const isAdmin = role === 'ADMIN_APA';

  // Partner-submitted journey proposals awaiting the governance workflow.
  const proposals = isAdmin && dbAvailable
    ? await prisma.journeyProposal.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          partner: { select: { name: true, email: true } },
          comments: { orderBy: { createdAt: 'asc' } },
        },
        take: 100,
      })
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="apa-secnum text-sm">✦</span>
          <h1 className="mt-3 text-3xl font-bold text-apa-green">Journeys — Admin Console</h1>
          <div className="apa-rule my-3" />
          <p className="max-w-2xl text-sm text-apa-grey">
            Create and publish journeys, assign countries, manage applications, review documents,
            approve or reject candidates, schedule interviews, notify applicants and view reports.
          </p>
        </div>
        <Link href="/journeys" className="rounded-md border border-apa-line px-4 py-2.5 text-sm font-semibold text-apa-navy hover:border-apa-green">
          ← Public site
        </Link>
      </header>

      {!isAdmin ? (
        <div className="apa-box apa-box-gold mt-6 p-4 text-sm text-apa-ink">
          <strong>Preview mode.</strong> You are viewing the admin console without an APA admin session.
          Actions run locally for demonstration; with an <code>ADMIN_APA</code> session they persist to the platform.
        </div>
      ) : null}

      {/* Partner proposals — governance review queue (live data) */}
      {isAdmin ? (
        <section className="mt-8">
          <div className="flex items-center gap-3">
            <span className="apa-secnum text-sm">◆</span>
            <h2 className="text-xl font-bold text-apa-navy">Partner Journey Proposals</h2>
          </div>
          <div className="apa-rule my-3" />
          {proposals.length === 0 ? (
            <div className="apa-box p-5 text-sm text-apa-grey">No partner proposals submitted yet.</div>
          ) : (
            <div className="space-y-4">
              {proposals.map((p) => (
                <div key={p.id} className="rounded-apa-lg border border-apa-line bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-apa-navy">{p.title}</div>
                      <div className="text-xs text-apa-grey">
                        {p.partner.name} ({p.partner.email}) · {p.country} · {p.durationDays ?? '—'} days
                        {p.assignedReviewerId ? ` · Reviewer: ${p.assignedReviewerId}` : ''}
                        {p.qualityScore != null ? ` · Quality ${p.qualityScore}/100` : ''}
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${PS[p.status] ?? 'bg-apa-soft text-apa-grey'}`}>{p.status.replace('_', ' ')}</span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                    {p.sector ? <span className="rounded-full bg-apa-soft px-2.5 py-1 font-semibold text-apa-green">{p.sector}</span> : null}
                    {p.location ? <span className="rounded-full bg-apa-soft px-2.5 py-1 font-semibold text-apa-navy">📍 {p.location}</span> : null}
                    {p.maxCapacity ? <span className="rounded-full bg-apa-soft px-2.5 py-1 font-semibold text-apa-navy">👥 {p.maxCapacity} max</span> : null}
                    {p.travelType ? <span className="rounded-full bg-apa-soft px-2.5 py-1 font-semibold text-apa-navy">{p.travelType}</span> : null}
                    {p.difficulty ? <span className="rounded-full bg-apa-soft px-2.5 py-1 font-semibold text-apa-navy">{p.difficulty}</span> : null}
                    {p.certificationAlignment ? <span className="rounded-full bg-apa-gold/15 px-2.5 py-1 font-semibold text-apa-ink">{p.certificationAlignment}</span> : null}
                  </div>
                  {(p.themeTags.length || p.audienceTags.length || p.sdgs.length || p.toolNumbers.length || p.frameworkModules.length) ? (
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                      {p.themeTags.map((t) => <span key={`th-${t}`} className="rounded-full border border-apa-line px-2 py-0.5 text-apa-green">{t}</span>)}
                      {p.audienceTags.map((t) => <span key={`au-${t}`} className="rounded-full border border-apa-line px-2 py-0.5 text-apa-navy">{t}</span>)}
                      {p.sdgs.map((t) => <span key={`sd-${t}`} className="rounded-full border border-apa-line px-2 py-0.5 text-apa-grey">{t}</span>)}
                      {p.frameworkModules.length ? <span className="rounded-full border border-apa-line px-2 py-0.5 text-apa-grey">Pillars {p.frameworkModules.join(', ')}</span> : null}
                      {p.toolNumbers.length ? <span className="rounded-full border border-apa-line px-2 py-0.5 text-apa-grey">{p.toolNumbers.length} APA tools</span> : null}
                    </div>
                  ) : null}

                  <p className="mt-2 text-sm text-apa-ink">{p.summary}</p>
                  {p.hostCommunities ? <p className="mt-1 text-xs text-apa-grey"><b>Host communities:</b> {p.hostCommunities}</p> : null}
                  {p.expectedOutcomes.length ? <p className="mt-1 text-xs text-apa-grey"><b>Expected outcomes:</b> {p.expectedOutcomes.join(', ')}</p> : null}

                  {/* Review thread */}
                  {p.comments.length ? (
                    <div className="mt-3 space-y-1.5 rounded-md bg-apa-soft/40 p-3">
                      {p.comments.map((c) => (
                        <div key={c.id} className="text-xs">
                          <span className="font-semibold text-apa-navy">{c.authorName}</span>
                          <span className="text-apa-grey"> · {new Date(c.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                          <span className="ml-1 text-apa-ink">{c.body}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {/* Governance decision form */}
                  <form action={reviewProposal} className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
                    <input type="hidden" name="proposalId" value={p.id} />
                    <input type="hidden" name="locale" value={locale} />
                    <input name="reviewNote" placeholder="Decision note to partner (added to thread)" className="rounded-md border border-apa-line px-3 py-2 text-sm" />
                    <div className="flex flex-wrap items-center gap-2">
                      <input name="assignedReviewer" defaultValue={p.assignedReviewerId ?? ''} placeholder="Reviewer" className="w-28 rounded-md border border-apa-line px-2 py-2 text-sm" />
                      <input name="qualityScore" type="number" min={0} max={100} defaultValue={p.qualityScore ?? undefined} placeholder="Score" className="w-20 rounded-md border border-apa-line px-2 py-2 text-sm" />
                      <select name="status" defaultValue={p.status} className="rounded-md border border-apa-line px-2 py-2 text-sm">
                        <option value="UNDER_REVIEW">Under review</option>
                        <option value="REVISIONS_REQUESTED">Request changes</option>
                        <option value="APPROVED">Approve</option>
                        <option value="PUBLISHED">Publish</option>
                        <option value="REJECTED">Reject</option>
                      </select>
                      <button type="submit" className="rounded-md bg-apa-green px-4 py-2 text-sm font-bold text-white hover:bg-apa-green-mid">Save</button>
                    </div>
                  </form>
                  <form action={addProposalComment} className="mt-2 flex gap-2">
                    <input type="hidden" name="proposalId" value={p.id} />
                    <input type="hidden" name="locale" value={locale} />
                    <input name="body" placeholder="Add a comment…" className="flex-1 rounded-md border border-apa-line px-3 py-2 text-sm" />
                    <button type="submit" className="rounded-md border border-apa-green px-3 py-2 text-sm font-semibold text-apa-green hover:bg-apa-green hover:text-white">Comment</button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}

      <div className="mt-8">
        <JourneyAdmin journeys={JOURNEYS} />
      </div>
    </div>
  );
}
