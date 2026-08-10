/**
 * /certification — Certification 2.0 gateway (the certification-platform home).
 * Independent from the corporate site: entry point into the certification
 * ecosystem. Dark, premium, enterprise. The unified sovereign Control-Tower
 * chrome is applied by the (app) route-group layout.
 */
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { prisma, dbAvailable } from '@/infrastructure/prisma/client';
import { getSession } from '@/lib/session';
import { PREVIEW_ACCESS } from '@/lib/demo';
import { getUserScore } from '@/infrastructure/scoring/scoring-service';
import { ScorePanel } from '@/components/scoring/score-panel';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Platform' });
  return { title: t('metaTitle') };
}

async function resolveLearnerId(sessionUserId?: string): Promise<string | null> {
  if (sessionUserId) return sessionUserId;
  if (!PREVIEW_ACCESS) return null;
  const demo = await prisma.user.findUnique({ where: { email: 'demo-holder@apa.test' }, select: { id: true } });
  return demo?.id ?? null;
}

const LINE = 'border-[#262626]';

interface Card {
  key: 'diagnostic' | 'learning' | 'capstone' | 'credentials' | 'analytics' | 'admin';
  href: string;
  glyph: string;
}
const CARDS: Card[] = [
  { key: 'diagnostic', href: '/app/cspa', glyph: '◎' },
  { key: 'learning', href: '/learn/cits-executive-pathway', glyph: '▶' },
  { key: 'capstone', href: '/learn/cits-executive-pathway/capstone', glyph: '✦' },
  { key: 'credentials', href: '/verify/APA-2026-SN-000001', glyph: '✓' },
  { key: 'analytics', href: '/enterprise/skills-matrix', glyph: '▦' },
  { key: 'admin', href: '/app/admin/capstone', glyph: '⚙' },
];

export default async function PlatformOverviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Platform');
  const nav = await getTranslations('CertNav');

  const session = await getSession();
  const learnerId = dbAvailable ? await resolveLearnerId(session?.user?.id) : null;
  const score = learnerId ? await getUserScore(learnerId) : null;

  return (
    <main className="min-h-screen bg-black text-neutral-100">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pb-4 pt-16 sm:pt-24">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-apa-gold-bright">{t('kicker')}</p>
        <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">{t('title')}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-400 sm:text-lg">{t('subtitle')}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={`/${locale}/app/cspa`} className="rounded-md bg-apa-gold-bright px-5 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90">
            {t('ctaPrimary')}
          </a>
          <a href={`/${locale}/verify/APA-2026-SN-000001`} className={`rounded-md border ${LINE} px-5 py-2.5 text-sm font-semibold text-neutral-200 transition-colors hover:bg-neutral-900`}>
            {t('ctaSecondary')}
          </a>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {['W3C VC 2.0', 'Open Badges 3.0', 'ISO 37000', 'Ed25519', 'StatusList2021'].map((chip) => (
            <span key={chip} className={`rounded-full border ${LINE} px-3 py-1 text-[11px] font-semibold text-neutral-400`}>{chip}</span>
          ))}
        </div>
      </section>

      {/* Executive standing */}
      {score && (
        <div className="mx-auto max-w-5xl px-4 pt-8">
          <ScorePanel score={score} locale={locale} />
        </div>
      )}

      {/* Ecosystem */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-500">{t('ecosystem')}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c) => (
            <a
              key={c.key}
              href={`/${locale}${c.href}`}
              className={`group rounded-xl border ${LINE} bg-neutral-950 p-5 transition-colors hover:border-apa-gold-bright/40 hover:bg-neutral-900`}
            >
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-apa-gold-bright/30 text-apa-gold-bright">{c.glyph}</span>
                <span className="text-neutral-600 transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
              </div>
              <h3 className="mt-4 font-semibold text-neutral-100">{nav(c.key)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">{t(`cards.${c.key}`)}</p>
            </a>
          ))}
        </div>
      </section>

      <footer className={`border-t ${LINE} py-8`}>
        <p className="mx-auto max-w-5xl px-4 text-xs text-neutral-600">{t('footer')}</p>
      </footer>
    </main>
  );
}
