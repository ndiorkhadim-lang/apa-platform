import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader } from '@/components/site/section-header';
import { Link } from '@/i18n/navigation';

interface SolutionItem {
  num: string;
  name: string;
  tag: string;
  audience: string;
  desc: string;
}
interface Package {
  name: string;
  features: string[];
  ideal: string;
}

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Solutions');

  const items = t.raw('items') as SolutionItem[];
  const packages = t.raw('packages') as Package[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeader num={t('secnum')} title={t('title')} subtitle={t('subtitle')} />

      {/* Solutions cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <article
            key={s.num}
            className="flex flex-col rounded-apa border border-apa-line bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-2">
              <span className="apa-secnum text-sm">{s.num}</span>
              {s.tag ? (
                <span className="rounded bg-apa-soft px-2 py-0.5 text-[10px] font-bold text-apa-green">
                  {s.tag}
                </span>
              ) : null}
            </div>
            <h2 className="mt-3 font-bold text-apa-navy">{s.name}</h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-apa-grey">
              {s.audience}
            </p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-apa-ink">{s.desc}</p>
          </article>
        ))}
      </div>

      {/* Packages */}
      <h2 className="mt-14 text-xl font-bold text-apa-green">{t('packagesTitle')}</h2>
      <div className="mt-2 h-[3px] w-full bg-apa-gold" />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {packages.map((p, i) => (
          <article
            key={p.name}
            className={`flex flex-col rounded-apa-lg border p-6 ${
              i === 1
                ? 'apa-gradient border-transparent text-white shadow-lg'
                : 'border-apa-line bg-white'
            }`}
          >
            <h3 className={`font-bold ${i === 1 ? 'text-apa-gold-bright' : 'text-apa-navy'}`}>
              {p.name}
            </h3>
            <p className={`mt-1 text-sm font-semibold ${i === 1 ? 'text-apa-mint' : 'text-apa-grey'}`}>
              {t('quote')}
            </p>
            <ul className={`mt-4 flex-1 space-y-2 text-sm ${i === 1 ? 'text-apa-mint' : 'text-apa-ink'}`}>
              {p.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className={i === 1 ? 'text-apa-gold-bright' : 'text-apa-green'}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <p className={`mt-4 text-xs italic ${i === 1 ? 'text-apa-sage' : 'text-apa-grey'}`}>
              {p.ideal}
            </p>
          </article>
        ))}
      </div>

      {/* AI advisor teaser */}
      <div className="apa-box apa-box-gold mt-12 flex flex-wrap items-center justify-between gap-4 p-5">
        <p className="text-sm text-apa-ink">
          <span className="font-bold text-apa-green">{t('advisorLabel')}</span>{' '}
          <span className="italic">{t('advisorQuote')}</span>
        </p>
        <Link
          href="/intelligence"
          className="rounded-md bg-apa-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-apa-green-mid"
        >
          {t('advisorAction')}
        </Link>
      </div>
    </div>
  );
}
