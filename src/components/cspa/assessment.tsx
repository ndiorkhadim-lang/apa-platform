'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from '@/i18n/navigation';
import { saveCspaDraft, submitCspa } from '@/app/[locale]/(app)/app/cspa/actions';
import { scoreRun, CSPA_PASS, MATURITY_LEVELS, SECTIONS as ENGINE_SECTIONS, type CspaResult } from '@/domain/cspa/engine';

interface Q {
  id: string;
  section: string;
  text: string;
  options: string[];
}
interface SectionMeta {
  code: string;
  name: string;
  weight: number;
}

const L = {
  fr: {
    section: 'Section', of: 'sur', progress: 'Progression',
    prev: '← Précédent', next: 'Suivant →', save: 'Enregistrer le brouillon',
    saved: '✓ Brouillon enregistré — reprenez quand vous voulez.',
    submit: 'Terminer & calculer mon score', missing: 'question(s) sans réponse',
    weight: 'poids',
  },
  en: {
    section: 'Section', of: 'of', progress: 'Progress',
    prev: '← Previous', next: 'Next →', save: 'Save draft',
    saved: '✓ Draft saved — resume anytime.',
    submit: 'Finish & compute my score', missing: 'unanswered question(s)',
    weight: 'weight',
  },
} as const;

export function CspaAssessment({
  locale,
  sections,
  questions,
  initialAnswers,
  demo = false,
}: {
  locale: string;
  sections: SectionMeta[];
  questions: Q[];
  initialAnswers: Record<string, number>;
  demo?: boolean;
}) {
  const t = L[locale === 'en' ? 'en' : 'fr'];
  const fr = locale !== 'en';
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>(initialAnswers);
  const [step, setStep] = useState(0);
  const [savedMsg, setSavedMsg] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);
  const [demoResult, setDemoResult] = useState<CspaResult | null>(null);
  const [pending, start] = useTransition();

  const current = sections[step];
  const sectionQs = useMemo(
    () => questions.filter((q) => q.section === current.code),
    [questions, current]
  );
  const answered = Object.keys(answers).length;
  const pct = Math.round((answered / questions.length) * 100);

  function onSave() {
    if (demo) {
      setDemoNotice(fr ? '🎭 Mode Démo — enregistrement désactivé.' : '🎭 Demo Mode — saving disabled.');
      return;
    }
    start(async () => {
      await saveCspaDraft(answers, locale);
      setSavedMsg(true);
    });
  }

  function onSubmit() {
    if (demo) {
      const unanswered = questions.filter((q) => answers[q.id] === undefined).length;
      if (unanswered > 0) {
        setError(`${unanswered} ${t.missing}`);
        return;
      }
      // Compute the score locally — nothing persisted in Demo Mode.
      setDemoResult(scoreRun(questions, answers));
      setDemoNotice(null);
      setError(null);
      return;
    }
    start(async () => {
      const res = await submitCspa(answers, locale);
      if (!res.ok) {
        setError(`${res.unanswered} ${t.missing}`);
        return;
      }
      router.refresh();
    });
  }

  // ── Demo results preview (client-computed, never saved) ──
  if (demo && demoResult) {
    const level = MATURITY_LEVELS.find((m) => m.level === demoResult.maturity)!;
    const R = 64;
    const circ = 2 * Math.PI * R;
    return (
      <div>
        <div className="apa-box apa-box-gold mb-6 p-3 text-sm font-semibold">
          🎭 {fr
            ? 'Aperçu des résultats (Mode Démo) — ce score n’est pas enregistré. Créez un compte pour un audit officiel.'
            : 'Results preview (Demo Mode) — this score is not saved. Create an account for an official audit.'}
        </div>
        <div className="grid gap-6 rounded-apa-lg border border-apa-line bg-white p-6 sm:grid-cols-[auto_1fr]">
          <svg viewBox="0 0 160 160" className="mx-auto h-40 w-40" role="img" aria-label={`Score ${demoResult.composite}/100`}>
            <circle cx="80" cy="80" r={R} fill="none" stroke="#e3eae7" strokeWidth="13" />
            <circle
              cx="80" cy="80" r={R} fill="none"
              stroke={demoResult.passed ? '#0A5C36' : '#C9A24B'}
              strokeWidth="13" strokeLinecap="round"
              strokeDasharray={`${(demoResult.composite / 100) * circ} ${circ}`}
              transform="rotate(-90 80 80)"
            />
            <text x="80" y="76" textAnchor="middle" fontSize="30" fontWeight="800" fill="#0A5C36">{demoResult.composite}</text>
            <text x="80" y="98" textAnchor="middle" fontSize="12" fill="#5b6b66">/100 · gate {CSPA_PASS}</text>
          </svg>
          <div>
            <span className={`inline-block rounded px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${demoResult.passed ? 'bg-apa-green text-white' : 'bg-apa-gold text-apa-ink'}`}>
              {fr ? level.labelFr : level.labelEn}
            </span>
            <p className="mt-3 text-sm leading-relaxed text-apa-ink">{fr ? level.descFr : level.descEn}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setDemoResult(null)}
                className="rounded-md border border-apa-line px-4 py-2 text-sm font-semibold text-apa-grey hover:border-apa-green hover:text-apa-green"
              >
                {fr ? '← Revenir au questionnaire' : '← Back to the questionnaire'}
              </button>
            </div>
          </div>
        </div>
        <h2 className="mt-8 text-lg font-bold text-apa-green">{fr ? 'Maturité par section' : 'Maturity by section'}</h2>
        <div className="mt-4 space-y-2.5">
          {ENGINE_SECTIONS.map((s) => {
            const v = demoResult.sectionScores[s.code] ?? 0;
            return (
              <div key={s.code} className="flex items-center gap-3">
                <span className="w-56 shrink-0 text-xs font-bold text-apa-navy">
                  {s.code} · {fr ? s.nameFr : s.nameEn}
                  <span className="ml-1 font-normal text-apa-grey">({s.weight}%)</span>
                </span>
                <div className="h-4 flex-1 overflow-hidden rounded bg-apa-soft">
                  <div className={`h-full rounded ${v >= 60 ? 'apa-gradient' : 'bg-apa-gold'}`} style={{ width: `${v}%` }} />
                </div>
                <span className="w-10 text-right text-sm font-bold text-apa-green">{v}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-4">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-apa-soft">
          <div className="apa-gradient h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-sm font-bold text-apa-green">{pct}%</span>
      </div>

      {/* Section stepper */}
      <div className="mt-5 flex flex-wrap gap-1.5">
        {sections.map((s, i) => {
          const done = questions.filter((q) => q.section === s.code).every((q) => answers[q.id] !== undefined);
          return (
            <button
              key={s.code}
              type="button"
              onClick={() => setStep(i)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                i === step
                  ? 'apa-gradient text-white'
                  : done
                    ? 'bg-apa-green/15 text-apa-green'
                    : 'bg-apa-soft text-apa-grey'
              }`}
            >
              {s.code} {done ? '✓' : ''}
            </button>
          );
        })}
      </div>

      <h2 className="mt-6 text-lg font-bold text-apa-green">
        {t.section} {step + 1} {t.of} {sections.length} — {current.name}
        <span className="ml-2 rounded bg-apa-soft px-2 py-0.5 text-[10px] font-extrabold text-apa-bronze">
          {t.weight} {current.weight}%
        </span>
      </h2>

      <div className="mt-4 space-y-5">
        {sectionQs.map((q, qi) => (
          <fieldset key={q.id} className="rounded-apa-lg border border-apa-line bg-white p-5">
            <legend className="px-1 text-sm font-bold text-apa-navy">
              {step + 1}.{qi + 1} · {q.text}
            </legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, vi) => (
                <button
                  key={vi}
                  type="button"
                  onClick={() => {
                    setAnswers((a) => ({ ...a, [q.id]: vi }));
                    setSavedMsg(false);
                    setError(null);
                  }}
                  className={`rounded-md border px-3 py-2.5 text-left text-sm transition-colors ${
                    answers[q.id] === vi
                      ? 'border-apa-green bg-apa-green text-white'
                      : 'border-apa-line text-apa-ink hover:border-apa-green'
                  }`}
                >
                  <span className="mr-2 text-[10px] font-extrabold opacity-60">{vi}</span>
                  {opt}
                </button>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      {error ? <p role="alert" className="apa-box apa-box-gold mt-5 p-3 text-sm">{error}</p> : null}
      {savedMsg ? <p className="mt-5 text-sm font-semibold text-apa-green">{t.saved}</p> : null}
      {demoNotice ? <p role="status" className="apa-box apa-box-gold mt-5 p-3 text-sm font-semibold">{demoNotice}</p> : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" disabled={step === 0} onClick={() => setStep((s) => s - 1)}
          className="rounded-md border border-apa-line px-4 py-2 text-sm font-semibold text-apa-grey disabled:opacity-40">
          {t.prev}
        </button>
        {step < sections.length - 1 ? (
          <button type="button" onClick={() => setStep((s) => s + 1)}
            className="rounded-md bg-apa-navy px-5 py-2 text-sm font-semibold text-white hover:opacity-90">
            {t.next}
          </button>
        ) : (
          <button type="button" onClick={onSubmit} disabled={pending}
            className="rounded-md bg-apa-green px-6 py-2.5 text-sm font-bold text-white hover:bg-apa-green-mid disabled:opacity-60">
            {pending ? '…' : t.submit}
          </button>
        )}
        <button type="button" onClick={onSave} disabled={pending}
          className="ml-auto rounded-md border border-apa-green px-4 py-2 text-sm font-semibold text-apa-green hover:bg-apa-green hover:text-white disabled:opacity-60">
          {t.save}
        </button>
      </div>
    </div>
  );
}
