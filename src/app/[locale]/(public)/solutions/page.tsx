export const dynamic = 'force-dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader } from '@/components/site/section-header';
import { dbAvailable } from '@/infrastructure/prisma/client';
import { DBNotReady } from '@/components/site/db-not-ready';
import { Link } from '@/i18n/navigation';
import { prisma } from '@/infrastructure/prisma/client';
import {
  SOLUTIONS,
  AUDIENCE_LABEL,
  type Audience,
  solutionOf,
} from '@/domain/solutions/ecosystem';

const AUDIENCES: Audience[] = [
  'ENTERPRISE',
  'INVESTOR',
  'GOVERNMENT',
  'FOUNDATION',
  'SME',
  'DIASPORA',
];

const JOURNEY_LABEL: Record<string, { en: string; fr: string }> = {
  'investors-dfis': { en: 'Investors & DFIs', fr: 'Investisseurs & DFI' },
  'multinationals-esg': { en: 'Multinationals & ESG', fr: 'Multinationales & ESG' },
  'government-agencies': { en: 'Government & Agencies', fr: 'Gouvernements & Agences' },
  'foundations-grantmakers': { en: 'Foundations & Grantmakers', fr: 'Fondations & Bailleurs' },
  'celebrities-ambassadors': { en: 'Celebrities & Ambassadors', fr: 'Célébrités & Ambassadeurs' },
  diaspora: { en: 'Diaspora', fr: 'Diaspora' },
};

export default async function SolutionsCatalogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!dbAvailable) return <DBNotReady locale={locale} />;
  const fr = locale !== 'en';
  const sp = await searchParams;
  const t = await getTranslations('SolutionsCatalog');

  const audienceFilter =
    typeof sp.audience === 'string' && (AUDIENCES as string[]).includes(sp.audience)
      ? (sp.audience as Audience)
      : undefined;

  const [tools, pillars] = await Promise.all([
    prisma.tool.findMany({ select: { number: true, nameEn: true, nameFr: true, slug: true } }),
    prisma.pillar.findMany({ orderBy: { order: 'asc' } }),
  ]);
  const pillarName = (code: string) => {
    const p = pillars.find((x) => x.code === code);
    return p ? (fr ? p.nameFr : p.nameEn) : code;
  };
  const toolCountBySolution = (id: string) =>
    tools.filter((tool) => solutionOf(tool.number).id === id).length;

  const shown = audienceFilter
    ? SOLUTIONS.filter((s) => s.audiences.includes(audienceFilter))
    : SOLUTIONS;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeader num={t('secnum')} title={t('title')} subtitle={t('subtitle')} />

      {/* Audience filter */}
      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-wide text-apa-grey">{t('filterLabel')}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <a
            href="?"
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              !audienceFilter ? 'bg-apa-green text-white' : 'border border-apa-line bg-white text-apa-navy hover:border-apa-green'
            }`}
          >
            {t('all')}
          </a>
          {AUDIENCES.map((a) => (
            <a
              key={a}
              href={`?audience=${a}`}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                audienceFilter === a ? 'bg-apa-green text-white' : 'border border-apa-line bg-white text-apa-navy hover:border-apa-green'
              }`}
            >
              {fr ? AUDIENCE_LABEL[a].fr : AUDIENCE_LABEL[a].en}
            </a>
          ))}
        </div>
        <p className="mt-3 text-sm font-semibold text-apa-grey">{t('shown', { count: shown.length })}</p>
      </div>

      {/* Solution cards */}
      <div className="mt-6 space-y-5">
        {shown.map((s) => (
          <article key={s.id} className="rounded-apa-lg border border-apa-line bg-white p-6 transition-shadow hover:shadow-md">
            <div className="flex flex-wrap items-center gap-3">
              <span className="apa-secnum text-sm">{s.code}</span>
              <h2 className="text-xl font-bold text-apa-green">{fr ? s.nameFr : s.nameEn}</h2>
            </div>

            {/* Target audience — explicit */}
            <div className="mt-3">
              <span className="text-[11px] font-bold uppercase text-apa-grey">{t('audienceLabel')}: </span>
              {s.audiences.map((a) => (
                <span key={a} className="mr-1.5 inline-block rounded-full bg-apa-soft px-2.5 py-0.5 text-xs font-semibold text-apa-green">
                  {fr ? AUDIENCE_LABEL[a].fr : AUDIENCE_LABEL[a].en}
                </span>
              ))}
            </div>

            <p className="mt-4 text-sm font-semibold italic text-apa-navy">
              <span className="text-[11px] font-bold uppercase not-italic text-apa-grey">{t('challenge')}: </span>
              {fr ? s.challengeFr : s.challengeEn}
            </p>

            <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
              <div><dt className="text-[11px] font-bold uppercase text-apa-grey">{t('purpose')}</dt><dd className="mt-0.5">{fr ? s.purposeFr : s.purposeEn}</dd></div>
              <div><dt className="text-[11px] font-bold uppercase text-apa-grey">{t('context')}</dt><dd className="mt-0.5">{fr ? s.contextFr : s.contextEn}</dd></div>
              <div><dt className="text-[11px] font-bold uppercase text-apa-grey">{t('outcomes')}</dt><dd className="mt-0.5">{fr ? s.outcomesFr : s.outcomesEn}</dd></div>
              <div><dt className="text-[11px] font-bold uppercase text-apa-grey">{t('value')}</dt><dd className="mt-0.5">{fr ? s.valueFr : s.valueEn}</dd></div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-apa-mist pt-4 text-xs">
              <span className="font-bold text-apa-grey">{t('frameworks')}:</span>
              {s.pillars.map((code) => (
                <span key={code} className="rounded bg-apa-soft px-2 py-0.5 font-semibold text-apa-navy">
                  {code} · {pillarName(code)}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <Link href={`/journeys#${s.journeySlug}`} className="rounded-full bg-white px-3 py-1 font-semibold text-apa-green ring-1 ring-apa-line hover:ring-apa-green">
                {t('journey')}: {fr ? JOURNEY_LABEL[s.journeySlug].fr : JOURNEY_LABEL[s.journeySlug].en}
              </Link>
              <span className="rounded-full bg-white px-3 py-1 font-semibold text-apa-navy ring-1 ring-apa-line">
                {t('certification')}: {fr ? s.certificationFr : s.certificationEn}
              </span>
            </div>

            <div className="mt-5">
              <Link
                href={`/tools#${s.id}`}
                className="inline-block rounded-md bg-apa-green px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-apa-green-mid"
              >
                {t('explore')} ({t('toolsLink', { count: toolCountBySolution(s.id) })})
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* AI advisor teaser */}
      <div className="apa-box apa-box-gold mt-10 flex flex-wrap items-center justify-between gap-4 p-5">
        <p className="text-sm text-apa-ink">
          <span className="font-bold text-apa-green">{t('advisorLabel')}</span>{' '}
          <span className="italic">{t('advisorQuote')}</span>
        </p>
        <Link href="/tools" className="rounded-md bg-apa-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-apa-green-mid">
          {t('advisorAction')} →
        </Link>
      </div>
    </div>
  );
}
