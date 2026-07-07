export const dynamic = 'force-dynamic';
import { setRequestLocale } from 'next-intl/server';
import { Link, redirect } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/infrastructure/prisma/client';
import {
  CSPA_PASS,
  CSPA_VERSION,
  MATURITY_LEVELS,
  SECTIONS,
  nextSteps,
  recommend,
  type CspaResult,
  type Maturity,
} from '@/domain/cspa/engine';
import { CspaAssessment } from '@/components/cspa/assessment';
import { restartCspa } from './actions';

export default async function CspaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';
  const session = await getSession();
  if (!session) redirect({ href: '/sign-in?redirect=/app/cspa', locale });

  const [latest, questions] = await Promise.all([
    prisma.cspaRun.findFirst({
      where: { userId: session!.user.id, version: CSPA_VERSION },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.cspaQuestion.findMany({
      where: { version: CSPA_VERSION },
      orderBy: [{ section: 'asc' }, { order: 'asc' }],
    }),
  ]);

  const showResults = latest?.status === 'COMPLETED';

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <span className="apa-secnum text-sm">C-SPA</span>
      <h1 className="mt-2 text-2xl font-bold text-apa-green sm:text-3xl">
        {fr ? 'Audit du Paradigme Stratégique Fondamental' : 'Core Strategic Paradigm Audit'}
      </h1>
      <div className="apa-rule my-4" />
      <p className="text-sm text-apa-grey">
        {fr
          ? `Diagnostic exécutif propriétaire (outil #3) : situe votre organisation entre le paradigme traditionnel/transactionnel et le paradigme transformationnel de la valeur partagée (CSV). ${questions.length} questions · 6 sections pondérées · seuil de certification ≥ ${CSPA_PASS}.`
          : `Proprietary executive diagnostic (tool #3): locates your organization between the traditional/transactional paradigm and the transformational Creating-Shared-Value (CSV) paradigm. ${questions.length} questions · 6 weighted sections · certification gate ≥ ${CSPA_PASS}.`}
      </p>

      <div className="mt-8">
        {showResults ? (
          <CspaResults locale={locale} run={latest!} />
        ) : (
          <CspaAssessment
            locale={locale}
            sections={SECTIONS.map((s) => ({
              code: s.code,
              name: fr ? s.nameFr : s.nameEn,
              weight: s.weight,
            }))}
            questions={questions.map((q) => ({
              id: q.id,
              section: q.section,
              text: fr ? q.textFr : q.textEn,
              options: (fr ? q.optionsFr : q.optionsEn) as string[],
            }))}
            initialAnswers={(latest?.answers as Record<string, number>) ?? {}}
          />
        )}
      </div>
    </div>
  );
}

// ── Results view ─────────────────────────────────────────
async function CspaResults({
  locale,
  run,
}: {
  locale: string;
  run: {
    composite: number | null;
    maturity: string | null;
    sectionScores: unknown;
    completedAt: Date | null;
  };
}) {
  const fr = locale !== 'en';
  const composite = run.composite ?? 0;
  const maturity = (run.maturity ?? 'TRADITIONAL') as Maturity;
  const result: CspaResult = {
    composite,
    maturity,
    passed: composite >= CSPA_PASS,
    sectionScores: (run.sectionScores as Record<string, number>) ?? {},
  };
  const level = MATURITY_LEVELS.find((m) => m.level === maturity)!;
  const recs = recommend(result);
  const steps = nextSteps(maturity, locale);

  const recTools = recs.length
    ? await prisma.tool.findMany({
        where: { number: { in: recs.flatMap((r) => r.tools) } },
        select: { number: true, slug: true, nameEn: true, nameFr: true },
      })
    : [];
  const toolByNumber = new Map(recTools.map((t) => [t.number, t]));

  // score dial geometry
  const R = 64;
  const circ = 2 * Math.PI * R;

  return (
    <div>
      {/* Executive summary */}
      <div className="grid gap-6 rounded-apa-lg border border-apa-line bg-white p-6 sm:grid-cols-[auto_1fr]">
        <svg viewBox="0 0 160 160" className="mx-auto h-40 w-40" role="img" aria-label={`Score ${composite}/100`}>
          <circle cx="80" cy="80" r={R} fill="none" stroke="#e3eae7" strokeWidth="13" />
          <circle
            cx="80" cy="80" r={R} fill="none"
            stroke={result.passed ? '#0A5C36' : '#C9A24B'}
            strokeWidth="13" strokeLinecap="round"
            strokeDasharray={`${(composite / 100) * circ} ${circ}`}
            transform="rotate(-90 80 80)"
          />
          <text x="80" y="76" textAnchor="middle" fontSize="30" fontWeight="800" fill="#0A5C36">
            {composite}
          </text>
          <text x="80" y="98" textAnchor="middle" fontSize="12" fill="#5b6b66">/100 · gate {CSPA_PASS}</text>
        </svg>
        <div>
          <span
            className={`inline-block rounded px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${
              result.passed ? 'bg-apa-green text-white' : 'bg-apa-gold text-apa-ink'
            }`}
          >
            {fr ? level.labelFr : level.labelEn}
          </span>
          <p className="mt-3 text-sm leading-relaxed text-apa-ink">
            {fr ? level.descFr : level.descEn}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/app/cspa/report"
              className="rounded-md bg-apa-green px-4 py-2 text-sm font-semibold text-white hover:bg-apa-green-mid"
            >
              {fr ? '📄 Rapport exécutif (PDF)' : '📄 Executive report (PDF)'}
            </Link>
            <form action={restartCspa.bind(null, locale)}>
              <button
                type="submit"
                className="rounded-md border border-apa-line px-4 py-2 text-sm font-semibold text-apa-grey hover:border-apa-green hover:text-apa-green"
              >
                {fr ? 'Refaire l’audit' : 'Retake the audit'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Section maturity bars */}
      <h2 className="mt-10 text-lg font-bold text-apa-green">
        {fr ? 'Maturité de gouvernance par section' : 'Governance maturity by section'}
      </h2>
      <div className="mt-4 space-y-2.5">
        {SECTIONS.map((s) => {
          const v = result.sectionScores[s.code] ?? 0;
          return (
            <div key={s.code} className="flex items-center gap-3">
              <span className="w-56 shrink-0 text-xs font-bold text-apa-navy">
                {s.code} · {fr ? s.nameFr : s.nameEn}
                <span className="ml-1 font-normal text-apa-grey">({s.weight}%)</span>
              </span>
              <div className="h-4 flex-1 overflow-hidden rounded bg-apa-soft">
                <div
                  className={`h-full rounded ${v >= 60 ? 'apa-gradient' : 'bg-apa-gold'}`}
                  style={{ width: `${v}%` }}
                />
              </div>
              <span className="w-10 text-right text-sm font-bold text-apa-green">{v}</span>
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      {recs.length > 0 ? (
        <>
          <h2 className="mt-10 text-lg font-bold text-apa-green">
            {fr ? 'Recommandations — outils à déployer' : 'Recommendations — tools to deploy'}
          </h2>
          <div className="mt-4 space-y-3">
            {recs.map((r) => (
              <div key={r.section.code} className="apa-box apa-box-gold p-4">
                <p className="text-sm font-bold text-apa-navy">
                  {r.section.code} · {fr ? r.section.nameFr : r.section.nameEn} — {r.score}/100
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.tools.map((n) => {
                    const tool = toolByNumber.get(n);
                    return tool ? (
                      <Link
                        key={n}
                        href={`/app/tools/${tool.slug}`}
                        className="rounded-full border border-apa-green bg-white px-3 py-1 text-xs font-semibold text-apa-green hover:bg-apa-green hover:text-white"
                      >
                        #{String(n).padStart(2, '0')} {fr ? tool.nameFr : tool.nameEn}
                      </Link>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {/* Next steps */}
      <h2 className="mt-10 text-lg font-bold text-apa-green">
        {fr ? 'Vos prochaines étapes' : 'Your next steps'}
      </h2>
      <ol className="mt-4 space-y-2">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-3 text-sm">
            <span className="apa-secnum text-xs">{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}
