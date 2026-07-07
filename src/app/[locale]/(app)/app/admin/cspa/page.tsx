export const dynamic = 'force-dynamic';
import { getFormatter, setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/infrastructure/prisma/client';
import { CSPA_PASS, SECTIONS } from '@/domain/cspa/engine';

/** Administrator interface — completed C-SPA runs, funnel stats. */
export default async function AdminCspaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';
  const session = await getSession();
  const role = (session?.user as { platformRole?: string } | undefined)?.platformRole;
  if (!session) redirect({ href: '/sign-in?redirect=/app/admin/cspa', locale });
  if (role !== 'ADMIN_APA') redirect({ href: '/app', locale });

  const format = await getFormatter();
  const [runs, drafts] = await Promise.all([
    prisma.cspaRun.findMany({
      where: { status: 'COMPLETED' },
      orderBy: { completedAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
      take: 200,
    }),
    prisma.cspaRun.count({ where: { status: 'DRAFT' } }),
  ]);
  const passed = runs.filter((r) => (r.composite ?? 0) >= CSPA_PASS).length;
  const avg = runs.length
    ? (runs.reduce((a, r) => a + (r.composite ?? 0), 0) / runs.length).toFixed(1)
    : '—';

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-apa-green">
        {fr ? 'Admin — Diagnostics C-SPA' : 'Admin — C-SPA Diagnostics'}
      </h1>
      <div className="apa-rule my-4" />
      <p className="text-sm font-semibold text-apa-navy">
        {runs.length} {fr ? 'complétés' : 'completed'} · {passed} ≥ {CSPA_PASS} ·{' '}
        {fr ? 'score moyen' : 'average score'} {avg} · {drafts} {fr ? 'brouillons' : 'drafts'}
      </p>

      <div className="mt-6 overflow-x-auto rounded-apa-lg border border-apa-line">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-apa-green text-left text-xs uppercase text-white">
              <th className="px-3 py-2">{fr ? 'Utilisateur' : 'User'}</th>
              <th className="px-3 py-2 text-center">Score</th>
              <th className="px-3 py-2">{fr ? 'Maturité' : 'Maturity'}</th>
              {SECTIONS.map((s) => (
                <th key={s.code} className="px-2 py-2 text-center text-[10px]">{s.code}</th>
              ))}
              <th className="px-3 py-2">{fr ? 'Date' : 'Date'}</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r) => {
              const ss = (r.sectionScores as Record<string, number>) ?? {};
              const pass = (r.composite ?? 0) >= CSPA_PASS;
              return (
                <tr key={r.id} className="border-t border-apa-mist even:bg-apa-soft">
                  <td className="px-3 py-1.5">
                    <span className="font-semibold text-apa-navy">{r.user.name}</span>
                    <span className="block text-xs text-apa-grey">{r.user.email}</span>
                  </td>
                  <td className={`px-3 py-1.5 text-center font-extrabold ${pass ? 'text-apa-green' : 'text-apa-bronze'}`}>
                    {r.composite}
                  </td>
                  <td className="px-3 py-1.5 text-xs font-semibold">{r.maturity}</td>
                  {SECTIONS.map((s) => (
                    <td key={s.code} className="px-2 py-1.5 text-center text-xs">{ss[s.code] ?? '—'}</td>
                  ))}
                  <td className="px-3 py-1.5 text-xs text-apa-grey">
                    {r.completedAt ? format.dateTime(r.completedAt, { dateStyle: 'medium' }) : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-apa-grey">
        {fr
          ? 'Banque de questions : table cspa_questions (versionnée) — régénérable depuis le Master Document via scripts/seed-cspa.mjs.'
          : 'Question bank: cspa_questions table (versioned) — regenerable from the Master Document via scripts/seed-cspa.mjs.'}
      </p>
    </div>
  );
}
