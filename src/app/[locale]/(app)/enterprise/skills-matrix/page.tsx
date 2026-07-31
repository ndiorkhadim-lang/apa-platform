/**
 * /enterprise/skills-matrix — ISO 37000 competency heatmap (Jalon 2.4).
 * Members × C-SPA domains, thermal cells. RSC, black executive canvas.
 */

import { setRequestLocale, getTranslations } from 'next-intl/server';
import { dbAvailable } from '@/infrastructure/prisma/client';
import { getSession } from '@/lib/session';
import { requireOrgAdmin } from '@/lib/guards';
import { loadCohort, resolveOrgSlug } from '@/infrastructure/enterprise/cohort';
import { computeSkillsMatrix } from '@/domain/enterprise/skills-matrix';
import { SkillsHeatmap } from '@/components/enterprise/skills-heatmap';

export const dynamic = 'force-dynamic';
const LINE = 'border-[#262626]';

const LEGEND: { band: string; label: string; cls: string }[] = [
  { band: 'NONE', label: '0', cls: 'bg-neutral-900 text-neutral-600' },
  { band: 'LOW', label: '1–33', cls: 'bg-red-950 text-red-300' },
  { band: 'MEDIUM', label: '34–66', cls: 'bg-amber-950 text-amber-300' },
  { band: 'HIGH', label: '67–99', cls: 'bg-lime-950 text-lime-300' },
  { band: 'FULL', label: '100', cls: 'bg-emerald-900 text-emerald-100' },
];

export default async function SkillsMatrixPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Enterprise');
  const sp = await searchParams;
  const orgQuery = typeof sp.org === 'string' ? sp.org : undefined;

  const session = await getSession();
  const slug = dbAvailable ? await resolveOrgSlug(orgQuery, session?.user?.id ?? null) : null;
  await requireOrgAdmin(locale, `/${locale}/enterprise/skills-matrix`, slug ?? undefined);
  const cohort = slug ? await loadCohort(slug) : null;

  if (!cohort) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black p-8">
        <div className={`rounded-2xl border ${LINE} bg-neutral-950 p-8 text-center`}>
          <h1 className="text-lg font-bold text-white">{t('noOrg.title')}</h1>
          <p className="mt-2 max-w-md text-sm text-neutral-400">{t('noOrg.detail')}</p>
        </div>
      </main>
    );
  }

  const matrix = computeSkillsMatrix(cohort.members);

  return (
    <main className="min-h-screen bg-black text-neutral-100">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-apa-gold-bright">{t('matrix.kicker')}</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{cohort.org.name}</h1>
            <p className="mt-1 text-sm text-neutral-400">{t('matrix.subtitle')}</p>
          </div>
          <a href={`/${locale}/enterprise?org=${cohort.org.slug}`} className="rounded-md border border-[#262626] px-4 py-2 text-sm font-semibold text-neutral-200 hover:bg-neutral-900">
            ← {t('matrix.backDashboard')}
          </a>
        </header>

        {/* Domain legend (code → name) */}
        <div className={`mt-6 grid gap-2 rounded-xl border ${LINE} bg-neutral-950 p-4 text-xs sm:grid-cols-2 lg:grid-cols-3`}>
          {matrix.domains.map((d) => (
            <div key={d.code} className="flex gap-2">
              <span className="font-mono font-bold text-apa-gold-bright">{d.code}</span>
              <span className="text-neutral-400">{locale === 'en' ? d.nameEn : d.nameFr}</span>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <SkillsHeatmap matrix={matrix} locale={locale} />
        </div>

        {/* Coverage legend */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-neutral-500">
          <span>{t('matrix.legend')}:</span>
          {LEGEND.map((l) => (
            <span key={l.band} className={`rounded px-2 py-1 font-mono font-semibold ${l.cls}`}>{l.label}</span>
          ))}
        </div>
      </div>
    </main>
  );
}
