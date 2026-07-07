export const dynamic = 'force-dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader } from '@/components/site/section-header';
import { dbAvailable } from '@/infrastructure/prisma/client';
import { DBNotReady } from '@/components/site/db-not-ready';
import { AiConcierge } from '@/components/solutions/ai-concierge';
import { LaunchToolButton } from '@/components/tools/launch-tool-button';
import { Link } from '@/i18n/navigation';
import { prisma } from '@/infrastructure/prisma/client';
import type { ToolCategory } from '@/generated/prisma/client';
import {
  SOLUTIONS,
  CATEGORY_META,
  CONCIERGE_RULES,
  AI_RECOMMENDED,
  solutionOf,
  launchPath,
} from '@/domain/solutions/ecosystem';

const CATEGORY_STYLE: Record<ToolCategory, string> = {
  FORM: 'bg-apa-green text-white',
  GUIDE: 'bg-apa-navy text-white',
  LEGAL: 'bg-apa-gold text-apa-ink',
  METRIC: 'bg-apa-teal text-white',
};

export default async function ToolsGatewayPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!dbAvailable) return <DBNotReady locale={locale} />;
  const fr = locale !== 'en';
  const t = await getTranslations('ToolsGateway');

  const [tools, pillars] = await Promise.all([
    prisma.tool.findMany({ orderBy: { number: 'asc' }, include: { pillar: true } }),
    prisma.pillar.findMany({ orderBy: { order: 'asc' } }),
  ]);
  const toolByNumber = new Map(tools.map((t) => [t.number, t]));
  const pillarName = (code: string) => {
    const p = pillars.find((x) => x.code === code);
    return p ? (fr ? p.nameFr : p.nameEn) : code;
  };

  const journeyLabel: Record<string, string> = {
    'investors-dfis': fr ? 'Investisseurs & DFI' : 'Investors & DFIs',
    'multinationals-esg': fr ? 'Multinationales & ESG' : 'Multinationals & ESG',
    'government-agencies': fr ? 'Gouvernements & Agences' : 'Government & Agencies',
    'foundations-grantmakers': fr ? 'Fondations & Bailleurs' : 'Foundations & Grantmakers',
    'celebrities-ambassadors': fr ? 'Célébrités & Ambassadeurs' : 'Celebrities & Ambassadors',
    diaspora: 'Diaspora',
  };

  const conciergeTools = Object.fromEntries(
    CONCIERGE_RULES.map((r) => {
      const tool = toolByNumber.get(r.toolNumber)!;
      return [
        r.toolNumber,
        {
          number: tool.number,
          slug: tool.slug,
          name: fr ? tool.nameFr : tool.nameEn,
          launchPath: `/${locale}${launchPath(tool.number, tool.slug)}`,
        },
      ];
    })
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeader num="04" title={t('title')} subtitle={t('intro')} />

      {/* Navigation philosophy strip */}
      <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-apa-grey">
        {(t.raw('flow') as string[]).map((step, i, arr) => (
          <span key={step} className="flex items-center gap-2">
            <span className={i === 0 ? 'text-apa-green' : ''}>{step}</span>
            {i < arr.length - 1 ? <span className="text-apa-gold">→</span> : null}
          </span>
        ))}
      </div>

      {/* ── AI CONCIERGE ── */}
      <div className="mt-8">
        <AiConcierge
          locale={locale}
          rules={CONCIERGE_RULES.map((r) => ({
            id: r.id,
            label: fr ? r.labelFr : r.labelEn,
            solutionId: r.solutionId,
            toolNumber: r.toolNumber,
          }))}
          solutions={SOLUTIONS.map((s) => ({
            id: s.id,
            code: s.code,
            name: fr ? s.nameFr : s.nameEn,
            pillars: s.pillars,
            journeySlug: s.journeySlug,
            certification: fr ? s.certificationFr : s.certificationEn,
          }))}
          tools={conciergeTools}
          journeyLabels={journeyLabel}
        />
      </div>

      {/* Solution jump-nav */}
      <nav className="mt-8 flex flex-wrap gap-2" aria-label={t('solutionsNav')}>
        {SOLUTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-full border border-apa-line bg-white px-3 py-1.5 text-xs font-semibold text-apa-navy transition-colors hover:border-apa-green hover:text-apa-green"
          >
            {s.code} · {fr ? s.nameFr : s.nameEn}
          </a>
        ))}
      </nav>

      {/* ── SOLUTIONS × TOOLS ── */}
      {SOLUTIONS.map((s) => {
        const solutionTools = tools.filter((tool) => solutionOf(tool.number).id === s.id);
        return (
          <section key={s.id} id={s.id} className="mt-14 scroll-mt-20">
            {/* Solution header */}
            <div className="rounded-apa-lg border border-apa-line bg-apa-soft p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="apa-secnum text-sm">{s.code}</span>
                <h2 className="text-xl font-bold text-apa-green">{fr ? s.nameFr : s.nameEn}</h2>
                <span className="ml-auto text-xs font-semibold text-apa-grey">
                  {t('toolsCount', { count: solutionTools.length })}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold italic text-apa-navy">
                {fr ? s.challengeFr : s.challengeEn}
              </p>
              <div className="mt-4 grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-3">
                <div><dt className="text-[11px] font-bold uppercase text-apa-grey">{t('purpose')}</dt><dd className="mt-0.5">{fr ? s.purposeFr : s.purposeEn}</dd></div>
                <div><dt className="text-[11px] font-bold uppercase text-apa-grey">{t('context')}</dt><dd className="mt-0.5">{fr ? s.contextFr : s.contextEn}</dd></div>
                <div><dt className="text-[11px] font-bold uppercase text-apa-grey">{t('outcomes')}</dt><dd className="mt-0.5">{fr ? s.outcomesFr : s.outcomesEn}</dd></div>
                <div><dt className="text-[11px] font-bold uppercase text-apa-grey">{t('value')}</dt><dd className="mt-0.5">{fr ? s.valueFr : s.valueEn}</dd></div>
                <div><dt className="text-[11px] font-bold uppercase text-apa-grey">{t('frameworks')}</dt><dd className="mt-0.5">{s.pillars.map(pillarName).join(' · ')}</dd></div>
                <div>
                  <dt className="text-[11px] font-bold uppercase text-apa-grey">{t('certification')}</dt>
                  <dd className="mt-0.5">{fr ? s.certificationFr : s.certificationEn}</dd>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/journeys#${s.journeySlug}`} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-apa-green ring-1 ring-apa-line hover:ring-apa-green">
                  {t('journey')}: {journeyLabel[s.journeySlug]}
                </Link>
                <Link href="/certification" className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-apa-navy ring-1 ring-apa-line hover:ring-apa-green">
                  {t('viewPathway')}
                </Link>
              </div>
            </div>

            {/* Tool cards */}
            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {solutionTools.map((tool) => {
                const meta = CATEGORY_META[tool.category];
                const isAi = AI_RECOMMENDED.has(tool.number);
                return (
                  <article key={tool.number} className="flex flex-col rounded-apa border border-apa-line bg-white p-5 transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wide text-apa-grey">
                        #{String(tool.number).padStart(2, '0')} · {tool.pillar.code}
                      </span>
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${CATEGORY_STYLE[tool.category]}`}>
                        {t(`categories.${tool.category}`)}
                      </span>
                    </div>
                    <h3 className="mt-2 font-bold text-apa-navy">
                      {fr ? tool.nameFr : tool.nameEn}
                    </h3>
                    {isAi ? (
                      <span className="mt-1 inline-block self-start rounded-full bg-apa-gold-bright px-2 py-0.5 text-[9px] font-extrabold uppercase text-apa-ink">
                        ★ {t('aiRecommended')}
                      </span>
                    ) : null}
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-apa-ink">
                      {fr ? tool.descFr : tool.descEn}
                    </p>
                    <dl className="mt-3 grid grid-cols-2 gap-1.5 text-[11px] text-apa-grey">
                      <div><dt className="inline font-bold">{t('domain')}: </dt><dd className="inline">{pillarName(tool.pillar.code)}</dd></div>
                      <div><dt className="inline font-bold">{t('complexity')}: </dt><dd className="inline">{fr ? meta.complexityFr : meta.complexityEn}</dd></div>
                      <div><dt className="inline font-bold">{t('duration')}: </dt><dd className="inline">{fr ? meta.timeFr : meta.timeEn}</dd></div>
                      <div><dt className="inline font-bold">{t('cert')}: </dt><dd className="inline">{fr ? meta.certFr : meta.certEn}</dd></div>
                    </dl>
                    <LaunchToolButton
                      launchPath={`/${locale}${launchPath(tool.number, tool.slug)}`}
                      label={t('launch')}
                    />
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
