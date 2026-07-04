import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader } from '@/components/site/section-header';

interface Impact {
  title: string;
  desc: string;
}
interface ContactRow {
  channel: string;
  detail: string;
}

function renderDetail(detail: string) {
  if (detail.includes('@')) {
    return (
      <a href={`mailto:${detail}`} className="text-apa-green underline">
        {detail}
      </a>
    );
  }
  if (detail.startsWith('http')) {
    return (
      <a href={detail} target="_blank" rel="noopener noreferrer" className="text-apa-green underline">
        {detail}
      </a>
    );
  }
  return detail;
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Contact');

  const impacts = t.raw('impacts') as Impact[];
  const rows = t.raw('rows') as ContactRow[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeader num={t('secnum')} title={t('title')} />

      {/* Impact cards */}
      <h2 className="mt-10 text-xl font-bold text-apa-green">{t('impactTitle')}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {impacts.map((im, i) => (
          <div
            key={im.title}
            className={`apa-box p-5 ${i === 1 ? 'apa-box-gold' : i === 2 ? 'apa-box-navy' : ''}`}
          >
            <h3 className="font-bold text-apa-green">{im.title}</h3>
            <p className="mt-2 text-sm leading-relaxed">{im.desc}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm text-apa-ink">
        <span className="font-bold text-apa-green">{t('indicatorsLabel')}</span>{' '}
        {t('indicators')}
      </p>

      {/* Contact table */}
      <h2 className="mt-14 text-xl font-bold text-apa-green">{t('contactTitle')}</h2>
      <div className="mt-2 h-[3px] w-full bg-apa-gold" />
      <div className="mt-6 max-w-2xl overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-apa-green text-left text-xs uppercase text-white">
              <th className="px-3 py-2">{t('cols.channel')}</th>
              <th className="px-3 py-2">{t('cols.detail')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.channel} className="border border-apa-line even:bg-apa-soft">
                <td className="whitespace-nowrap px-3 py-2 font-bold text-apa-navy">
                  {r.channel}
                </td>
                <td className="px-3 py-2">{renderDetail(r.detail)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pre-qualification deck */}
      <div className="apa-box apa-box-gold mt-10 max-w-2xl p-5">
        <h3 className="font-bold text-apa-green">{t('downloadTitle')}</h3>
        <p className="mt-2 text-sm">{t('downloadDesc')}</p>
      </div>
    </div>
  );
}
