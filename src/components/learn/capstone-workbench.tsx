'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { CapstoneStatus, AuditVerdict } from '@/generated/prisma/client';
import type { IntegrityReport } from '@/domain/capstone/integrity';
import type { Prescore } from '@/domain/capstone/prescoring';
import { saveCapstoneDraft, submitCapstone, type SubmitResult } from '@/app/[locale]/(app)/learn/[courseId]/capstone/actions';

export interface CapstoneView {
  title: string;
  content: string;
  status: CapstoneStatus;
  aiScore: number | null;
  aiBreakdown: Prescore | null;
  integrity: IntegrityReport | null;
  reviewVerdict: AuditVerdict;
  reviewNotes: string | null;
}

const LINE = 'border-[#262626]';

function Check({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-2 ${ok ? 'text-emerald-300' : 'text-red-300'}`}>
      <span aria-hidden>{ok ? '✓' : '✕'}</span> {label}
    </li>
  );
}

export function CapstoneWorkbench({ locale, courseSlug, initial }: { locale: string; courseSlug: string; initial: CapstoneView }) {
  const t = useTranslations('Capstone');
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [content, setContent] = useState(initial.content);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);

  const locked = initial.status === 'SUBMITTED' || initial.status === 'APPROVED';
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const integrity = result?.integrity ?? initial.integrity;

  function save() {
    start(async () => {
      const r = await saveCapstoneDraft({ title, content, locale, courseSlug });
      setMsg(r.ok ? t('saved') : t(`err.${r.reason}`));
    });
  }
  function submit() {
    start(async () => {
      const r = await submitCapstone({ title, content, locale, courseSlug });
      setResult(r);
      setMsg(r.ok ? t('submitted') : r.reason === 'INTEGRITY_FAILED' ? t('integrityFailed') : t(`err.${r.reason}`));
      router.refresh();
    });
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Status banner */}
      <div className={`rounded-lg border ${LINE} bg-neutral-950 p-4`}>
        <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">{t('status')}</span>
        <span className="ml-2 font-semibold text-apa-gold-bright">{t(`statuses.${initial.status}`)}</span>
        {initial.status === 'APPROVED' && <p className="mt-1 text-xs text-emerald-300">{t('approvedNote')}</p>}
        {initial.status === 'REJECTED' && initial.reviewNotes && <p className="mt-1 text-xs text-red-300">{initial.reviewNotes}</p>}
      </div>

      {/* Editor */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wide text-neutral-400">{t('projectTitle')}</label>
        <input
          value={title} onChange={(e) => setTitle(e.target.value)} disabled={locked || pending}
          className={`mt-2 w-full rounded-md border ${LINE} bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 disabled:opacity-50`}
          placeholder={t('titlePlaceholder')}
        />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wide text-neutral-400">{t('document')}</label>
          <span className="text-[11px] text-neutral-500">{t('words', { n: words })}</span>
        </div>
        <textarea
          value={content} onChange={(e) => setContent(e.target.value)} disabled={locked || pending} rows={16}
          className={`mt-2 w-full rounded-md border ${LINE} bg-neutral-950 px-4 py-3 text-sm leading-relaxed text-neutral-100 disabled:opacity-50`}
          placeholder={t('docPlaceholder')}
        />
      </div>

      {!locked && (
        <div className="flex flex-wrap gap-3">
          <button onClick={save} disabled={pending} className={`rounded-md border ${LINE} px-5 py-2.5 text-sm font-semibold text-neutral-200 hover:bg-neutral-900 disabled:opacity-40`}>
            {pending ? t('saving') : t('saveDraft')}
          </button>
          <button onClick={submit} disabled={pending} className="rounded-md bg-apa-gold-bright px-5 py-2.5 text-sm font-bold text-black hover:opacity-90 disabled:opacity-40">
            {t('submit')}
          </button>
        </div>
      )}
      {msg && <p className="text-sm text-neutral-300">{msg}</p>}

      {/* Integrity report */}
      {integrity && (
        <section className={`rounded-lg border ${LINE} bg-neutral-950 p-4`}>
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">{t('integrity.title')}</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            <Check ok={integrity.toolsComplete} label={integrity.toolsComplete ? t('integrity.toolsOk') : t('integrity.toolsMissing', { n: integrity.missingTools.length })} />
            <Check ok={integrity.meetsMinLength} label={t('integrity.length', { n: integrity.wordCount })} />
            <Check ok={!integrity.plagiarismFlag} label={t('integrity.similarity', { pct: Math.round(integrity.similarity * 100) })} />
          </ul>
        </section>
      )}

      {/* AI pre-score */}
      {initial.aiScore !== null && initial.aiBreakdown && (
        <section className={`rounded-lg border ${LINE} bg-neutral-950 p-4`}>
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">{t('prescore.title')}</h2>
            <span className="font-mono text-lg font-bold text-apa-gold-bright">{initial.aiScore}/100</span>
          </div>
          <p className="mt-1 text-[11px] text-neutral-500">{t('prescore.advisory')}</p>
          <ul className="mt-3 grid gap-1.5 text-xs sm:grid-cols-2">
            {initial.aiBreakdown.dimensions.map((d) => (
              <li key={d.code} className="flex items-center justify-between gap-2">
                <span className="text-neutral-400">{locale === 'en' ? d.nameEn : d.nameFr}</span>
                <span className="font-mono text-neutral-200">{d.score}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
