import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { JOURNEYS } from '@/data/journeys';
import { JourneyAdmin } from '@/components/journey/JourneyAdmin';

export const dynamic = 'force-dynamic';

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

      <div className="mt-8">
        <JourneyAdmin journeys={JOURNEYS} />
      </div>
    </div>
  );
}
