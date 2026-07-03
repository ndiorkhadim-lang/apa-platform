import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

const KPI_KEYS = ['fdi', 'bps', 'tools', 'nations', 'valuation', 'months'] as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Home');

  return (
    <>
      {/* ── Hero — V8 screen 01 "Sovereign Dashboard" ── */}
      <section className="apa-gradient text-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <span className="apa-badge">{t('topbar')}</span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            {t('heroTitle')}
          </h1>
          <div className="apa-rule my-6" />
          <p className="max-w-3xl text-base leading-relaxed text-apa-mint">
            {t('heroLead')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-md border border-apa-gold-bright px-5 py-2.5 text-sm font-semibold text-apa-gold-bright transition-colors hover:bg-apa-gold-bright hover:text-apa-ink"
            >
              {t('ctaDashboard')} →
            </Link>
            <Link
              href="/tools"
              className="rounded-md border border-apa-gold-bright px-5 py-2.5 text-sm font-semibold text-apa-gold-bright transition-colors hover:bg-apa-gold-bright hover:text-apa-ink"
            >
              {t('ctaTools')} →
            </Link>
            <Link
              href="/certification"
              className="rounded-md bg-apa-gold-bright px-5 py-2.5 text-sm font-semibold text-apa-ink transition-colors hover:bg-apa-gold"
            >
              {t('ctaCertify')} →
            </Link>
          </div>

          {/* KPI band on the gradient, as on the V8 cover */}
          <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {KPI_KEYS.map((k) => (
              <div key={k} className="apa-kpi px-3 py-4 text-center">
                <div className="text-xl font-extrabold text-apa-gold-bright">
                  {t(`kpis.${k}.value`)}
                </div>
                <div className="mt-1 text-[11px] leading-tight text-apa-mint">
                  {t(`kpis.${k}.label`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Executive summary — 3 accent boxes ── */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-apa-green">{t('execTitle')}</h2>
        <div className="mt-2 h-[3px] w-full bg-apa-gold" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="apa-box p-5">
            <h3 className="font-bold text-apa-green">{t('execContextTitle')}</h3>
            <p className="mt-2 text-sm leading-relaxed text-apa-ink">
              {t('execContextBody')}
            </p>
          </div>
          <div className="apa-box apa-box-gold p-5">
            <h3 className="font-bold text-apa-green">{t('execVoidTitle')}</h3>
            <p className="mt-2 text-sm leading-relaxed text-apa-ink">
              {t('execVoidBody')}
            </p>
          </div>
          <div className="apa-box apa-box-navy p-5">
            <h3 className="font-bold text-apa-green">{t('execWhyTitle')}</h3>
            <p className="mt-2 text-sm leading-relaxed text-apa-ink">
              {t('execWhyBody')}
            </p>
          </div>
        </div>
      </section>

      {/* ── 3-beat engagement arc ── */}
      <section className="bg-apa-soft">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold text-apa-green">{t('arcTitle')}</h2>
          <div className="mt-2 h-[3px] w-full bg-apa-gold" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {([1, 2, 3] as const).map((n) => (
              <div
                key={n}
                className="rounded-apa border border-apa-line bg-white p-6"
              >
                <span className="apa-secnum text-sm">{t(`arc${n}Step`)}</span>
                <h3 className="mt-4 text-lg font-bold text-apa-navy">
                  {t(`arc${n}Title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-apa-grey">
                  {t(`arc${n}Body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
