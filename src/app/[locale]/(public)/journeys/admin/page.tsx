import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { dbAvailable, prisma } from '@/infrastructure/prisma/client';
import { JOURNEYS } from '@/data/journeys';
import { JourneyAdmin } from '@/components/journey/JourneyAdmin';
import { reviewProposal } from './proposal-actions';

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
        include: { partner: { select: { name: true, email: true } } },
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
            <div className="space-y-3">
              {proposals.map((p) => (
                <div key={p.id} className="rounded-apa-lg border border-apa-line bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-apa-navy">{p.title}</div>
                      <div className="text-xs text-apa-grey">
                        {p.partner.name} ({p.partner.email}) · {p.roleTier} · {p.country} · {p.durationDays ?? '—'} days
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${PS[p.status] ?? 'bg-apa-soft text-apa-grey'}`}>{p.status.replace('_', ' ')}</span>
                  </div>
                  <p className="mt-2 text-sm text-apa-ink">{p.summary}</p>
                  <form action={reviewProposal} className="mt-3 flex flex-wrap items-end gap-2">
                    <input type="hidden" name="proposalId" value={p.id} />
                    <input type="hidden" name="locale" value={locale} />
                    <input name="reviewNote" placeholder="Note to partner (optional)" className="min-w-48 flex-1 rounded-md border border-apa-line px-3 py-2 text-sm" />
                    <select name="status" defaultValue={p.status} className="rounded-md border border-apa-line px-2 py-2 text-sm">
                      <option value="UNDER_REVIEW">Under review</option>
                      <option value="REVISIONS_REQUESTED">Request revisions</option>
                      <option value="APPROVED">Approve</option>
                      <option value="PUBLISHED">Publish</option>
                      <option value="REJECTED">Reject</option>
                    </select>
                    <button type="submit" className="rounded-md bg-apa-green px-4 py-2 text-sm font-bold text-white hover:bg-apa-green-mid">Save</button>
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
