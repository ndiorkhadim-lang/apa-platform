import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader } from '@/components/site/section-header';

interface Kpi {
  value: string;
  label: string;
}
interface TopCountry {
  flag: string;
  name: string;
  score: number;
}
interface RegionRow {
  region: string;
  countries: number;
  success: string;
  fdi: string;
}

export default async function DashboardPreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('DashboardPreview');

  const kpis = t.raw('kpis') as Kpi[];
  const topCountries = t.raw('topCountries') as TopCountry[];
  const regionRows = t.raw('regionRows') as RegionRow[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeader num={t('secnum')} title={t('title')} subtitle={t('subtitle')} />

      {/* KPI band on brand gradient */}
      <div className="apa-gradient mt-8 grid grid-cols-2 gap-3 rounded-apa-lg p-5 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((k) => (
          <div key={k.label} className="apa-kpi px-3 py-4 text-center">
            <div className="text-xl font-extrabold text-apa-gold-bright">{k.value}</div>
            <div className="mt-1 text-[11px] leading-tight text-apa-mint">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Authenticity Premium by country */}
      <h2 className="mt-12 text-xl font-bold text-apa-green">{t('topTitle')}</h2>
      <div className="mt-4 space-y-2">
        {topCountries.map((c) => (
          <div key={c.name} className="flex items-center gap-3">
            <span className="w-36 shrink-0 text-sm font-semibold text-apa-navy">
              {c.flag} {c.name}
            </span>
            <div className="h-5 flex-1 overflow-hidden rounded bg-apa-soft">
              <div
                className="apa-gradient h-full rounded"
                style={{ width: `${c.score}%` }}
              />
            </div>
            <span className="w-12 text-right text-sm font-bold text-apa-green">
              {c.score}%
            </span>
          </div>
        ))}
      </div>

      {/* Success by region */}
      <h2 className="mt-12 text-xl font-bold text-apa-green">{t('regionTitle')}</h2>
      <table className="mt-4 w-full border-collapse text-sm">
        <thead>
          <tr className="bg-apa-green text-left text-xs uppercase text-white">
            <th className="px-3 py-2">{t('regionCols.region')}</th>
            <th className="px-3 py-2">{t('regionCols.countries')}</th>
            <th className="px-3 py-2">{t('regionCols.success')}</th>
            <th className="px-3 py-2">{t('regionCols.fdi')}</th>
          </tr>
        </thead>
        <tbody>
          {regionRows.map((r) => (
            <tr key={r.region} className="border border-apa-line even:bg-apa-soft">
              <td className="px-3 py-2 font-semibold text-apa-navy">{r.region}</td>
              <td className="px-3 py-2">{r.countries}</td>
              <td className="px-3 py-2 font-bold text-apa-green">{r.success}</td>
              <td className="px-3 py-2">{r.fdi}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-8 text-xs italic text-apa-grey">{t('disclaimer')}</p>
    </div>
  );
}
