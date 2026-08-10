import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { JOURNEYS } from '@/data/journeys';
import { JourneyDashboard } from '@/components/journey/JourneyDashboard';

export const dynamic = 'force-dynamic';

export default async function JourneyDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="apa-secnum text-sm">✦</span>
          <h1 className="mt-3 text-3xl font-bold text-apa-green">My Journey Dashboard</h1>
          <div className="apa-rule my-3" />
          <p className="max-w-2xl text-sm text-apa-grey">
            Track your applications, upcoming sessions, saved journeys, recommendations and alerts in one place.
          </p>
        </div>
        <Link href="/journeys" className="rounded-md bg-apa-green px-4 py-2.5 text-sm font-bold text-white hover:bg-apa-green-mid">
          Browse journeys
        </Link>
      </header>

      <div className="mt-8">
        <JourneyDashboard recommended={JOURNEYS} locale={locale} />
      </div>
    </div>
  );
}
