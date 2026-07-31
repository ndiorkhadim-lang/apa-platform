export const dynamic = 'force-dynamic';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { dbAvailable, prisma } from '@/infrastructure/prisma/client';
import { ProposalForm } from '@/components/journey/ProposalForm';
import { ROLE_META } from '@/types/journey';

const STATUS_STYLE: Record<string, string> = {
  DRAFT: 'bg-apa-soft text-apa-grey',
  SUBMITTED: 'bg-apa-navy text-white',
  UNDER_REVIEW: 'bg-apa-gold text-apa-ink',
  REVISIONS_REQUESTED: 'bg-apa-bronze text-white',
  APPROVED: 'bg-apa-green text-white',
  PUBLISHED: 'bg-apa-green-mid text-white',
  REJECTED: 'bg-red-700 text-white',
};

const fmt = (iso: Date) => new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
const money = (n: number | null) => (n == null ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n));

export default async function PartnerDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getSession();
  const user = session?.user as { id?: string; name?: string; journeyPartner?: boolean; platformRole?: string } | undefined;
  const isPartner = Boolean(user?.journeyPartner) || user?.platformRole === 'ADMIN_APA';

  // ── Access gate — not an approved partner ──────────────
  if (!isPartner) {
    const applyHref = '/champions/apply?type=partner';
    let appStatus: string | null = null;
    if (session && user?.id && dbAvailable) {
      const app = await prisma.championApplication.findUnique({
        where: { userId_type: { userId: user.id, type: 'PARTNER' } },
        select: { status: true },
      });
      appStatus = app && app.status !== 'DRAFT' ? app.status : null;
    }
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <span className="apa-secnum text-sm">Partner</span>
        <h1 className="mt-3 text-2xl font-bold text-apa-green">Journey Partner Dashboard</h1>
        <div className="apa-rule mx-auto my-4" />
        {appStatus ? (
          <div className="apa-box apa-box-gold p-5 text-left text-sm">
            <p className="font-bold text-apa-navy">Your Partner application is <span className="uppercase">{appStatus}</span>.</p>
            <p className="mt-1 text-apa-ink">APA is reviewing your application. Once approved, this dashboard unlocks so you can submit and manage journey proposals. You’ll be notified by email.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-apa-grey">
              This dashboard is for approved Journey Partners. {session ? 'Complete the Partner Application Form to request access.' : 'Create your account, then complete the Partner Application Form.'}
            </p>
            <Link
              href={session ? applyHref : `/sign-up?redirect=${encodeURIComponent(applyHref)}`}
              className="mt-6 inline-block rounded-md bg-apa-green px-6 py-3 text-sm font-bold text-white hover:bg-apa-green-mid"
            >
              Apply as a Journey Partner →
            </Link>
          </>
        )}
        <div className="mt-6">
          <Link href="/journeys" className="text-sm font-semibold text-apa-grey hover:text-apa-green">← Back to Journeys</Link>
        </div>
      </div>
    );
  }

  // ── Approved partner — the dashboard ───────────────────
  const proposals = user?.id && dbAvailable
    ? await prisma.journeyProposal.findMany({ where: { partnerId: user.id }, orderBy: { createdAt: 'desc' } })
    : [];
  const counts = {
    total: proposals.length,
    review: proposals.filter((p) => ['SUBMITTED', 'UNDER_REVIEW'].includes(p.status)).length,
    published: proposals.filter((p) => p.status === 'PUBLISHED' || p.status === 'APPROVED').length,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="apa-secnum text-sm">Partner</span>
          <h1 className="mt-3 text-3xl font-bold text-apa-green">Partner Dashboard</h1>
          <div className="apa-rule my-3" />
          <p className="max-w-2xl text-sm text-apa-grey">
            Welcome{user?.name ? `, ${user.name}` : ''}. Submit new journey proposals and track them through APA review to publication.
          </p>
        </div>
        <Link href="/journeys" className="text-xs font-semibold text-apa-grey hover:text-apa-green">← All journeys</Link>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-apa-lg border border-apa-line bg-white p-4 text-center"><div className="text-3xl font-bold text-apa-green">{counts.total}</div><div className="text-xs font-semibold uppercase text-apa-grey">Proposals</div></div>
        <div className="rounded-apa-lg border border-apa-line bg-white p-4 text-center"><div className="text-3xl font-bold text-apa-gold-bright">{counts.review}</div><div className="text-xs font-semibold uppercase text-apa-grey">In review</div></div>
        <div className="rounded-apa-lg border border-apa-line bg-white p-4 text-center"><div className="text-3xl font-bold text-apa-green-mid">{counts.published}</div><div className="text-xs font-semibold uppercase text-apa-grey">Approved / live</div></div>
      </div>

      <div className="mt-8">
        <ProposalForm locale={locale} />
      </div>

      <h2 className="mt-10 text-lg font-bold text-apa-navy">My journey proposals</h2>
      <div className="apa-rule my-3" />
      {proposals.length === 0 ? (
        <div className="apa-box p-6 text-sm text-apa-grey">No proposals yet — submit your first journey above. It will enter APA review before publication.</div>
      ) : (
        <div className="space-y-3">
          {proposals.map((p) => (
            <div key={p.id} className="rounded-apa-lg border border-apa-line bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-apa-navy">{p.title}</div>
                  <div className="text-xs text-apa-grey">
                    {ROLE_META[p.roleTier as keyof typeof ROLE_META]?.label ?? p.roleTier} · {p.country} · {p.durationDays ?? '—'} days · {money(p.priceUSD)} · submitted {fmt(p.createdAt)}
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${STATUS_STYLE[p.status] ?? 'bg-apa-soft text-apa-grey'}`}>
                  {p.status.replace('_', ' ')}
                </span>
              </div>
              {p.reviewNote ? <p className="mt-2 rounded-apa bg-apa-soft p-2 text-xs text-apa-ink"><b>APA note:</b> {p.reviewNote}</p> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
