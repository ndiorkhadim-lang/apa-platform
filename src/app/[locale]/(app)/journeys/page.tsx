import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { JOURNEYS, MOCK_USERS } from '@/data/journeys';
import type { JourneyUserType } from '@/types/journey';
import { JourneyBrowser } from '@/components/journey/JourneyBrowser';
import { JourneyAlerts } from '@/components/journey/JourneyAlerts';
import { ROLE_ORDER, ROLE_META } from '@/types/journey';

export default async function JourneysPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;

  // Role for the Journey experience. `?as=partner|explorer` previews each;
  // otherwise ADMIN_APA maps to partner, everyone else to explorer.
  const session = await getSession();
  const platformRole = (session?.user as { platformRole?: string } | undefined)?.platformRole;
  const asParam = sp.as;
  const role: JourneyUserType =
    asParam === 'partner'
      ? 'partner_business'
      : asParam === 'explorer'
        ? 'explorer'
        : platformRole === 'ADMIN_APA'
          ? 'partner_business'
          : 'explorer';
  const currentUserId = role === 'partner_business' ? MOCK_USERS.partner.id : MOCK_USERS.explorer.id;
  const tab = sp.tab === 'submit' ? 'submit' : 'browse';

  // ── Journey Partner CTA state ──────────────────────────
  // Resolve where "Apply as a Journey Partner" should lead, and its label.
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const isJourneyPartner = Boolean((session?.user as { journeyPartner?: boolean } | undefined)?.journeyPartner);
  let partnerApp: { status: string } | null = null;
  if (session && userId) {
    const { dbAvailable } = await import('@/infrastructure/prisma/client');
    if (dbAvailable) {
      const { prisma } = await import('@/infrastructure/prisma/client');
      partnerApp = await prisma.championApplication.findUnique({
        where: { userId_type: { userId, type: 'PARTNER' } },
        select: { status: true },
      });
    }
  }
  const applyHref = '/journeys/partner/apply';
  const partnerCta = !session
    ? { href: `/sign-up?redirect=${encodeURIComponent(applyHref)}`, label: 'Apply as a Journey Partner', note: 'Create your account, then complete the Partner Application Form.' }
    : isJourneyPartner
      ? { href: '/journeys/partner', label: 'Open your Partner Dashboard', note: 'Submit and manage your journey proposals.' }
      : partnerApp && partnerApp.status !== 'DRAFT'
        ? { href: applyHref, label: 'Track your Partner application', note: `Status: ${partnerApp.status} — APA is reviewing your application.` }
        : { href: applyHref, label: 'Apply as a Journey Partner', note: 'Complete the Partner Application Form to submit journeys.' };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="apa-secnum text-lg">✦</span>
          <h1 className="mt-3 text-3xl font-bold text-apa-green">APA Journeys</h1>
          <div className="apa-rule my-3" />
          <p className="max-w-2xl text-sm text-apa-grey">
            Immersive field experiences that place leaders at the direct interface of African enterprise,
            governance and community — turning ethical governance into measurable enterprise value.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {/* Role preview switch (demo) */}
          <div className="flex items-center gap-1 rounded-md border border-apa-line p-1 text-xs font-semibold">
            <span className="px-2 text-apa-grey">View as</span>
            <Link href="/journeys?as=explorer" className={`rounded px-2 py-1 ${role === 'explorer' ? 'bg-apa-green text-white' : 'text-apa-navy'}`}>
              Explorer
            </Link>
            <Link href="/journeys?as=partner" className={`rounded px-2 py-1 ${role === 'partner_business' ? 'bg-apa-green text-white' : 'text-apa-navy'}`}>
              Partner
            </Link>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <Link href="/journeys/dashboard" className="text-apa-green hover:underline">My Dashboard</Link>
            <span className="text-apa-line">|</span>
            <Link href="/journeys/admin" className="text-apa-grey hover:text-apa-green">Admin</Link>
          </div>
        </div>
      </header>

      {/* Become a Journey Partner — prominent CTA hero */}
      <div className="mt-8 overflow-hidden rounded-apa-lg apa-gradient">
        <div className="px-6 py-8 text-white sm:px-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-2xl">
              <span className="rounded bg-white/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-apa-gold-bright">Partner Program · Open call</span>
              <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">Become an APA Journey Partner</h2>
              <p className="mt-2 text-sm text-apa-mint">
                Organizations — governments, NGOs, universities, DFIs, foundations and companies — can certify with APA and
                publish their own immersive Strategic Journeys. {partnerCta.note}
              </p>
            </div>
            <Link
              href={partnerCta.href}
              className="shrink-0 rounded-md bg-white px-6 py-3.5 text-sm font-bold text-apa-green shadow-sm transition-colors hover:bg-apa-soft"
            >
              {partnerCta.label} →
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-[12px] font-semibold">
            {['One unified application', 'Submit your first journey', 'APA governance review', 'Partner Dashboard on approval'].map((b) => (
              <span key={b} className="rounded-full bg-white/12 px-3 py-1.5 text-white/90 ring-1 ring-white/15">✓ {b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Role tiers */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {ROLE_ORDER.map((r) => (
          <Link
            key={r}
            href={`/journeys/roles/${ROLE_META[r].slug}`}
            className="group rounded-apa-lg border border-apa-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-apa-green hover:shadow-md"
          >
            <span className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${ROLE_META[r].badge}`}>{ROLE_META[r].label}</span>
            <p className="mt-3 text-sm text-apa-ink">{ROLE_META[r].description}</p>
            <span className="mt-3 inline-block text-xs font-bold text-apa-green group-hover:underline">Explore the {ROLE_META[r].label} pathway →</span>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <JourneyBrowser journeys={JOURNEYS} role={role} currentUserId={currentUserId} initialTab={tab} />
      </div>

      {/* Journey alerts */}
      <div className="mt-12">
        <div className="flex items-center gap-3">
          <span className="apa-secnum text-sm">✦</span>
          <h2 className="text-xl font-bold text-apa-navy">Not ready yet? Get notified</h2>
        </div>
        <div className="apa-rule my-3" />
        <div className="mt-4">
          <JourneyAlerts />
        </div>
      </div>
    </div>
  );
}
