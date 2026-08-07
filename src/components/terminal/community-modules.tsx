'use client';

import { useMemo, useState } from 'react';
import { Gauge } from './widgets';
import { KpiCard } from './module-ui';

/* ── CVP Community Co-Sign Matrix (Pape Samb Veto Protocol) ── */
const SIGNATORIES = [
  { id: 's1', en: 'Community Assembly Chair', fr: 'Président de l’Assemblée' },
  { id: 's2', en: 'Women’s Cooperative Lead', fr: 'Cheffe de la Coopérative des Femmes' },
  { id: 's3', en: 'Youth Council Delegate', fr: 'Délégué du Conseil des Jeunes' },
  { id: 's4', en: 'Traditional Authority', fr: 'Autorité Traditionnelle' },
  { id: 's5', en: 'Elders’ Circle', fr: 'Cercle des Anciens' },
];
function CvpMatrix({ fr }: { fr: boolean }) {
  const [signed, setSigned] = useState<Record<string, boolean>>({});
  const [threshold, setThreshold] = useState(80);
  const count = Object.values(signed).filter(Boolean).length;
  const pct = Math.round((count / SIGNATORIES.length) * 100);
  const consent = pct >= threshold;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="t-glass rounded-2xl p-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{fr ? 'Matrice de co-signature communautaire' : 'Community co-sign matrix'}</p>
        <div className="mt-4 space-y-2">
          {SIGNATORIES.map((s) => {
            const on = !!signed[s.id];
            return (
              <button key={s.id} onClick={() => setSigned((p) => ({ ...p, [s.id]: !p[s.id] }))}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${on ? 'border-transparent t-glow-emerald' : 'border-[var(--t-line)] hover:border-[var(--t-line-strong)]'}`}
                style={on ? { background: 'var(--t-emerald-soft)' } : undefined}>
                <span className={`grid h-6 w-6 place-items-center rounded-full border text-xs ${on ? 't-emerald' : 't-faint'}`} style={{ borderColor: on ? 'var(--t-emerald)' : 'var(--t-line-strong)' }}>{on ? '✓' : ''}</span>
                <span className="text-sm font-semibold">{fr ? s.fr : s.en}</span>
                <span className={`t-mono ml-auto text-[11px] ${on ? 't-emerald' : 't-faint'}`}>{on ? (fr ? 'CO-SIGNÉ' : 'CO-SIGNED') : (fr ? 'en attente' : 'pending')}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="space-y-4">
        <div className={`t-glass rounded-2xl p-5 ${consent ? 't-glow-emerald' : ''}`}>
          <div className="grid place-items-center"><Gauge value={pct} tone={consent ? 'emerald' : 'amber'} label={fr ? 'consentement' : 'consent'} suffix="%" /></div>
          <p className={`text-center text-sm font-bold ${consent ? 't-emerald' : 't-amber'}`}>{consent ? (fr ? '✓ CONSENTEMENT ATTEINT' : '✓ CONSENT REACHED') : (fr ? 'SEUIL NON ATTEINT' : 'BELOW THRESHOLD')}</p>
        </div>
        <div className="t-glass rounded-2xl p-5">
          <div className="flex justify-between text-xs"><span>{fr ? 'Seuil de veto' : 'Veto threshold'}</span><span className="t-mono t-amber">{threshold}%</span></div>
          <input type="range" min={50} max={100} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="mt-2 w-full accent-[var(--t-amber)]" />
          <p className="mt-2 text-[11px] t-faint">{fr ? 'Protocole de Veto Pape Samb · outil #27' : 'Pape Samb Veto Protocol · tool #27'}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Raw Data Decolonization Vault ── */
const DATASETS = [
  { en: 'Baseline social survey', fr: 'Enquête sociale de référence', access: 'read' },
  { en: 'Environmental telemetry', fr: 'Télémétrie environnementale', access: 'read' },
  { en: 'Revenue distribution ledger', fr: 'Registre de distribution des revenus', access: 'read' },
  { en: 'Grievance case files', fr: 'Dossiers de griefs', access: 'restricted' },
  { en: 'Impact evaluation raw data', fr: 'Données brutes d’évaluation d’impact', access: 'read' },
];
function DataVault({ fr }: { fr: boolean }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label={fr ? 'Jeux de données' : 'Datasets'} value={DATASETS.length} tone="amber" />
        <KpiCard label={fr ? 'Accès communauté' : 'Community access'} value={fr ? 'LECTURE' : 'READ-ONLY'} tone="emerald" />
        <KpiCard label={fr ? 'Souveraineté' : 'Sovereignty'} value="AU" hint="#59" />
        <KpiCard label={fr ? 'Chiffrement' : 'Encryption'} value="AES-256" />
      </div>
      <div className="t-glass rounded-2xl p-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{fr ? 'Coffre de données brutes · accès communautaire' : 'Raw data vault · community access'}</p>
        <div className="mt-4 divide-y divide-[var(--t-line)]">
          {DATASETS.map((d) => (
            <div key={d.en} className="flex items-center gap-3 py-3">
              <span className="t-amber">⛁</span>
              <span className="flex-1 text-sm">{fr ? d.fr : d.en}</span>
              <span className={`t-chip ${d.access === 'read' ? 't-chip-emerald' : ''}`}>{d.access === 'read' ? (fr ? 'lecture communauté' : 'community read') : (fr ? 'restreint' : 'restricted')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Relational Repair Protocol (90-day) ── */
const REPAIR_STEPS = [
  { en: 'Acknowledgement (Day 0)', fr: 'Reconnaissance (J0)', done: true },
  { en: 'Joint fact-finding (Day 15)', fr: 'Établissement conjoint des faits (J15)', done: true },
  { en: 'Remedy design (Day 40)', fr: 'Conception de la réparation (J40)', done: true },
  { en: 'Community ratification (Day 65)', fr: 'Ratification communautaire (J65)', done: false },
  { en: 'Closure & audit (Day 90)', fr: 'Clôture & audit (J90)', done: false },
];
function RepairProtocol({ fr }: { fr: boolean }) {
  const done = REPAIR_STEPS.filter((s) => s.done).length;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <KpiCard label={fr ? 'Jour' : 'Day'} value="65 / 90" tone="amber" />
        <KpiCard label={fr ? 'Étapes' : 'Steps'} value={`${done} / ${REPAIR_STEPS.length}`} tone="emerald" />
        <KpiCard label={fr ? 'Protocole' : 'Protocol'} value="#56" />
      </div>
      <div className="t-glass rounded-2xl p-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{fr ? 'Protocole de réparation 90 jours' : '90-day relational repair'}</p>
        <ol className="mt-4 space-y-3">
          {REPAIR_STEPS.map((s, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className={`grid h-7 w-7 place-items-center rounded-full border text-xs ${s.done ? 't-emerald' : 't-faint'}`} style={{ borderColor: s.done ? 'var(--t-emerald)' : 'var(--t-line-strong)', background: s.done ? 'var(--t-emerald-soft)' : undefined }}>{s.done ? '✓' : i + 1}</span>
              <span className={`text-sm ${s.done ? '' : 't-muted'}`}>{fr ? s.fr : s.en}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ── Veto Threshold Policy Settings ── */
function VetoSettings({ fr }: { fr: boolean }) {
  const [th, setTh] = useState(80);
  const [quorum, setQuorum] = useState(60);
  const [window_, setWindow] = useState(14);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="t-glass rounded-2xl p-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{fr ? 'Réglages de politique de veto · #62' : 'Veto policy settings · #62'}</p>
        <div className="mt-5 space-y-5">
          {[
            { label: fr ? 'Seuil de co-signature' : 'Co-sign threshold', v: th, set: setTh, min: 50, max: 100, suf: '%' },
            { label: fr ? 'Quorum requis' : 'Required quorum', v: quorum, set: setQuorum, min: 30, max: 100, suf: '%' },
            { label: fr ? 'Fenêtre d’objection (jours)' : 'Objection window (days)', v: window_, set: setWindow, min: 7, max: 30, suf: 'd' },
          ].map((r) => (
            <div key={r.label}>
              <div className="flex justify-between text-sm"><span>{r.label}</span><span className="t-mono t-amber">{r.v}{r.suf}</span></div>
              <input type="range" min={r.min} max={r.max} value={r.v} onChange={(e) => r.set(Number(e.target.value))} className="mt-2 w-full accent-[var(--t-amber)]" />
            </div>
          ))}
        </div>
      </div>
      <div className="t-glass rounded-2xl p-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{fr ? 'Politique active' : 'Active policy'}</p>
        <pre className="t-mono mt-4 rounded-lg border border-[var(--t-line)] bg-black/20 p-4 text-[11px] leading-relaxed t-muted">{`veto_policy {
  cosign_threshold: ${th}%
  quorum: ${quorum}%
  objection_window: ${window_}d
  protocol: "pape-samb-veto"
  tool: 62
}`}</pre>
        <p className="mt-3 text-xs t-muted">{fr ? 'Toute décision matérielle requiert le seuil de co-signature dans la fenêtre d’objection, sinon veto communautaire.' : 'Any material decision requires the co-sign threshold within the objection window, else community veto.'}</p>
      </div>
    </div>
  );
}

export function CommunityModule({ module, fr }: { module: string; fr: boolean }) {
  switch (module) {
    case 'cvp-matrix': return <CvpMatrix fr={fr} />;
    case 'data-vault': return <DataVault fr={fr} />;
    case 'repair-protocol': return <RepairProtocol fr={fr} />;
    case 'veto-settings': return <VetoSettings fr={fr} />;
    default: return null;
  }
}
