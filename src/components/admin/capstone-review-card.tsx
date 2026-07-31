'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { reviewCapstone } from '@/app/[locale]/(app)/app/admin/capstone/actions';

const LINE = 'border-[#262626]';

export interface ReviewCardData {
  id: string;
  title: string;
  author: string;
  org: string;
  aiScore: number | null;
  toolsComplete: boolean;
  similarityPct: number;
  wordCount: number;
  contentExcerpt: string;
}

export function CapstoneReviewCard({ locale, data }: { locale: string; data: ReviewCardData }) {
  const t = useTranslations('CapstoneReview');
  const router = useRouter();
  const [notes, setNotes] = useState('');
  const [pending, start] = useTransition();
  const [done, setDone] = useState<string | null>(null);

  function decide(verdict: 'APPROVED' | 'REJECTED') {
    start(async () => {
      const r = await reviewCapstone({ capstoneId: data.id, verdict, notes: notes || undefined, locale });
      setDone(r.ok ? t(`decided.${verdict}`) : t('error'));
      if (r.ok) router.refresh();
    });
  }

  return (
    <article className={`rounded-xl border ${LINE} bg-neutral-950 p-5`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-neutral-100">{data.title || t('untitled')}</h3>
          <p className="text-xs text-neutral-500">{data.author} · {data.org}</p>
        </div>
        <span className="font-mono text-lg font-bold text-apa-gold-bright">{data.aiScore ?? '—'}/100</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        <span className={data.toolsComplete ? 'text-emerald-300' : 'text-red-300'}>{data.toolsComplete ? '✓' : '✕'} {t('tools')}</span>
        <span className={data.similarityPct < 35 ? 'text-emerald-300' : 'text-red-300'}>{t('similarity', { pct: data.similarityPct })}</span>
        <span className="text-neutral-400">{t('words', { n: data.wordCount })}</span>
      </div>

      <p className="mt-3 max-h-24 overflow-hidden rounded border border-[#1a1a1a] bg-black p-3 text-xs text-neutral-500">{data.contentExcerpt}</p>

      {done ? (
        <p className="mt-4 text-sm font-semibold text-emerald-300">{done}</p>
      ) : (
        <div className="mt-4">
          <textarea
            value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder={t('notesPlaceholder')}
            className={`w-full rounded-md border ${LINE} bg-black px-3 py-2 text-sm text-neutral-100`}
          />
          <div className="mt-2 flex gap-3">
            <button onClick={() => decide('APPROVED')} disabled={pending} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-40">{t('approve')}</button>
            <button onClick={() => decide('REJECTED')} disabled={pending} className="rounded-md border border-red-500/50 px-4 py-2 text-sm font-bold text-red-300 hover:bg-red-950 disabled:opacity-40">{t('reject')}</button>
          </div>
        </div>
      )}
    </article>
  );
}
