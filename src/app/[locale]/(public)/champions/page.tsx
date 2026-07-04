import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader } from '@/components/site/section-header';
import { prisma } from '@/infrastructure/prisma/client';

const REGION_ORDER = ['West', 'East', 'Central', 'North', 'Southern'] as const;

/** ISO 3166-1 alpha-2 → flag emoji */
function flagOf(code: string): string {
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

export default async function ChampionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Champions');
  const isFr = locale === 'fr';

  const nations = await prisma.nation.findMany({
    where: { isPriority: true },
    orderBy: { acriScore: 'desc' },
  });

  const byRegion = REGION_ORDER.map((region) => ({
    region,
    nations: nations.filter((n) => n.region === region),
  })).filter((g) => g.nations.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeader num={t('secnum')} title={t('title')} subtitle={t('subtitle')} />

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {byRegion.map(({ region, nations: list }) => (
          <section key={region} className="rounded-apa border border-apa-line bg-white p-5">
            <h2 className="flex items-center justify-between font-bold text-apa-green">
              <span>🌍 {t(`regions.${region}`)}</span>
              <span className="text-xs font-semibold text-apa-grey">
                {t('countriesCount', { count: list.length })}
              </span>
            </h2>
            <ul className="mt-4 space-y-3">
              {list.map((n) => (
                <li key={n.code} className="border-b border-apa-mist pb-3 last:border-0 last:pb-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg">{flagOf(n.code)}</span>
                    <span className="font-bold text-apa-navy">
                      {isFr ? n.nameFr : n.nameEn}
                    </span>
                    {n.strategicNote ? (
                      <span className="rounded bg-apa-soft px-2 py-0.5 text-[10px] font-semibold text-apa-green">
                        {n.strategicNote}
                      </span>
                    ) : null}
                    <span
                      className={`ml-auto rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        n.activationTier === 1
                          ? 'bg-apa-green text-white'
                          : 'bg-apa-gold text-apa-ink'
                      }`}
                    >
                      {t('tier', { tier: n.activationTier ?? 0 })} ·{' '}
                      {t('acri', { score: n.acriScore ?? 0 })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-apa-ink">
                    {n.championName ? (
                      <>
                        <span className="font-semibold">{n.championName}</span>
                        {n.championTitle ? (
                          <span className="text-apa-grey"> · {n.championTitle}</span>
                        ) : null}
                      </>
                    ) : (
                      <span className="italic text-apa-grey">{t('championPending')}</span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="apa-box apa-box-gold mt-8 p-4 text-sm text-apa-ink">{t('hubsNote')}</p>
    </div>
  );
}
