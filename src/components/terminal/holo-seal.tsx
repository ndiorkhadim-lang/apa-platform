'use client';

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface HoloSealProps {
  fr: boolean;
  holderName: string;
  achievementName: string;
  composite: number | null;
  maturity: string | null;
  serial: string;
  issuerName: string;
  issuerDid: string;
  proofValue: string;
  validUntil: string;
  qr: string; // inline SVG
  verifyUrl: string;
}

export function HoloSeal(p: HoloSealProps) {
  const { fr } = p;
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const [exp, setExp] = useState<'idle' | 'running' | 'done'>('idle');

  const onMove = (e: ReactPointerEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ ry: (px - 0.5) * 16, rx: -(py - 0.5) * 16, gx: px * 100, gy: py * 100 });
  };
  const reset = () => setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });

  const runExport = async () => {
    setExp('running');
    await new Promise((r) => setTimeout(r, 1200));
    setExp('done');
  };

  const ref = `DFI-${p.serial.replace(/[^A-Z0-9]/gi, '').slice(-6)}-${new Date().getFullYear()}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Holographic card */}
      <div className="grid place-items-center py-4" style={{ perspective: 1200 }}>
        <div
          ref={cardRef}
          onPointerMove={onMove}
          onPointerLeave={reset}
          className="t-holo relative aspect-[1.6/1] w-full max-w-lg overflow-hidden rounded-3xl border border-[var(--t-line-strong)] p-6 shadow-2xl"
          style={{
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform .15s ease-out',
          }}
        >
          {/* holo sheen following pointer */}
          <div className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(400px circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,.16), transparent 45%)` }} />
          <div className="relative flex h-full flex-col justify-between text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="t-mono text-[10px] uppercase tracking-[0.3em] text-amber-300">{p.issuerName}</p>
                <p className="t-display mt-1 text-lg font-extrabold">Authenticity Premium™ Seal</p>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-amber-300/40 text-xl text-amber-300">❖</span>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/60">{fr ? 'Décerné à' : 'Awarded to'}</p>
              <p className="t-display text-2xl font-bold">{p.holderName}</p>
              <p className="text-sm text-amber-200">{p.achievementName}</p>
            </div>

            <div className="flex items-end justify-between">
              <div className="t-mono text-[11px] text-white/70">
                <p>{p.serial}</p>
                {p.composite !== null && <p className="text-emerald-300">C-SPA {p.composite} · {p.maturity}</p>}
                <p className="text-white/50">exp {p.validUntil.slice(0, 10)}</p>
              </div>
              <div className="rounded-lg bg-white p-1.5" style={{ transform: 'translateZ(30px)' }}>
                <div className="h-16 w-16 [&_svg]:h-full [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: p.qr }} />
              </div>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs t-faint">{fr ? 'Bougez la souris sur la carte · QR = titre réel vérifiable' : 'Move your cursor over the card · QR = real verifiable credential'}</p>
      </div>

      {/* Verify + DFI export */}
      <div className="space-y-4">
        <div className="t-glass rounded-2xl p-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{fr ? 'Preuve cryptographique' : 'Cryptographic proof'}</p>
          <p className="t-mono mt-2 break-all text-[11px] t-emerald">{p.proofValue.slice(0, 44)}…</p>
          <p className="t-mono mt-1 break-all text-[11px] t-faint">{p.issuerDid}</p>
          <a href={p.verifyUrl} target="_blank" rel="noopener noreferrer" className="t-btn t-btn-ghost mt-3 w-full justify-center text-xs">
            {fr ? 'Ouvrir le registre de vérification' : 'Open verification registry'} ↗
          </a>
        </div>

        <div className="t-glass rounded-2xl p-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{fr ? 'Export API — DFI / Investisseur' : 'API export — DFI / Investor'}</p>
          <button onClick={runExport} disabled={exp === 'running'} className="t-btn mt-3 w-full justify-center text-xs disabled:opacity-60">
            {exp === 'running' ? (fr ? 'Transmission…' : 'Transmitting…') : `⇪ ${fr ? 'Exporter vers l’API DFI' : 'Export to DFI API'}`}
          </button>
          <AnimatePresence>
            {exp !== 'idle' && (
              <motion.pre
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0 }}
                className="t-mono mt-3 overflow-x-auto rounded-lg border border-[var(--t-line)] bg-black/30 p-3 text-[10.5px] leading-relaxed t-muted"
              >
{`POST /v1/credentials/ingest
{
  "credential": "${p.serial}",
  "did": "${p.issuerDid}",
  "cspa": ${p.composite ?? 'null'},
  "verify": "${p.verifyUrl}"
}`}
                {exp === 'done' && (
                  <span className="mt-2 block t-emerald">→ 202 Accepted · ref {ref}</span>
                )}
              </motion.pre>
            )}
          </AnimatePresence>
        </div>

        <a href="/certify-v2" className="t-btn t-btn-ghost w-full justify-center text-xs">↺ {fr ? 'Retour à l’aperçu' : 'Back to overview'}</a>
      </div>
    </div>
  );
}
