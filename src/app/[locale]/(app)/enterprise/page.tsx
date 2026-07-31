/**
 * /enterprise — B2B institutional dashboard (Jalon 2.4).
 * Cohort completion, ISO 37000 competency coverage, and issued-credential status
 * for a ministry / HR directorate. RSC, black executive canvas.
 */

import { setRequestLocale, getTranslations, getFormatter } from 'next-intl/server';
import { dbAvailable } from '@/infrastructure/prisma/client';
import { getSession } from '@/lib/session';
import { requireOrgAdmin } from '@/lib/guards';
import { loadCohort, resolveOrgSlug } from '@/infrastructure/enterprise/cohort';
import { computeSkillsMatrix, coverageBand, type CoverageBand } from '@/domain/enterprise/skills-matrix';
import type { CertificateStatus } from '@/generated/prisma/client';

export const dynamic = 'force-dynamic';

const LINE = 'border-[#262626]';
const BAND_TEXT: Record<CoverageBand, string> = {
  NONE: 'text-neutral-500', LOW: 'text-red-300', MEDIUM: 'text-amber-300', HIGH: 'text-lime-300', FULL: 'text-emerald-300',
};
const CERT_TONE: Record<CertificateStatus, string> = {
  ACTIVE: 'text-emerald-300 border-emerald-500/40', EXPIRED: 'text-amber-300 border-amber-500/40', REVOKED: 'text-red-300 border-red-500/40',
};

function Tile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className={`rounded-xl border ${LINE} bg-neutral-950 p-5`}>
      <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">{label}</p>
      <p className="mt-2 font-mono text-3xl font-bold text-apa-gold-bright">{value}</p>
      {sub && <p className="mt-1 text-xs text-neutral-500">{sub}</p>}
    </div>
  );
}

export default async function EnterprisePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Enterprise');
  const format = await getFormatter();
  const sp = await searchParams;
  const orgQuery = typeof sp.org === 'string' ? sp.org : undefined;

  const session = await getSession();
  const slug = dbAvailable ? await resolveOrgSlug(orgQuery, session?.user?.id ?? null) : null;
  // RBAC: ADMIN_APA or ORG_ADMIN of this org (redirects in production).
  await requireOrgAdmin(locale, `/${locale}/enterprise`, slug ?? undefined);
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
  const activeCerts = cohort.certificates.filter((c) => c.status === 'ACTIVE').length;

  return (
    <main className="min-h-screen bg-black text-neutral-100">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-apa-gold-bright">{t('kicker')}</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{cohort.org.name}</h1>
          </div>
          <a href={`/${locale}/enterprise/skills-matrix?org=${cohort.org.slug}`} className="rounded-md border border-[#262626] px-4 py-2 text-sm font-semibold text-neutral-200 hover:bg-neutral-900">
            {t('viewMatrix')} →
          </a>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <Tile label={t('tiles.members')} value={String(cohort.members.length)} />
          <Tile label={t('tiles.coverage')} value={`${matrix.orgOverallPct}%`} sub={t('tiles.coverageSub')} />
          <Tile label={t('tiles.certs')} value={String(activeCerts)} sub={t('tiles.certsSub', { total: cohort.certificates.length })} />
        </section>

        {/* Cohort */}
        <section className="mt-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400">{t('cohort.title')}</h2>
          <div className={`mt-4 overflow-hidden rounded-xl border ${LINE}`}>
            <table className="w-full text-left text-sm">
              <thead className={`border-b ${LINE} bg-neutral-950`}>
                <tr>
                  <th className="px-4 py-3 font-semibold text-neutral-300">{t('cohort.member')}</th>
                  <th className="px-4 py-3 text-right font-semibold text-neutral-300">{t('cohort.coverage')}</th>
                </tr>
              </thead>
              <tbody>
                {matrix.members.length === 0 && (
                  <tr><td colSpan={2} className="px-4 py-6 text-center text-neutral-500">{t('cohort.empty')}</td></tr>
                )}
                {matrix.members.map((m) => (
                  <tr key={m.id} className={`border-b ${LINE} last:border-0`}>
                    <td className="px-4 py-3 text-neutral-200">{m.name}</td>
                    <td className={`px-4 py-3 text-right font-mono font-semibold ${BAND_TEXT[coverageBand(m.overallPct)]}`}>{m.overallPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Certifications */}
        <section className="mt-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400">{t('certs.title')}</h2>
          <div className={`mt-4 overflow-hidden rounded-xl border ${LINE}`}>
            <table className="w-full text-left text-sm">
              <thead className={`border-b ${LINE} bg-neutral-950`}>
                <tr>
                  <th className="px-4 py-3 font-semibold text-neutral-300">{t('certs.number')}</th>
                  <th className="px-4 py-3 font-semibold text-neutral-300">{t('certs.status')}</th>
                  <th className="px-4 py-3 font-semibold text-neutral-300">{t('certs.issued')}</th>
                </tr>
              </thead>
              <tbody>
                {cohort.certificates.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-6 text-center text-neutral-500">{t('certs.empty')}</td></tr>
                )}
                {cohort.certificates.map((c) => (
                  <tr key={c.publicNumber} className={`border-b ${LINE} last:border-0`}>
                    <td className="px-4 py-3">
                      <a href={`/${locale}/verify/${c.publicNumber}`} className="font-mono text-apa-gold-bright underline">{c.publicNumber}</a>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded border px-2 py-0.5 text-xs font-bold uppercase ${CERT_TONE[c.status]}`}>{t(`certStatus.${c.status}`)}</span>
                    </td>
                    <td className="px-4 py-3 text-neutral-400">{format.dateTime(c.issuedAt, { dateStyle: 'medium' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
