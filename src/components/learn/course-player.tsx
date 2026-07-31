'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { LessonKind, LessonState } from '@/domain/learning/curriculum';
import type { ToolCategory } from '@/generated/prisma/client';
import { buildLessonGuidance } from '@/domain/learning/concierge';
import { SECTIONS } from '@/domain/cspa/engine';
import { markLessonRead, finalizeCredential, type FinalizeResult } from '@/app/[locale]/(app)/learn/[courseId]/actions';

export interface PlayerLesson {
  id: string;
  kind: LessonKind;
  title: string;
  body: string;
  toolNumber?: number;
  toolSlug?: string;
  toolName?: string;
  toolCategory?: ToolCategory;
  state: LessonState;
}
export interface PlayerModule {
  id: string;
  title: string;
  lessons: PlayerLesson[];
}

interface Props {
  locale: string;
  courseSlug: string;
  courseTitle: string;
  modules: PlayerModule[];
  progressPct: number;
  currentLessonId: string | null;
  authed: boolean;
}

const LINE = 'border-[#262626]';
const STATE_GLYPH: Record<LessonState, string> = { COMPLETED: '✓', AVAILABLE: '▸', LOCKED: '🔒' };

export function CoursePlayer({ locale, courseSlug, courseTitle, modules, progressPct, currentLessonId, authed }: Props) {
  const t = useTranslations('LearnPlayer');
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const flat = useMemo(() => modules.flatMap((m) => m.lessons), [modules]);
  const [selectedId, setSelectedId] = useState<string>(currentLessonId ?? flat[0]?.id ?? '');
  const [zen, setZen] = useState(false);
  const [showCurriculum, setShowCurriculum] = useState(true);
  const [showDock, setShowDock] = useState(false);

  const selected = flat.find((l) => l.id === selectedId) ?? flat[0];

  // Executive keyboard shortcuts — ignored while typing in a field.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === 'f') { e.preventDefault(); setZen((z) => !z); }
      else if (k === 'b') { e.preventDefault(); setShowCurriculum((s) => !s); }
      else if (k === 't') { e.preventDefault(); setShowDock((s) => !s); }
      else if (e.key === 'Escape') setZen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const select = useCallback((l: PlayerLesson) => {
    if (l.state === 'LOCKED') return;
    setSelectedId(l.id);
  }, []);

  function completeReading() {
    if (!selected || selected.kind === 'TOOL') return;
    startTransition(async () => {
      await markLessonRead({ lessonId: selected.id, courseSlug, locale });
      router.refresh();
    });
  }

  const toolLessons = useMemo(() => flat.filter((l) => l.kind === 'TOOL'), [flat]);
  const clearedLocks = toolLessons.filter((l) => l.state === 'COMPLETED').length;
  const [finalizing, startFinalize] = useTransition();
  const [finalizeResult, setFinalizeResult] = useState<FinalizeResult | null>(null);

  function finalize() {
    startFinalize(async () => {
      const res = await finalizeCredential(locale);
      setFinalizeResult(res);
      if (res.ok) router.refresh();
    });
  }

  // AI Concierge — deterministic, framework-grounded guidance for the selected
  // lesson (recomputed instantly on navigation; swappable for a live model).
  const guidance = useMemo(() => {
    if (!selected) return null;
    const domainName =
      selected.toolNumber !== undefined
        ? (() => {
            const s = SECTIONS.find((sec) => sec.tools.includes(selected.toolNumber!));
            return s ? (locale === 'en' ? s.nameEn : s.nameFr) : undefined;
          })()
        : undefined;
    return buildLessonGuidance({
      locale,
      lessonTitle: selected.title,
      lessonKind: selected.kind,
      lessonState: selected.state,
      toolCategory: selected.toolCategory,
      toolNumber: selected.toolNumber,
      domainName,
    });
  }, [selected, locale]);

  const sidePanels = !zen;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black text-neutral-100">
      {/* Top bar */}
      <header className={`flex items-center gap-4 border-b ${LINE} px-4 py-3`}>
        <a href={`/${locale}/app`} className="text-xs font-semibold text-neutral-400 hover:text-white">← {t('exit')}</a>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{courseTitle}</p>
          <div className="mt-1 h-1 w-full max-w-md overflow-hidden rounded-full bg-neutral-800">
            <div className="h-full rounded-full bg-apa-gold-bright transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
        <span className="hidden font-mono text-[11px] text-neutral-500 sm:inline">{progressPct}%</span>
        <nav className="hidden items-center gap-1 md:flex" aria-label={t('shortcuts')}>
          {[['B', t('keyCurriculum')], ['T', t('keyDock')], ['F', t('keyZen')]].map(([k, label]) => (
            <kbd key={k} title={label} className={`rounded border ${LINE} px-2 py-1 font-mono text-[10px] text-neutral-400`}>{k}</kbd>
          ))}
        </nav>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Curriculum (B) */}
        {sidePanels && showCurriculum && (
          <aside className={`w-72 shrink-0 overflow-y-auto border-r ${LINE} p-4`}>
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-neutral-500">{t('curriculum')}</h2>
            {modules.map((m, mi) => (
              <div key={m.id} className="mb-5">
                <p className="mb-2 text-xs font-semibold text-neutral-300">{mi + 1}. {m.title}</p>
                <ul className="space-y-1">
                  {m.lessons.map((l) => {
                    const active = l.id === selected?.id;
                    const locked = l.state === 'LOCKED';
                    const color = l.state === 'COMPLETED' ? 'text-emerald-400' : locked ? 'text-neutral-600' : 'text-neutral-200';
                    return (
                      <li key={l.id}>
                        <button
                          onClick={() => select(l)}
                          disabled={locked}
                          className={`flex w-full items-center gap-2 rounded-md border px-2 py-2 text-left text-xs transition-colors ${active ? 'border-apa-gold-bright/50 bg-neutral-900' : `${LINE} hover:bg-neutral-900`} ${locked ? 'cursor-not-allowed opacity-60' : ''}`}
                        >
                          <span className={`w-4 shrink-0 text-center ${color}`}>{STATE_GLYPH[l.state]}</span>
                          <span className={`flex-1 ${color}`}>{l.title}</span>
                          {l.kind === 'TOOL' && <span className="rounded bg-apa-gold-bright/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-apa-gold-bright">{t('tool')}</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </aside>
        )}

        {/* Center content */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className={`mx-auto ${zen ? 'max-w-2xl py-16' : 'max-w-3xl py-10'} px-6`}>
            {selected ? (
              <article>
                <div className="mb-6 flex items-center gap-3">
                  <span className={`rounded-full border ${LINE} px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-neutral-400`}>
                    {t(`kind.${selected.kind}`)}
                  </span>
                  {selected.state === 'COMPLETED' && <span className="text-xs font-semibold text-emerald-400">✓ {t('done')}</span>}
                </div>
                <h1 className="text-2xl font-bold sm:text-3xl">{selected.title}</h1>

                {selected.kind === 'TOOL' ? (
                  <div className={`mt-6 rounded-xl border ${LINE} bg-neutral-950 p-6`}>
                    <p className="text-sm text-neutral-300">{t('toolLock.intro', { tool: selected.toolName ?? `#${selected.toolNumber}` })}</p>
                    <p className="mt-2 text-xs text-neutral-500">{t('toolLock.evidenceNote')}</p>
                    {selected.state === 'COMPLETED' ? (
                      <p className="mt-4 text-sm font-semibold text-emerald-400">✓ {t('toolLock.completed')}</p>
                    ) : (
                      <a
                        href={`/${locale}/app/tools/${selected.toolSlug}`}
                        className="mt-4 inline-block rounded-md bg-apa-gold-bright px-5 py-2.5 text-sm font-bold text-black hover:opacity-90"
                      >
                        {t('toolLock.open')}
                      </a>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="prose-invert mt-6 whitespace-pre-line text-[15px] leading-relaxed text-neutral-300">
                      {selected.body || t('noBody')}
                    </div>
                    {selected.state !== 'COMPLETED' && (
                      <button
                        onClick={completeReading}
                        disabled={pending || !authed}
                        className="mt-8 rounded-md bg-white px-5 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-40"
                      >
                        {pending ? t('saving') : authed ? t('markRead') : t('signInToTrack')}
                      </button>
                    )}
                  </>
                )}
              </article>
            ) : (
              <p className="text-neutral-500">{t('empty')}</p>
            )}
          </div>
        </main>

        {/* Dock (T) — tools & AI concierge */}
        {sidePanels && showDock && (
          <aside className={`w-72 shrink-0 overflow-y-auto border-l ${LINE} p-4`}>
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-neutral-500">{t('dock')}</h2>

            {/* Credential loop — evidence coverage → (re)issue → /verify */}
            <div className={`rounded-lg border ${LINE} bg-neutral-950 p-3`}>
              <p className="text-xs font-semibold text-apa-gold-bright">{t('credential.title')}</p>
              <p className="mt-1 text-[11px] text-neutral-400">{t('credential.coverage', { cleared: clearedLocks, total: toolLessons.length })}</p>
              <a href={`/${locale}/learn/${courseSlug}/capstone`} className="mt-2 block text-[11px] font-semibold text-neutral-300 underline hover:text-white">
                {t('credential.capstone')} →
              </a>
              <button
                onClick={finalize}
                disabled={finalizing}
                className="mt-3 w-full rounded-md bg-apa-gold-bright px-3 py-2 text-xs font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {finalizing ? t('saving') : t('credential.finalize')}
              </button>
              {finalizeResult?.ok && (
                <a href={finalizeResult.verifyUrl} className="mt-2 block text-center text-[11px] font-semibold text-emerald-400 underline">
                  {t('credential.issued', { number: finalizeResult.publicNumber })}
                </a>
              )}
              {finalizeResult && !finalizeResult.ok && (
                <p className="mt-2 text-[11px] text-amber-300">
                  {finalizeResult.reason === 'EVIDENCE_GATE_BLOCKED'
                    ? t('credential.blocked', { count: finalizeResult.pendingTools.length })
                    : t(`credential.err.${finalizeResult.reason}`)}
                </p>
              )}
            </div>

            <div className={`mt-4 rounded-lg border ${LINE} bg-neutral-950 p-3`}>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-apa-gold-bright">
                <span aria-hidden>◆</span> {t('concierge.title')}
              </p>
              {guidance ? (
                <>
                  <p className="mt-2 text-[11px] font-medium text-neutral-200">{guidance.headline}</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-4 text-[11px] leading-relaxed text-neutral-400">
                    {guidance.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                  <p className="mt-2 text-[10px] italic text-neutral-500">{guidance.tip}</p>
                </>
              ) : (
                <p className="mt-1 text-[11px] text-neutral-500">{t('concierge.hint')}</p>
              )}
            </div>
            <h3 className="mb-2 mt-5 text-[11px] font-bold uppercase tracking-widest text-neutral-500">{t('quickTools')}</h3>
            <ul className="space-y-1">
              {flat.filter((l) => l.kind === 'TOOL').map((l) => (
                <li key={l.id}>
                  <a
                    href={`/${locale}/app/tools/${l.toolSlug}`}
                    className={`flex items-center gap-2 rounded-md border ${LINE} px-2 py-2 text-xs text-neutral-300 hover:bg-neutral-900`}
                  >
                    <span className="font-mono text-[10px] text-apa-gold-bright">#{l.toolNumber}</span>
                    <span className="flex-1 truncate">{l.toolName}</span>
                    <span className={l.state === 'COMPLETED' ? 'text-emerald-400' : 'text-neutral-600'}>{l.state === 'COMPLETED' ? '✓' : '○'}</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>

      {zen && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-[#262626] bg-neutral-950/80 px-4 py-1.5 text-[11px] text-neutral-500">
          {t('zenHint')}
        </div>
      )}
    </div>
  );
}
