'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import type { FormField } from '@/domain/tools/workspace-blueprint';
import { saveSessionData, generateReport } from '@/app/[locale]/(app)/app/tools/[slug]/actions';

type Category = 'FORM' | 'GUIDE' | 'LEGAL' | 'METRIC';

interface Props {
  sessionId: string;
  slug: string;
  locale: string;
  toolName: string;
  category: Category;
  fields: FormField[];
  initialData: Record<string, unknown>;
  outputKind: 'score' | 'document' | 'clause' | 'metric';
}

export function ToolWorkspace({
  sessionId,
  slug,
  locale,
  toolName,
  category,
  fields,
  initialData,
  outputKind,
}: Props) {
  const t = useTranslations('Workspace');
  const isFr = locale === 'fr';
  const [data, setData] = useState<Record<string, unknown>>(initialData);
  const [saved, setSaved] = useState(false);
  const [reportDone, setReportDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function update(name: string, value: unknown) {
    setData((d) => ({ ...d, [name]: value }));
    setSaved(false);
    setReportDone(false);
  }

  function onSave() {
    startTransition(async () => {
      await saveSessionData({ sessionId, slug, locale, data });
      setSaved(true);
    });
  }

  function onGenerate() {
    startTransition(async () => {
      await generateReport({
        sessionId,
        slug,
        locale,
        title: `${toolName} — ${new Date().toLocaleDateString(locale)}`,
        category,
        data,
      });
      setReportDone(true);
    });
  }

  // Live FORM score preview
  const score =
    category === 'FORM'
      ? (() => {
          const w: Record<string, number> = { '0': 1, '1': 0.5, '2': 0 };
          const keys = fields.filter((f) => f.name.startsWith('q')).map((f) => f.name);
          const answered = keys.filter((k) => data[k] !== undefined);
          if (answered.length === 0) return null;
          const total = keys.reduce((s, k) => s + (w[String(data[k])] ?? 0), 0);
          return Math.round((total / keys.length) * 100);
        })()
      : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      {/* ── Input form ── */}
      <section>
        <h2 className="text-lg font-bold text-apa-green">{t('inputTitle')}</h2>
        <div className="mt-4 space-y-4">
          {fields.map((f) => {
            const label = isFr ? f.labelFr : f.labelEn;
            const val = data[f.name];
            if (f.type === 'choice') {
              const choices = (isFr ? f.choicesFr : f.choicesEn) ?? [];
              return (
                <fieldset key={f.name} className="rounded-apa border border-apa-line p-4">
                  <legend className="px-1 text-sm font-semibold text-apa-ink">{label}</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {choices.map((c, i) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => update(f.name, String(i))}
                        className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                          String(val) === String(i)
                            ? 'border-apa-green bg-apa-green text-white'
                            : 'border-apa-line text-apa-ink hover:border-apa-green'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </fieldset>
              );
            }
            return (
              <label key={f.name} className="block text-sm font-semibold text-apa-ink">
                {label}
                {f.type === 'textarea' ? (
                  <textarea
                    rows={4}
                    value={String(val ?? '')}
                    onChange={(e) => update(f.name, e.target.value)}
                    className="mt-1 w-full rounded-md border border-apa-line px-3 py-2.5 text-sm focus:border-apa-green focus:outline-none focus:ring-2 focus:ring-apa-green/20"
                  />
                ) : (
                  <input
                    type="text"
                    value={String(val ?? '')}
                    onChange={(e) => update(f.name, e.target.value)}
                    className="mt-1 w-full rounded-md border border-apa-line px-3 py-2.5 text-sm focus:border-apa-green focus:outline-none focus:ring-2 focus:ring-apa-green/20"
                  />
                )}
              </label>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onSave}
            disabled={pending}
            className="rounded-md border border-apa-green px-4 py-2 text-sm font-semibold text-apa-green transition-colors hover:bg-apa-green hover:text-white disabled:opacity-60"
          >
            {t('save')}
          </button>
          <button
            type="button"
            onClick={onGenerate}
            disabled={pending}
            className="rounded-md bg-apa-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-apa-green-mid disabled:opacity-60"
          >
            {t('generate')}
          </button>
          {saved ? <span className="text-sm text-apa-green">✓ {t('saved')}</span> : null}
          {reportDone ? (
            <span className="text-sm text-apa-green">✓ {t('reportSaved')}</span>
          ) : null}
        </div>
      </section>

      {/* ── Results panel ── */}
      <aside>
        <h2 className="text-lg font-bold text-apa-green">{t('resultsTitle')}</h2>
        <div className="apa-box mt-4 p-5">
          {outputKind === 'score' ? (
            score === null ? (
              <p className="text-sm text-apa-grey">{t('scorePending')}</p>
            ) : (
              <div>
                <div className="text-4xl font-extrabold text-apa-green">{score}/100</div>
                <p
                  className={`mt-2 text-sm font-semibold ${
                    score >= 70 ? 'text-apa-green' : 'text-apa-bronze'
                  }`}
                >
                  {score >= 70 ? t('scorePass') : t('scoreFail')}
                </p>
              </div>
            )
          ) : (
            <p className="text-sm text-apa-grey">{t(`output.${outputKind}`)}</p>
          )}
        </div>

        {reportDone ? (
          <a
            href={`/api/v1/tools/${slug}/export?session=${sessionId}`}
            className="mt-4 inline-block rounded-md border border-apa-green px-4 py-2 text-sm font-semibold text-apa-green transition-colors hover:bg-apa-green hover:text-white"
          >
            ⬇ {t('export')}
          </a>
        ) : null}
      </aside>
    </div>
  );
}
