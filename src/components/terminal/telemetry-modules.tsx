'use client';

import { useMemo, useState } from 'react';
import { Gauge, AnimatedNumber } from './widgets';
import { KpiCard } from './module-ui';

/* ── σ leakage suppression ─────────────────────────── */
function SigmaModule({ fr }: { fr: boolean }) {
  const [sigma, setSigma] = useState(0.024);
  const pass = sigma <= 0.05;
  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <div className={`t-glass rounded-2xl p-5 ${pass ? 't-glow-emerald' : ''}`}>
        <div className="grid place-items-center">
          <Gauge value={Math.min(100, (sigma / 0.1) * 100)} suffix="" tone={pass ? 'emerald' : 'amber'} label={`σ = ${sigma.toFixed(3)}`} />
        </div>
        <p className="t-mono text-center text-xs t-faint">{fr ? 'cible' : 'target'} ≤ 0.05</p>
      </div>
      <div className="t-glass rounded-2xl p-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{fr ? 'Simulateur de suppression σ' : 'σ suppression simulator'}</p>
        <input type="range" min={0} max={0.1} step={0.001} value={sigma} onChange={(e) => setSigma(Number(e.target.value))} className="mt-4 w-full accent-[var(--t-emerald)]" />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <KpiCard label={fr ? 'Statut' : 'Status'} value={pass ? (fr ? 'CONFORME' : 'COMPLIANT') : (fr ? 'HORS SEUIL' : 'BREACH')} tone={pass ? 'emerald' : 'red'} />
          <KpiCard label={fr ? 'Marge au seuil' : 'Margin to gate'} value={<AnimatedNumber value={(0.05 - sigma) * 1000} decimals={0} suffix=" bp" />} />
        </div>
        <p className="mt-4 text-xs t-muted">{fr ? 'Le coefficient de fuite σ mesure la valeur qui échappe à la communauté. Chaque levier de consentement CVP (étape 04) le comprime.' : 'The leakage coefficient σ measures value escaping the community. Each CVP consent lever (step 04) compresses it.'}</p>
      </div>
    </div>
  );
}

/* ── Partnership Quality Index ─────────────────────── */
const PQI_DIMS = [
  { en: 'Communication', fr: 'Communication', v: 4.4 },
  { en: 'Respect', fr: 'Respect', v: 4.2 },
  { en: 'Delivery', fr: 'Exécution', v: 3.9 },
  { en: 'Transparency', fr: 'Transparence', v: 4.6 },
  { en: 'Repair', fr: 'Réparation', v: 4.1 },
];
function PqiModule({ fr }: { fr: boolean }) {
  const avg = useMemo(() => PQI_DIMS.reduce((a, d) => a + d.v, 0) / PQI_DIMS.length, []);
  const pass = avg > 4.0;
  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <div className={`t-glass rounded-2xl p-5 ${pass ? 't-glow-emerald' : ''}`}>
        <div className="grid place-items-center">
          <Gauge value={(avg / 5) * 100} tone={pass ? 'emerald' : 'amber'} label={`${avg.toFixed(2)} / 5.0`} />
        </div>
        <p className="t-mono text-center text-xs t-faint">{fr ? 'cible' : 'target'} &gt; 4.0 · 360° feedback</p>
      </div>
      <div className="t-glass rounded-2xl p-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{fr ? 'Décomposition 360°' : '360° breakdown'}</p>
        <div className="mt-4 space-y-3">
          {PQI_DIMS.map((d) => (
            <div key={d.en}>
              <div className="flex justify-between text-xs"><span>{fr ? d.fr : d.en}</span><span className="t-mono t-amber">{d.v.toFixed(1)}</span></div>
              <div className="mt-1 t-progress"><span style={{ width: `${(d.v / 5) * 100}%`, background: d.v >= 4 ? 'var(--t-emerald)' : undefined }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 10-year systems change ────────────────────────── */
function SystemsModule({ fr }: { fr: boolean }) {
  const years = [12, 20, 28, 35, 44, 52, 61, 68, 74, 81];
  const w = 560, h = 160, max = 100;
  const pts = years.map((v, i) => `${(i / (years.length - 1)) * w},${h - (v / max) * h}`).join(' ');
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label={fr ? 'Permanence' : 'Permanence'} value="81%" tone="emerald" hint={fr ? 'an 10' : 'year 10'} />
        <KpiCard label={fr ? 'Politiques ancrées' : 'Anchored policies'} value="7" />
        <KpiCard label={fr ? 'Institutionnalisé' : 'Institutionalized'} value="#28" />
        <KpiCard label={fr ? 'Systèmes changés' : 'Systems changed'} value="#33" tone="amber" />
      </div>
      <div className="t-glass rounded-2xl p-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{fr ? 'Permanence des politiques · 10 ans' : 'Policy permanence · 10-year'}</p>
        <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full" preserveAspectRatio="none" style={{ maxHeight: 180 }}>
          <polyline points={pts} fill="none" stroke="var(--t-emerald)" strokeWidth={2.5} />
          <polyline points={`0,${h} ${pts} ${w},${h}`} fill="var(--t-emerald-soft)" stroke="none" />
          {years.map((v, i) => <circle key={i} cx={(i / (years.length - 1)) * w} cy={h - (v / max) * h} r={3} fill="var(--t-emerald)" />)}
        </svg>
        <div className="mt-1 flex justify-between text-[10px] t-faint t-mono">{years.map((_, i) => <span key={i}>Y{i + 1}</span>)}</div>
      </div>
    </div>
  );
}

/* ── Grievance & anti-retaliation ──────────────────── */
function GrievanceModule({ fr }: { fr: boolean }) {
  const months = [8, 6, 7, 5, 4, 3, 3, 2];
  const resolved = [5, 5, 6, 5, 4, 3, 3, 2];
  const maxv = 10;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label={fr ? 'Ouverts' : 'Open'} value="2" tone="amber" />
        <KpiCard label={fr ? 'Résolus (90j)' : 'Resolved (90d)'} value="94%" tone="emerald" />
        <KpiCard label={fr ? 'Représailles' : 'Retaliation'} value={fr ? 'AUCUNE' : 'NONE'} tone="emerald" hint="#58" />
        <KpiCard label={fr ? 'Tendance' : 'Trend'} value="↓ 75%" tone="emerald" hint="#25" />
      </div>
      <div className="t-glass rounded-2xl p-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{fr ? 'Griefs déposés vs résolus' : 'Grievances filed vs resolved'}</p>
        <div className="mt-4 flex items-end gap-2" style={{ height: 140 }}>
          {months.map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center justify-end gap-0.5">
              <div className="flex w-full items-end justify-center gap-0.5" style={{ height: 120 }}>
                <div className="w-1/2 rounded-t" style={{ height: `${(v / maxv) * 100}%`, background: 'var(--t-amber)' }} />
                <div className="w-1/2 rounded-t" style={{ height: `${(resolved[i] / maxv) * 100}%`, background: 'var(--t-emerald)' }} />
              </div>
              <span className="text-[9px] t-faint t-mono">M{i + 1}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-4 text-[11px] t-muted">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded" style={{ background: 'var(--t-amber)' }} />{fr ? 'déposés' : 'filed'}</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded" style={{ background: 'var(--t-emerald)' }} />{fr ? 'résolus' : 'resolved'}</span>
        </div>
      </div>
    </div>
  );
}

export function TelemetryModule({ metric, fr }: { metric: string; fr: boolean }) {
  switch (metric) {
    case 'sigma': return <SigmaModule fr={fr} />;
    case 'pqi': return <PqiModule fr={fr} />;
    case 'systems-change': return <SystemsModule fr={fr} />;
    case 'grievance': return <GrievanceModule fr={fr} />;
    default: return null;
  }
}
