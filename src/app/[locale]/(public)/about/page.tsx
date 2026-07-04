import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader } from '@/components/site/section-header';

interface Value {
  name: string;
  desc: string;
}
interface Advisor {
  name: string;
  flag: string;
  profile: string;
}
interface Founder {
  name: string;
  role: string;
  bio: string;
  tags: string[];
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('About');

  const values = t.raw('values') as Value[];
  const advisors = t.raw('advisors') as Advisor[];
  const founders = t.raw('founders') as Founder[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeader num={t('secnum')} title={t('title')} />

      {/* Mission / Vision / Value prop */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="apa-box p-5">
          <h2 className="font-bold text-apa-green">{t('missionTitle')}</h2>
          <p className="mt-2 text-sm leading-relaxed">{t('mission')}</p>
        </div>
        <div className="apa-box apa-box-gold p-5">
          <h2 className="font-bold text-apa-green">{t('visionTitle')}</h2>
          <p className="mt-2 text-sm leading-relaxed">{t('vision')}</p>
        </div>
        <div className="apa-box apa-box-navy p-5">
          <h2 className="font-bold text-apa-green">{t('valuePropTitle')}</h2>
          <p className="mt-2 text-sm leading-relaxed">{t('valueProp')}</p>
        </div>
      </div>

      {/* Values */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((v) => (
          <div key={v.name} className="rounded-apa border border-apa-line bg-white p-4">
            <span className="font-bold text-apa-navy">{v.name}</span>
            <p className="mt-1 text-sm text-apa-grey">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* Screen 02 — Advisory board & dual leadership */}
      <div className="mt-16">
        <SectionHeader num={t('advisorySecnum')} title={t('advisoryTitle')} />
      </div>

      <h3 className="mt-8 text-lg font-bold text-apa-green">{t('advisoryBoardTitle')}</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-apa-green text-left text-xs uppercase text-white">
              <th className="px-3 py-2">{t('advisoryCols.member')}</th>
              <th className="px-3 py-2">{t('advisoryCols.profile')}</th>
            </tr>
          </thead>
          <tbody>
            {advisors.map((a) => (
              <tr key={a.name} className="border border-apa-line align-top even:bg-apa-soft">
                <td className="whitespace-nowrap px-3 py-2 font-bold text-apa-navy">
                  {a.name} {a.flag}
                </td>
                <td className="px-3 py-2">{a.profile}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mt-12 text-lg font-bold text-apa-green">{t('foundersTitle')}</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {founders.map((f) => (
          <article key={f.name} className="rounded-apa-lg border border-apa-line bg-white p-6">
            <h4 className="text-lg font-bold text-apa-navy">{f.name}</h4>
            <p className="text-sm font-semibold text-apa-gold">{f.role}</p>
            <p className="mt-3 text-sm leading-relaxed text-apa-ink">{f.bio}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {f.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-apa-sage bg-apa-soft px-2.5 py-0.5 text-[11px] font-semibold text-apa-green"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
