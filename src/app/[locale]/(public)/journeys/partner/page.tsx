export const dynamic = 'force-dynamic';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { dbAvailable, prisma } from '@/infrastructure/prisma/client';
import { PartnerDashboard, type DashProposal } from '@/components/journey/PartnerDashboard';

export default async function PartnerDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ submitted?: string }>;
}) {
  const { locale } = await params;
  const { submitted } = await searchParams;
  setRequestLocale(locale);

  const session = await getSession();
  const user = session?.user as { id?: string; name?: string; journeyPartner?: boolean; platformRole?: string } | undefined;
  const isPartner = Boolean(user?.journeyPartner) || user?.platformRole === 'ADMIN_APA';

  // ── Access gate — not an approved partner ──────────────
  if (!isPartner) {
    const applyHref = '/journeys/partner/apply';
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
        {submitted ? (
          <div className="mb-4 rounded-apa-lg border border-apa-green/30 bg-apa-green/5 p-5 text-left text-sm">
            <p className="font-bold text-apa-green">Application &amp; first journey received.</p>
            <p className="mt-1 text-apa-ink">Thank you. APA is now reviewing your Partner application together with your first Strategic Journey. Once validated, your account is upgraded to Partner and this dashboard unlocks.</p>
          </div>
        ) : null}
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

  // ── Approved partner — the tabbed dashboard ───────────
  const [rows, app] = user?.id && dbAvailable
    ? await Promise.all([
        prisma.journeyProposal.findMany({
          where: { partnerId: user.id },
          orderBy: { createdAt: 'desc' },
          include: { comments: { orderBy: { createdAt: 'asc' } } },
        }),
        prisma.championApplication.findUnique({
          where: { userId_type: { userId: user.id, type: 'PARTNER' } },
          select: { status: true, certificatesUrl: true },
        }),
      ])
    : [[], null];

  const proposals: DashProposal[] = rows.map((p) => ({
    id: p.id, title: p.title, status: p.status, sector: p.sector, location: p.location,
    country: p.country, durationDays: p.durationDays, maxCapacity: p.maxCapacity, priceUSD: p.priceUSD,
    createdAt: p.createdAt.toISOString(), publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    reviewNote: p.reviewNote, qualityScore: p.qualityScore, themeTags: p.themeTags,
    certificationAlignment: p.certificationAlignment, licenseFileName: app?.certificatesUrl ?? null,
    comments: p.comments.map((c) => ({ id: c.id, authorName: c.authorName, authorRole: c.authorRole, body: c.body, createdAt: c.createdAt.toISOString() })),
  }));

  return (
    <PartnerDashboard
      locale={locale}
      partnerName={user?.name}
      applicationStatus={app?.status ?? null}
      proposals={proposals}
    />
  );
}
