'use client';

import { useMemo, useState } from 'react';
import { Gauge, StatTile, AnimatedNumber } from './widgets';

interface Lever { id: string; en: string; fr: string; weight: number }

const LEVERS: Lever[] = [
  { id: 'procurement', en: 'Local procurement mandate', fr: 'Mandat d’achat local', weight: 22 },
  { id: 'dividend', en: 'Community dividend lock', fr: 'Verrou de dividende communautaire', weight: 20 },
  { id: 'repatriation', en: 'Profit-repatriation cap', fr: 'Plafond de rapatriement des profits', weight: 18 },
  { id: 'data', en: 'Data-sovereignty residency', fr: 'Résidence des données souveraine', weight: 14 },
  { id: 'employment', en: 'Local employment floor', fr: 'Plancher d’emploi local', weight: 14 },
];

const BASE_SIGMA = 82;
const ANNUAL_FLOW = 4_000_000; // $ value flow the σ leaks from

export function CvpConsent({ fr }: { fr: boolean }) {
  const [applied, setApplied] = useState<Record<string, number>>(() =>
    Object.fromEntries(LEVERS.map((l) => [l.id, 0])),
  );

  const reduction = useMemo(
    () => LEVERS.reduce((acc, l) => acc + (l.weight * (applied[l.id] ?? 0)) / 100, 0),
    [applied],
  );
  const sigma = Math.max(4, Math.round(BASE_SIGMA - reduction));
  const retained = Math.round((ANNUAL_FLOW * (BASE_SIGMA - sigma)) / 100 / 10_000) * 10_000;
  const reductionPct = Math.round(((BASE_SIGMA - sigma) / BASE_SIGMA) * 100);

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      {/* Gauge + telemetry */}
      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className={`t-glass rounded-2xl p-5 ${sigma < 40 ? 't-glow-emerald' : ''}`}>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{fr ? 'Coefficient de fuite σ' : 'Leakage coefficient σ'}</p>
            <span className="t-chip"><span className="t-live-dot" /> live</span>
          </div>
          <div className="grid place-items-center">
            <Gauge value={sigma} label={fr ? 'σ actuel (bas = mieux)' : 'current σ (lower = better)'} tone={sigma < 40 ? 'emerald' : 'amber'} />
          </div>
          <p className="t-mono text-center text-xs t-faint">{fr ? 'référence' : 'baseline'} σ = {BASE_SIGMA}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatTile label={fr ? 'Réduction σ' : 'σ reduction'} tone="emerald"><span className="t-emerald"><AnimatedNumber value={reductionPct} suffix="%" /></span></StatTile>
          <StatTile label={fr ? 'Valeur retenue/an' : 'Value retained/yr'} tone="amber"><span className="t-amber"><AnimatedNumber value={retained / 1_000_000} decimals={2} prefix="$" suffix="M" /></span></StatTile>
        </div>
      </div>

      {/* Levers */}
      <div className="t-glass rounded-2xl p-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{fr ? 'Leviers de consentement CVP' : 'CVP consent levers'}</p>
        <p className="mt-1 text-xs t-muted">{fr ? 'Ajustez chaque levier pour supprimer la fuite de valeur en temps réel.' : 'Tune each lever to suppress value leakage in real time.'}</p>
        <div className="mt-5 space-y-5">
          {LEVERS.map((l) => (
            <div key={l.id}>
              <div className="flex items-center justify-between text-sm">
                <span>{fr ? l.fr : l.en}</span>
                <span className="t-mono text-xs">
                  <span className="t-amber">{applied[l.id]}%</span>
                  <span className="t-faint"> · −{((l.weight * applied[l.id]) / 100).toFixed(1)}σ</span>
                </span>
              </div>
              <input
                type="range" min={0} max={100} value={applied[l.id]}
                onChange={(e) => setApplied((a) => ({ ...a, [l.id]: Number(e.target.value) }))}
                className="mt-2 w-full accent-[var(--t-emerald)]"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl border border-[var(--t-line)] p-4">
          <div>
            <p className="text-xs t-muted">{fr ? 'Consentement CVP enregistré' : 'CVP consent recorded'}</p>
            <p className="t-mono text-sm">{sigma < 40 ? (fr ? '✓ seuil de redevabilité atteint' : '✓ accountability threshold met') : (fr ? 'continuer à réduire σ' : 'keep reducing σ')}</p>
          </div>
          <a href="seal" className="t-btn text-xs">{fr ? 'Étape 05 : Sceau' : 'Step 05: Seal'} →</a>
        </div>
      </div>
    </div>
  );
}
