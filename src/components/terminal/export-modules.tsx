'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { KpiCard } from './module-ui';

const SERIAL = 'APA-2026-SN-000001';

/* ── DFI & Rating Agency Export ── */
const FRAMEWORKS = [
  { code: 'IFC PS1', en: 'Assessment & Management of E&S Risks', fr: 'Gestion des risques E&S', status: 'aligned' },
  { code: 'EU CSDDD', en: 'Corporate Sustainability Due Diligence', fr: 'Devoir de vigilance UE', status: 'aligned' },
  { code: 'UK Bribery Act', en: 'Adequate Procedures (S.7)', fr: 'Procédures adéquates (art.7)', status: 'aligned' },
  { code: 'OECD MNE', en: 'Guidelines for Multinationals', fr: 'Principes pour les multinationales', status: 'partial' },
];
function DfiExport({ fr }: { fr: boolean }) {
  const [exp, setExp] = useState<'idle' | 'running' | 'done'>('idle');
  const run = async () => { setExp('running'); await new Promise((r) => setTimeout(r, 1100)); setExp('done'); };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label={fr ? 'Cadres alignés' : 'Frameworks aligned'} value="3 / 4" tone="emerald" />
        <KpiCard label={fr ? 'Titre' : 'Credential'} value={SERIAL.slice(-6)} />
        <KpiCard label={fr ? 'Prêt export' : 'Export ready'} value={fr ? 'OUI' : 'YES'} tone="emerald" />
        <KpiCard label="C-SPA" value="87 / 100" tone="amber" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {FRAMEWORKS.map((f) => (
          <div key={f.code} className="t-glass rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="t-mono font-bold t-amber">{f.code}</span>
              <span className={`t-chip ${f.status === 'aligned' ? 't-chip-emerald' : ''}`}>{f.status === 'aligned' ? (fr ? 'aligné' : 'aligned') : (fr ? 'partiel' : 'partial')}</span>
            </div>
            <p className="mt-2 text-sm t-muted">{fr ? f.fr : f.en}</p>
          </div>
        ))}
      </div>
      <div className="t-glass rounded-2xl p-6">
        <button onClick={run} disabled={exp === 'running'} className="t-btn text-xs disabled:opacity-60">{exp === 'running' ? (fr ? 'Génération…' : 'Generating…') : `⇪ ${fr ? 'Générer le paquet d’export DFI' : 'Generate DFI export package'}`}</button>
        <AnimatePresence>
          {exp !== 'idle' && (
            <motion.pre initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="t-mono mt-4 overflow-x-auto rounded-lg border border-[var(--t-line)] bg-black/25 p-4 text-[10.5px] leading-relaxed t-muted">{`{
  "credential": "${SERIAL}",
  "cspa": 87,
  "frameworks": ["IFC PS1", "EU CSDDD", "UK Bribery Act"],
  "verify": "https://apa-platform-five.vercel.app/en/verify/${SERIAL}"
}`}{exp === 'done' && <span className="mt-2 block t-emerald">→ 202 Accepted · {fr ? 'transmis à la salle de données DFI' : 'delivered to DFI data room'}</span>}</motion.pre>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── MSCI & Moody's Credibility Stream ── */
const AGENCIES = [
  { name: 'MSCI ESG', score: 'AA', delta: '+2 notches', up: true },
  { name: 'Moody’s', score: 'Baa1', delta: '+1 notch', up: true },
  { name: 'S&P Global', score: 'BBB+', delta: 'stable', up: true },
  { name: 'Sustainalytics', score: '18.4 (Low)', delta: '−3.1 risk', up: true },
];
function Ratings({ fr }: { fr: boolean }) {
  const stream = [58, 61, 63, 66, 70, 74, 79, 83, 87];
  const w = 560, h = 120;
  const pts = stream.map((v, i) => `${(i / (stream.length - 1)) * w},${h - (v / 100) * h}`).join(' ');
  return (
    <div className="space-y-6">
      <div className="t-glass rounded-2xl p-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{fr ? 'Flux de crédibilité · 9 périodes' : 'Credibility stream · 9 periods'}</p>
        <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full" preserveAspectRatio="none" style={{ maxHeight: 140 }}>
          <polyline points={`0,${h} ${pts} ${w},${h}`} fill="var(--t-amber-soft)" stroke="none" />
          <polyline points={pts} fill="none" stroke="var(--t-amber)" strokeWidth={2.5} />
        </svg>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {AGENCIES.map((a) => (
          <div key={a.name} className="t-glass rounded-2xl p-4">
            <p className="text-xs t-muted">{a.name}</p>
            <p className="t-display mt-1 text-xl font-bold t-amber">{a.score}</p>
            <p className="t-mono mt-1 text-[11px] t-emerald">▲ {a.delta}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Cryptographic Hash Registry (ZKP) ── */
const HASHES = [
  { ev: 'certificate.issue', h: '0x9f2ad4c1b7e83f6a2d5c1e0b4a7f9d2c8e1b6a3f' },
  { ev: 'cvp.consent', h: '0x3c8e1b6a3f9d2c5c1e0b4a7f9f2ad4c1b7e83f6a' },
  { ev: 'capstone.approve', h: '0xb7e83f6a2d5c1e0b4a7f9d2c8e1b6a3f9f2ad4c1' },
  { ev: 'status.anchor', h: '0x2d5c1e0b4a7f9d2c8e1b6a3f9f2ad4c1b7e83f6a' },
];
function Blockchain({ fr }: { fr: boolean }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label={fr ? 'Attestations' : 'Attestations'} value={HASHES.length} tone="amber" />
        <KpiCard label={fr ? 'Preuve' : 'Proof'} value="ZKP" tone="emerald" />
        <KpiCard label={fr ? 'Courbe' : 'Curve'} value="Ed25519" />
        <KpiCard label={fr ? 'Ancrage' : 'Anchoring'} value={fr ? 'IMMUABLE' : 'IMMUTABLE'} tone="emerald" />
      </div>
      <div className="t-glass rounded-2xl p-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{fr ? 'Registre de hachage — preuves d’attestation ZKP' : 'Hash registry — ZKP attestation proofs'}</p>
        <div className="mt-4 divide-y divide-[var(--t-line)]">
          {HASHES.map((r) => (
            <div key={r.ev} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-3">
              <span className="t-emerald">⛓</span>
              <span className="t-mono text-xs t-amber">{r.ev}</span>
              <span className="t-mono ml-auto break-all text-[11px] t-muted">{r.h}</span>
              <span className="t-chip t-chip-emerald">✓ {fr ? 'vérifié' : 'verified'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ExportModule({ channel, fr }: { channel: string; fr: boolean }) {
  switch (channel) {
    case 'dfi': return <DfiExport fr={fr} />;
    case 'ratings': return <Ratings fr={fr} />;
    case 'blockchain': return <Blockchain fr={fr} />;
    default: return null;
  }
}
