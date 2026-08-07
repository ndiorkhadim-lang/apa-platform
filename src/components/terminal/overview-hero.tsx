'use client';

import { motion } from 'motion/react';
import { computePremiumTelemetry } from '@/domain/certification/premium-telemetry';
import { AnimatedNumber, Gauge, StatTile } from './widgets';

const SAMPLE = 87;

export function OverviewHero({ fr }: { fr: boolean }) {
  const t = computePremiumTelemetry(SAMPLE);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="grid gap-6 lg:grid-cols-[1.2fr_1fr]"
    >
      <div className="t-grid-bg t-glass relative overflow-hidden rounded-3xl p-7 sm:p-10">
        <span className="t-chip t-chip-emerald">
          <span className="t-live-dot" /> {fr ? 'Télémétrie en direct' : 'Live telemetry'}
        </span>
        <h1 className="t-display mt-5 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
          {fr ? 'Le terminal de certification' : 'The certification'}
          <br />
          <span className="t-amber">{fr ? 'souveraine.' : 'terminal.'}</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed t-muted">
          {fr
            ? 'Option B — une surface nouvelle génération inspirée des terminaux financiers. Chaque saisie recalcule en temps réel la compression du coût du capital et l’uplift de valorisation, adossée au vrai moteur C-SPA.'
            : 'Option B — a next-gen surface inspired by financial terminals. Every input re-computes cost-of-capital compression and valuation uplift in real time, wired to the real C-SPA engine.'}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="cspa" className="t-btn">{fr ? 'Lancer le circuit' : 'Start the circuit'} →</a>
          <a href="seal" className="t-btn t-btn-ghost">{fr ? 'Voir le sceau' : 'View the seal'}</a>
        </div>
      </div>

      <div className="t-glass t-glow-amber rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">
            {fr ? 'Projection Prime d’Authenticité™' : 'Authenticity Premium™ projection'}
          </p>
          <span className="t-chip t-chip-amber">{fr ? 'échantillon' : 'sample'}</span>
        </div>
        <div className="mt-2 grid place-items-center">
          <Gauge value={t.trustIndex} label={fr ? 'Indice de confiance' : 'Trust index'} tone="emerald" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatTile label={fr ? 'Compression bps' : 'BPS compression'} tone="emerald">
            <span className="t-emerald"><AnimatedNumber value={t.bpsCompression} suffix=" bps" /></span>
          </StatTile>
          <StatTile label={fr ? 'Uplift valorisation' : 'Valuation uplift'} tone="amber">
            <span className="t-amber"><AnimatedNumber value={t.valuationUpliftUsd / 1_000_000} decimals={2} prefix="$" suffix="M" /></span>
          </StatTile>
        </div>
      </div>
    </motion.section>
  );
}
