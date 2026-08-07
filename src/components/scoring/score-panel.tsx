import { getTranslations } from 'next-intl/server';
import type { ScoreResult } from '@/domain/scoring/scoring';

/**
 * Executive standing panel — level, points, progress to the next tier, and the
 * verifiable badges earned. Pure server render on the platform's dark canvas.
 */
const LINE = 'border-[#262626]';

export async function ScorePanel({ score, locale }: { score: ScoreResult; locale: string }) {
  const t = await getTranslations('Scoring');
  const fr = locale !== 'en';
  const levelName = fr ? score.level.nameFr : score.level.nameEn;

  return (
    <section className={`rounded-2xl border ${LINE} bg-neutral-950 p-6 sm:p-8`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">{t('title')}</p>
          <p className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-apa-gold-bright">{score.points}</span>
            <span className="text-sm text-neutral-500">{t('points')}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">{t('level')}</p>
          <p className="mt-1 text-lg font-bold text-neutral-100">{levelName}</p>
        </div>
      </div>

      {/* Progress to next level */}
      <div className="mt-5">
        <div className="h-2 overflow-hidden rounded-full bg-neutral-900">
          <div
            className="h-full rounded-full bg-apa-gold-bright transition-all"
            style={{ width: `${Math.max(4, Math.min(100, score.progressPct))}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          {score.nextLevel
            ? t('toNext', { n: score.pointsToNext ?? 0, level: fr ? score.nextLevel.nameFr : score.nextLevel.nameEn })
            : t('maxLevel')}
        </p>
      </div>

      {/* Badges — each is a signed Open Badges 3.0 credential (download / verify) */}
      <div className="mt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">{t('badges')}</p>
          {score.badges.length > 0 && (
            <span className="font-mono text-[10px] uppercase tracking-wide text-emerald-400">{t('verifiableBadges')}</span>
          )}
        </div>
        {score.badges.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-600">{t('noBadges')}</p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {score.badges.map((b) => (
              <li key={b.id}>
                <a
                  href={`/api/v1/badges/${b.id}?lang=${fr ? 'fr' : 'en'}`}
                  title={`${fr ? b.descFr : b.descEn} — ${t('downloadHint')}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-apa-gold-bright/40 bg-apa-gold-bright/5 px-3 py-1.5 text-xs font-semibold text-apa-gold-bright transition-colors hover:bg-apa-gold-bright/15"
                >
                  <span aria-hidden>✦</span>
                  {fr ? b.nameFr : b.nameEn}
                  <span aria-hidden className="text-emerald-400">↓</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
