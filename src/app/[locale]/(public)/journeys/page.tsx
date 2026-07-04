import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader } from '@/components/site/section-header';
import { Link } from '@/i18n/navigation';

interface Journey {
  slug: string;
  audience: string;
  heading: string;
  body: string;
  cta: string;
}

export default async function JourneysPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Journeys');

  const items = t.raw('items') as Journey[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeader num="✦" title={t('title')} subtitle={t('subtitle')} />

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((j) => (
          <article
            key={j.slug}
            id={j.slug}
            className="flex flex-col rounded-apa-lg border border-apa-line bg-white p-6 transition-shadow hover:shadow-md"
          >
            <span className="self-start rounded-full border border-apa-sage bg-apa-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-apa-green">
              {j.audience}
            </span>
            <h2 className="mt-4 text-lg font-bold leading-snug text-apa-navy">
              {j.heading}
            </h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-apa-ink">{j.body}</p>
            <p className="mt-4 text-xs font-semibold text-apa-gold">→ {j.cta}</p>
          </article>
        ))}
      </div>

      {/* Common journey CTAs (per the build template: Ask the Navigator / Get Certified) */}
      <div className="apa-gradient mt-12 flex flex-wrap items-center justify-center gap-4 rounded-apa-lg p-8">
        <Link
          href="/intelligence"
          className="rounded-md border border-apa-gold-bright px-5 py-2.5 text-sm font-semibold text-apa-gold-bright transition-colors hover:bg-apa-gold-bright hover:text-apa-ink"
        >
          {t('ctaNavigator')} →
        </Link>
        <Link
          href="/certification"
          className="rounded-md bg-apa-gold-bright px-5 py-2.5 text-sm font-semibold text-apa-ink transition-colors hover:bg-apa-gold"
        >
          {t('ctaCertify')} →
        </Link>
      </div>
    </div>
  );
}
