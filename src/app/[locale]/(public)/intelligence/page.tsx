import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader } from '@/components/site/section-header';
import { Link } from '@/i18n/navigation';

interface Tier {
  tier: string;
  access: string;
  content: string;
  price: string;
}

export default async function IntelligencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Intelligence');

  const suggestions = t.raw('suggestions') as string[];
  const tiers = t.raw('tiers') as Tier[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeader num={t('secnum')} title={t('title')} />

      {/* Navigator hero */}
      <div className="apa-gradient mt-8 rounded-apa-lg p-8 text-white">
        <span className="apa-badge">{t('navigatorBadge')}</span>
        <p className="mt-5 max-w-3xl text-lg italic leading-relaxed text-apa-mint">
          {t('navigatorQuote')}
        </p>
        <p className="mt-6 text-xs font-bold uppercase tracking-wide text-apa-gold-bright">
          {t('suggestionsLabel')}
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <li
              key={s}
              className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm text-apa-mint"
            >
              › {s}
            </li>
          ))}
        </ul>
      </div>

      {/* 4 access tiers */}
      <h2 className="mt-14 text-xl font-bold text-apa-green">{t('tiersTitle')}</h2>
      <div className="mt-2 h-[3px] w-full bg-apa-gold" />
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-apa-green text-left text-xs uppercase text-white">
              <th className="px-3 py-2">{t('tiersCols.tier')}</th>
              <th className="px-3 py-2">{t('tiersCols.access')}</th>
              <th className="px-3 py-2">{t('tiersCols.content')}</th>
              <th className="px-3 py-2">{t('tiersCols.price')}</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((row) => (
              <tr key={row.tier} className="border border-apa-line align-top even:bg-apa-soft">
                <td className="px-3 py-3 font-bold text-apa-navy">{row.tier}</td>
                <td className="px-3 py-3">{row.access}</td>
                <td className="px-3 py-3">{row.content}</td>
                <td className="px-3 py-3 font-bold text-apa-green">{row.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10">
        <Link
          href="/champions"
          className="rounded-md border border-apa-green px-5 py-2.5 text-sm font-semibold text-apa-green transition-colors hover:bg-apa-green hover:text-white"
        >
          {t('championsLink')}
        </Link>
      </div>
    </div>
  );
}
