import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { CIRCUIT_STEPS } from '@/components/terminal/steps';
import { OverviewHero } from '@/components/terminal/overview-hero';

export const metadata: Metadata = {
  title: 'APA Terminal · Certify v2',
  robots: { index: false },
};

export default async function TerminalOverview({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';

  const accent: Record<string, string> = {
    amber: 't-amber', emerald: 't-emerald', gold: 't-amber', cyan: 'text-cyan-400', violet: 'text-violet-400',
  };

  return (
    <div className="space-y-10">
      <OverviewHero fr={fr} />

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="t-display text-lg font-bold">{fr ? 'Circuit de vérification · 5 étapes' : 'Verification circuit · 5 steps'}</h2>
          <span className="t-mono text-xs t-faint">01 → 05</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CIRCUIT_STEPS.map((s) => (
            <Link
              key={s.slug}
              href={`/certify-v2/${s.slug}`}
              className="t-glass t-glass-hover group rounded-2xl p-5"
            >
              <div className="flex items-center justify-between">
                <span className={`text-2xl ${accent[s.accent]}`}>{s.glyph}</span>
                <span className="t-mono text-xs t-faint">STEP 0{s.n}</span>
              </div>
              <h3 className="t-display mt-4 text-base font-bold">{fr ? s.titleFr : s.titleEn}</h3>
              <p className="mt-1 text-sm t-muted">{fr ? s.taglineFr : s.taglineEn}</p>
              <p className="mt-4 text-xs font-semibold t-amber opacity-0 transition-opacity group-hover:opacity-100">
                {fr ? 'Ouvrir' : 'Open'} →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="t-glass rounded-2xl p-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { k: fr ? 'Moteur réel' : 'Real engine', v: fr ? 'C-SPA pur, versionné' : 'Pure, versioned C-SPA', d: fr ? 'Le même scoring que la production' : 'Same scoring as production' },
            { k: fr ? 'Preuve' : 'Proof', v: 'Ed25519 · W3C VC 2.0', d: fr ? 'Titres vérifiables hors-ligne' : 'Offline-verifiable credentials' },
            { k: fr ? 'Design' : 'Design', v: fr ? 'Terminal fintech' : 'Fintech terminal', d: fr ? 'Glass · glow · télémétrie live' : 'Glass · glow · live telemetry' },
          ].map((x) => (
            <div key={x.k}>
              <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{x.k}</p>
              <p className="mt-1 t-display font-bold">{x.v}</p>
              <p className="mt-0.5 text-xs t-muted">{x.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
