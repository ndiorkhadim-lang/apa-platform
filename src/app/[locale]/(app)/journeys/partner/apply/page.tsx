export const dynamic = 'force-dynamic';
import { setRequestLocale } from 'next-intl/server';
import { redirect, Link } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { dbAvailable, prisma } from '@/infrastructure/prisma/client';
import { DBNotReady } from '@/components/site/db-not-ready';
import { PartnerApplicationWizard } from '@/components/journey/PartnerApplicationWizard';

export default async function PartnerApplyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getSession();
  const user = session?.user as { id?: string; name?: string; email?: string; journeyPartner?: boolean; platformRole?: string } | undefined;
  const authenticated = Boolean(session && user?.id);

  // Approved partners skip straight to the dashboard.
  if (authenticated && (user?.journeyPartner || user?.platformRole === 'ADMIN_APA')) {
    redirect({ href: '/journeys/partner', locale });
  }

  if (!dbAvailable) return <DBNotReady locale={locale} />;

  // Already submitted? Show status instead of a fresh wizard.
  let alreadySubmitted: string | null = null;
  if (authenticated && user?.id) {
    const existing = await prisma.championApplication.findUnique({
      where: { userId_type: { userId: user.id, type: 'PARTNER' } },
      select: { status: true },
    });
    if (existing && existing.status !== 'DRAFT') alreadySubmitted = existing.status;
  }

  // The 63 GRC tools power the "Applicable APA Tools" chip search.
  const toolRows = await prisma.tool.findMany({ orderBy: { number: 'asc' }, select: { number: true, nameEn: true } });
  const tools = toolRows.map((t) => ({ number: t.number, name: t.nameEn }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-apa-green/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-apa-green">✦ Partner Program</span>
        <h1 className="mt-3 text-3xl font-bold text-apa-green sm:text-4xl">Apply as a Journey Partner</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-apa-grey">
          One intelligent application to certify your organization as an APA Journey Partner <em>and</em> submit your first immersive Strategic Journey. APA reviews both together.
        </p>
      </header>

      {alreadySubmitted ? (
        <div className="apa-box apa-box-gold mx-auto max-w-2xl p-6 text-center text-sm">
          <p className="font-bold text-apa-navy">Your Partner application is <span className="uppercase">{alreadySubmitted}</span>.</p>
          <p className="mt-1 text-apa-ink">APA is reviewing your application and first journey. You’ll be notified by email once a decision is made.</p>
          <Link href="/journeys/partner" className="mt-4 inline-block rounded-md bg-apa-green px-5 py-2.5 text-sm font-bold text-white hover:bg-apa-green-mid">Go to Partner Dashboard →</Link>
        </div>
      ) : (
        <PartnerApplicationWizard
          locale={locale}
          authenticated={authenticated}
          defaultEmail={user?.email}
          userName={user?.name}
          tools={tools}
        />
      )}

      <div className="mt-8 text-center">
        <Link href="/journeys" className="text-sm font-semibold text-apa-grey hover:text-apa-green">← Back to Journeys</Link>
      </div>
    </div>
  );
}
