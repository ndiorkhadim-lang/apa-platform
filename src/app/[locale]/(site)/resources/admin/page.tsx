import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { RESOURCES } from '@/data/resources';
import { ResourceAdmin } from '@/components/resources/ResourceAdmin';

export const dynamic = 'force-dynamic';

export default async function ResourceAdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getSession();
  const isAdmin = (session?.user as { platformRole?: string } | undefined)?.platformRole === 'ADMIN_APA';

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="apa-secnum text-sm">✦</span>
          <h1 className="mt-3 text-3xl font-bold text-apa-green">Knowledge Center — Resource Management</h1>
          <div className="apa-rule my-3" />
          <p className="max-w-2xl text-sm text-apa-grey">
            Upload PDFs and videos, create articles and guides, manage categories, countries, languages and authors,
            schedule publications, feature or archive content, and track analytics.
          </p>
        </div>
        <Link href="/resources" className="rounded-md border border-apa-line px-4 py-2.5 text-sm font-semibold text-apa-navy hover:border-apa-green">← Public library</Link>
      </header>

      {!isAdmin ? (
        <div className="apa-box apa-box-gold mt-6 p-4 text-sm text-apa-ink">
          <strong>Preview mode.</strong> You are viewing the CMS without an APA admin session. Actions run locally for
          demonstration; with an <code>ADMIN_APA</code> session they persist to the platform.
        </div>
      ) : null}

      <div className="mt-8">
        <ResourceAdmin resources={RESOURCES} />
      </div>
    </div>
  );
}
