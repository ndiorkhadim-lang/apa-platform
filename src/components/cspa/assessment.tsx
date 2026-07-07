'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from '@/i18n/navigation';
import { saveCspaDraft, submitCspa } from '@/app/[locale]/(app)/app/cspa/actions';

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
}: {
  locale: string;
  sections: SectionMeta[];
  questions: Q[];
  initialAnswers: Record<string, number>;
}) {
  const t = L[locale === 'en' ? 'en' : 'fr'];
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>(initialAnswers);
  const [step, setStep] = useState(0);
  const [savedMsg, setSavedMsg] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const current = sections[step];
  const sectionQs = useMemo(
    () => questions.filter((q) => q.section === current.code),
    [questions, current]
  );
  const answered = Object.keys(answers).length;
  const pct = Math.round((answered / questions.length) * 100);

  function onSave() {
    start(async () => {
      await saveCspaDraft(answers, locale);
      setSavedMsg(true);
    });
  }

  function onSubmit() {
    start(async () => {
      const res = await submitCspa(answers, locale);
      if (!res.ok) {
        setError(`${res.unanswered} ${t.missing}`);
        return;
      }
      router.refresh();
    });
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
