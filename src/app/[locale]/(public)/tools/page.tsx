import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader } from '@/components/site/section-header';
import { prisma } from '@/infrastructure/prisma/client';
import type { Prisma, ToolCategory } from '@/generated/prisma/client';

const CATEGORY_STYLE: Record<ToolCategory, string> = {
  FORM: 'bg-apa-green text-white',
  GUIDE: 'bg-apa-navy text-white',
  LEGAL: 'bg-apa-gold text-apa-ink',
  METRIC: 'bg-apa-teal text-white',
};

const CATEGORIES = ['FORM', 'GUIDE', 'LEGAL', 'METRIC'] as const;

export default async function ToolsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations('Tools');
  const isFr = locale === 'fr';

  const pillarFilter = typeof sp.pillar === 'string' && sp.pillar ? sp.pillar : undefined;
  const catFilter =
    typeof sp.cat === 'string' && (CATEGORIES as readonly string[]).includes(sp.cat)
      ? (sp.cat as ToolCategory)
      : undefined;
  const q = typeof sp.q === 'string' ? sp.q.trim() : '';

  const where: Prisma.ToolWhereInput = {
    ...(pillarFilter ? { pillar: { code: pillarFilter } } : {}),
    ...(catFilter ? { category: catFilter } : {}),
    ...(q
      ? {
          OR: isFr
            ? [
                { nameFr: { contains: q, mode: 'insensitive' } },
                { descFr: { contains: q, mode: 'insensitive' } },
              ]
            : [
                { nameEn: { contains: q, mode: 'insensitive' } },
                { descEn: { contains: q, mode: 'insensitive' } },
              ],
        }
      : {}),
  };

  const [pillars, tools] = await Promise.all([
    prisma.pillar.findMany({ orderBy: { order: 'asc' } }),
    prisma.tool.findMany({
      where,
      orderBy: { number: 'asc' },
      include: { pillar: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeader num={t('secnum')} title={t('title')} subtitle={t('intro')} />

      {/* Pillar summary chips */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((p) => (
          <a
            key={p.code}
            href={`?pillar=${p.code}`}
            className={`apa-box block p-3 transition-shadow hover:shadow-md ${
              pillarFilter === p.code ? 'ring-2 ring-apa-gold' : ''
            }`}
          >
            <span className="font-bold text-apa-navy">
              {p.code} · {isFr ? p.nameFr : p.nameEn}
            </span>
          </a>
        ))}
      </div>

      {/* Filters — plain GET form, zero client JS */}
      <form
        method="GET"
        className="mt-8 flex flex-wrap items-end gap-3 rounded-apa border border-apa-line bg-apa-soft p-4"
      >
        <label className="flex flex-col gap-1 text-xs font-semibold text-apa-grey">
          {t('filterPillar')}
          <select
            name="pillar"
            defaultValue={pillarFilter ?? ''}
            className="rounded-md border border-apa-line bg-white px-3 py-2 text-sm text-apa-ink"
          >
            <option value="">{t('all')}</option>
            {pillars.map((p) => (
              <option key={p.code} value={p.code}>
                {p.code} — {isFr ? p.nameFr : p.nameEn}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-apa-grey">
          {t('filterCategory')}
          <select
            name="cat"
            defaultValue={catFilter ?? ''}
            className="rounded-md border border-apa-line bg-white px-3 py-2 text-sm text-apa-ink"
          >
            <option value="">{t('all')}</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(`categories.${c}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-48 flex-1 flex-col gap-1 text-xs font-semibold text-apa-grey">
          {t('search')}
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder={t('searchPlaceholder')}
            className="rounded-md border border-apa-line bg-white px-3 py-2 text-sm text-apa-ink"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-apa-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-apa-green-mid"
        >
          {t('search')}
        </button>
        <a
          href="?"
          className="px-2 py-2 text-sm font-medium text-apa-grey hover:text-apa-green"
        >
          {t('reset')}
        </a>
      </form>

      <p className="mt-4 text-sm font-semibold text-apa-grey">
        {t('shown', { count: tools.length })}
      </p>

      {/* Tool cards */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {tools.map((tool) => (
          <article
            key={tool.number}
            className="rounded-apa border border-apa-line bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wide text-apa-grey">
                {t('toolNumber', { number: String(tool.number).padStart(2, '0') })} ·{' '}
                {tool.pillar.code}
              </span>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${CATEGORY_STYLE[tool.category]}`}
              >
                {t(`categories.${tool.category}`)}
              </span>
            </div>
            <h2 className="mt-2 font-bold text-apa-navy">
              {isFr ? tool.nameFr : tool.nameEn}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-apa-ink">
              {isFr ? tool.descFr : tool.descEn}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
