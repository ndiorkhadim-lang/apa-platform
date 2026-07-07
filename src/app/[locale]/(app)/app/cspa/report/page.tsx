export const dynamic = 'force-dynamic';
import { getFormatter, setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/infrastructure/prisma/client';
import {
  CSPA_PASS,
  CSPA_VERSION,
  MATURITY_LEVELS,
  SECTIONS,
  nextSteps,
  recommend,
  type Maturity,
} from '@/domain/cspa/engine';
import { PrintButton } from '@/components/cspa/print-button';

/** Executive Report — print-optimized (browser print → PDF). */
export default async function CspaReportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';
  const session = await getSession();
  if (!session) redirect({ href: '/sign-in?redirect=/app/cspa/report', locale });

  const run = await prisma.cspaRun.findFirst({
    where: { userId: session!.user.id, version: CSPA_VERSION, status: 'COMPLETED' },
    orderBy: { completedAt: 'desc' },
  });
  if (!run) redirect({ href: '/app/cspa', locale });

  const format = await getFormatter();
  const composite = run!.composite ?? 0;
  const maturity = (run!.maturity ?? 'TRADITIONAL') as Maturity;
  const level = MATURITY_LEVELS.find((m) => m.level === maturity)!;
  const sectionScores = (run!.sectionScores as Record<string, number>) ?? {};
  const recs = recommend({ composite, maturity, passed: composite >= CSPA_PASS, sectionScores });
  const steps = nextSteps(maturity, locale);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 print:max-w-none print:px-0 print:py-0">
      <div className="mb-6 flex justify-end gap-2 print:hidden">
        <PrintButton label={fr ? 'Imprimer / Enregistrer en PDF' : 'Print / Save as PDF'} />
      </div>

      {/* Cover band */}
      <div className="apa-gradient rounded-apa-lg p-8 text-white print:rounded-none">
        <p className="text-xs font-bold uppercase tracking-widest text-apa-gold-bright">
          APA™ — {fr ? 'Rapport Exécutif Confidentiel' : 'Confidential Executive Report'}
        </p>
        <h1 className="mt-2 text-2xl font-bold">
          C-SPA · {fr ? 'Audit du Paradigme Stratégique' : 'Core Strategic Paradigm Audit'}
        </h1>
        <p className="mt-3 text-sm text-apa-mint">
          {session!.user.name} ·{' '}
          {run!.completedAt ? format.dateTime(run!.completedAt, { dateStyle: 'long' }) : ''} ·{' '}
          {CSPA_VERSION}
        </p>
        <div className="mt-6 flex items-end gap-6">
          <span className="text-6xl font-extrabold text-apa-gold-bright">{composite}</span>
          <div className="pb-1">
            <p className="text-sm text-apa-mint">/100 · {fr ? 'seuil' : 'gate'} {CSPA_PASS}</p>
            <p className="text-lg font-bold">{fr ? level.labelFr : level.labelEn}</p>
          </div>
        </div>
      </div>

      <h2 className="mt-8 border-b-2 border-apa-gold pb-1 text-lg font-bold text-apa-green">
        {fr ? 'Synthèse exécutive' : 'Executive summary'}
      </h2>
      <p className="mt-3 text-sm leading-relaxed">{fr ? level.descFr : level.descEn}</p>

      <h2 className="mt-8 border-b-2 border-apa-gold pb-1 text-lg font-bold text-apa-green">
        {fr ? 'Scores par section' : 'Section scores'}
      </h2>
      <table className="mt-3 w-full text-sm">
        <thead>
          <tr className="bg-apa-green text-left text-xs uppercase text-white">
            <th className="px-3 py-1.5">Section</th>
            <th className="px-3 py-1.5 text-center">{fr ? 'Poids' : 'Weight'}</th>
            <th className="px-3 py-1.5 text-center">Score</th>
            <th className="px-3 py-1.5 text-right">{fr ? 'Contribution' : 'Contribution'}</th>
          </tr>
        </thead>
        <tbody>
          {SECTIONS.map((s) => (
            <tr key={s.code} className="border-b border-apa-mist">
              <td className="px-3 py-1.5">{s.code} · {fr ? s.nameFr : s.nameEn}</td>
              <td className="px-3 py-1.5 text-center">{s.weight}%</td>
              <td className="px-3 py-1.5 text-center font-bold text-apa-green">
                {sectionScores[s.code] ?? 0}
              </td>
              <td className="px-3 py-1.5 text-right font-mono">
                {(((sectionScores[s.code] ?? 0) * s.weight) / 100).toFixed(1)}
              </td>
            </tr>
          ))}
          <tr className="font-bold">
            <td className="px-3 py-2" colSpan={3}>C-SPA = Σ wₛ·scoreₛ</td>
            <td className="px-3 py-2 text-right text-apa-green">{composite}</td>
          </tr>
        </tbody>
      </table>

      {recs.length > 0 ? (
        <>
          <h2 className="mt-8 border-b-2 border-apa-gold pb-1 text-lg font-bold text-apa-green">
            {fr ? 'Plan de remédiation recommandé' : 'Recommended remediation plan'}
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {recs.map((r) => (
              <li key={r.section.code}>
                <b>{r.section.code} · {fr ? r.section.nameFr : r.section.nameEn}</b> ({r.score}/100) —{' '}
                {fr ? 'outils' : 'tools'} {r.tools.map((n) => `#${String(n).padStart(2, '0')}`).join(', ')}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <h2 className="mt-8 border-b-2 border-apa-gold pb-1 text-lg font-bold text-apa-green">
        {fr ? 'Prochaines étapes' : 'Next steps'}
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm">
        {steps.map((s) => <li key={s}>{s}</li>)}
      </ol>

      <p className="mt-10 border-t border-apa-line pt-4 text-xs text-apa-grey">
        © 2026 APA™ — Accountable Partners for Africa · {fr
          ? 'Diagnostic pré-certification. Le score officiel de parcours est confirmé lors du Trust Audit.'
          : 'Pre-certification diagnostic. The official journey score is confirmed at the Trust Audit.'}{' '}
        · “Ethics into Alpha. Trust as Currency.”
      </p>
    </div>
  );
}
