'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SECTIONS, scoreRun, recommend, MATURITY_LEVELS, CSPA_PASS } from '@/domain/cspa/engine';
import { CSPA_QUESTION_BANK, LIKERT, blankAnswers } from '@/domain/cspa/question-bank';
import { computePremiumTelemetry } from '@/domain/certification/premium-telemetry';
import { AnimatedNumber, Gauge, RadarChart, StatTile } from './widgets';

export function CspaWizard({ fr }: { fr: boolean }) {
  const [answers, setAnswers] = useState<Record<string, number>>(blankAnswers);
  const [sectionIdx, setSectionIdx] = useState(0);

  const result = useMemo(() => scoreRun(CSPA_QUESTION_BANK, answers), [answers]);
  const telemetry = useMemo(() => computePremiumTelemetry(result.composite), [result.composite]);
  const recs = useMemo(() => recommend(result), [result]);

  const section = SECTIONS[sectionIdx];
  const questions = CSPA_QUESTION_BANK.filter((q) => q.section === section.code);
  const answeredCount = CSPA_QUESTION_BANK.filter((q) => answers[q.id] > 0).length;
  const level = MATURITY_LEVELS.find((m) => m.level === result.maturity)!;

  const setAnswer = (id: string, v: number) => setAnswers((a) => ({ ...a, [id]: v }));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      {/* ── Wizard column ── */}
      <div className="t-glass rounded-2xl p-6">
        {/* Section tabs */}
        <div className="flex flex-wrap gap-1.5">
          {SECTIONS.map((s, i) => {
            const done = CSPA_QUESTION_BANK.filter((q) => q.section === s.code).every((q) => answers[q.id] > 0);
            return (
              <button
                key={s.code}
                type="button"
                onClick={() => setSectionIdx(i)}
                className={`t-mono rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                  i === sectionIdx ? 't-amber' : 't-muted hover:text-[var(--t-text)]'
                }`}
                style={i === sectionIdx ? { background: 'var(--t-amber-soft)' } : undefined}
              >
                {s.code}{done ? ' ✓' : ''}
              </button>
            );
          })}
        </div>

        <div className="mt-3 t-progress" aria-hidden>
          <span style={{ width: `${(answeredCount / CSPA_QUESTION_BANK.length) * 100}%` }} />
        </div>
        <p className="mt-2 text-xs t-faint t-mono">
          {answeredCount}/{CSPA_QUESTION_BANK.length} {fr ? 'renseignés' : 'answered'} · {fr ? 'poids' : 'weight'} {section.weight}%
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={section.code}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="t-display mt-6 text-lg font-bold">
              <span className="t-amber t-mono mr-2">{section.code}</span>
              {fr ? section.nameFr : section.nameEn}
            </h2>

            <div className="mt-4 space-y-5">
              {questions.map((q) => (
                <div key={q.id}>
                  <p className="text-sm leading-snug">{fr ? q.promptFr : q.promptEn}</p>
                  <div className="mt-2.5 grid grid-cols-4 gap-1.5">
                    {LIKERT.map((lk, val) => {
                      const active = answers[q.id] === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setAnswer(q.id, val)}
                          className={`rounded-lg border px-2 py-2 text-xs font-semibold transition-all ${
                            active
                              ? 'border-transparent t-glow-amber t-amber'
                              : 'border-[var(--t-line)] t-muted hover:border-[var(--t-line-strong)]'
                          }`}
                          style={active ? { background: 'var(--t-amber-soft)' } : undefined}
                        >
                          <span className="t-mono block text-[10px] opacity-70">{val}</span>
                          {fr ? lk.fr : lk.en}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            disabled={sectionIdx === 0}
            onClick={() => setSectionIdx((i) => Math.max(0, i - 1))}
            className="t-btn t-btn-ghost text-xs disabled:opacity-30"
          >
            ← {fr ? 'Précédent' : 'Previous'}
          </button>
          {sectionIdx < SECTIONS.length - 1 ? (
            <button type="button" onClick={() => setSectionIdx((i) => Math.min(SECTIONS.length - 1, i + 1))} className="t-btn text-xs">
              {fr ? 'Section suivante' : 'Next section'} →
            </button>
          ) : (
            <a href="trust-audit" className="t-btn text-xs">{fr ? 'Étape 02 : Trust Audit' : 'Step 02: Trust Audit'} →</a>
          )}
        </div>
      </div>

      {/* ── Live telemetry column ── */}
      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className={`t-glass rounded-2xl p-5 ${result.passed ? 't-glow-emerald' : ''}`}>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">
              {fr ? 'Score composite en direct' : 'Live composite score'}
            </p>
            <span className={`t-chip ${result.passed ? 't-chip-emerald' : 't-chip-amber'}`}>
              <span className="t-live-dot" style={result.passed ? undefined : { background: 'var(--t-amber)', boxShadow: '0 0 10px var(--t-amber)' }} />
              {result.passed ? (fr ? 'Seuil franchi' : 'Gate passed') : `${fr ? 'seuil' : 'gate'} ${CSPA_PASS}`}
            </span>
          </div>
          <div className="grid place-items-center">
            <Gauge value={result.composite} label={fr ? level.labelFr : level.labelEn} tone={result.passed ? 'emerald' : 'amber'} />
          </div>
          <p className="text-center text-xs t-muted">{fr ? level.descFr : level.descEn}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatTile label={fr ? 'Compression bps' : 'BPS compression'} tone={telemetry.gatePassed ? 'emerald' : 'default'}>
            <span className={telemetry.gatePassed ? 't-emerald' : ''}><AnimatedNumber value={telemetry.bpsCompression} suffix=" bps" /></span>
          </StatTile>
          <StatTile label={fr ? 'Uplift valo.' : 'Valuation uplift'} tone="amber">
            <span className="t-amber"><AnimatedNumber value={telemetry.valuationUpliftUsd / 1_000_000} decimals={2} prefix="$" suffix="M" /></span>
          </StatTile>
        </div>

        <div className="t-glass rounded-2xl p-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{fr ? 'Profil par section' : 'Section profile'}</p>
          <div className="mt-2 grid place-items-center">
            <RadarChart axes={SECTIONS.map((s) => s.code)} values={SECTIONS.map((s) => result.sectionScores[s.code] ?? 0)} />
          </div>
        </div>

        {recs.length > 0 && (
          <div className="t-glass rounded-2xl p-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{fr ? 'Remédiation prioritaire' : 'Priority remediation'}</p>
            <ul className="mt-2 space-y-1.5 text-xs t-muted">
              {recs.slice(0, 3).map((r) => (
                <li key={r.section.code}>
                  <span className="t-amber t-mono">{r.section.code}</span> {fr ? r.section.nameFr : r.section.nameEn}{' '}
                  <span className="t-faint">· {fr ? 'outils' : 'tools'} {r.tools.map((n) => `#${n}`).join(', ')}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
