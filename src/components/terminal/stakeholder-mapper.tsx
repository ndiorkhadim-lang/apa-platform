'use client';

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { motion } from 'motion/react';
import { StatTile } from './widgets';

interface Node { id: string; label: string; x: number | null; y: number | null } // x,y in 0..100, null = in tray

const SEED: { id: string; en: string; fr: string }[] = [
  { id: 'community', en: 'Host Community', fr: 'Communauté hôte' },
  { id: 'regulator', en: 'Regulator', fr: 'Régulateur' },
  { id: 'dfi', en: 'DFI / Investor', fr: 'DFI / Investisseur' },
  { id: 'workers', en: 'Workers', fr: 'Travailleurs' },
  { id: 'suppliers', en: 'Suppliers', fr: 'Fournisseurs' },
  { id: 'elders', en: 'Traditional Leaders', fr: 'Chefs traditionnels' },
  { id: 'ngo', en: 'Civil Society', fr: 'Société civile' },
  { id: 'media', en: 'Media', fr: 'Médias' },
];

interface Grievance { id: string; text: string; severity: number } // 1..3

export function StakeholderMapper({ fr }: { fr: boolean }) {
  const [nodes, setNodes] = useState<Node[]>(SEED.map((s) => ({ id: s.id, label: fr ? s.fr : s.en, x: null, y: null })));
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [gText, setGText] = useState('');
  const [gSev, setGSev] = useState(2);
  const boardRef = useRef<HTMLDivElement>(null);
  const dragId = useRef<string | null>(null);

  const place = (id: string, clientX: number, clientY: number) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(4, Math.min(96, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(4, Math.min(96, ((clientY - rect.top) / rect.height) * 100));
    setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, x, y } : n)));
  };

  const onPointerDownTray = (id: string) => (e: ReactPointerEvent) => {
    e.preventDefault();
    place(id, e.clientX, e.clientY);
    dragId.current = id;
  };
  const onPointerDownNode = (id: string) => (e: ReactPointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragId.current = id;
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (dragId.current) place(dragId.current, e.clientX, e.clientY);
  };
  const onPointerUp = () => { dragId.current = null; };

  const placed = nodes.filter((n) => n.x !== null);
  const tray = nodes.filter((n) => n.x === null);
  // Manage-closely quadrant = high power (low y) + high interest (high x)
  const critical = placed.filter((n) => (n.y ?? 100) < 50 && (n.x ?? 0) > 50).length;
  const sigma = Math.min(100, grievances.reduce((a, g) => a + g.severity * 8, 0));

  const addGrievance = () => {
    if (!gText.trim()) return;
    setGrievances((gs) => [...gs, { id: `${Date.now()}`, text: gText.trim(), severity: gSev }]);
    setGText('');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="t-glass rounded-2xl p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">
          {fr ? 'Matrice Pouvoir × Intérêt — glissez les acteurs' : 'Power × Interest matrix — drag the actors'}
        </p>

        {/* Tray */}
        <div className="mt-3 flex flex-wrap gap-2">
          {tray.length === 0 && <span className="text-xs t-faint">{fr ? 'Tous les acteurs sont placés.' : 'All actors placed.'}</span>}
          {tray.map((n) => (
            <button
              key={n.id}
              onPointerDown={onPointerDownTray(n.id)}
              className="t-chip cursor-grab select-none active:cursor-grabbing hover:border-[var(--t-amber)]"
            >
              ⠿ {n.label}
            </button>
          ))}
        </div>

        {/* Board */}
        <div
          ref={boardRef}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          className="t-grid-bg relative mt-4 aspect-square w-full touch-none overflow-hidden rounded-xl border border-[var(--t-line)]"
        >
          {/* Axes labels */}
          <span className="absolute left-2 top-2 t-mono text-[10px] t-emerald">↑ {fr ? 'POUVOIR' : 'POWER'}</span>
          <span className="absolute bottom-2 right-2 t-mono text-[10px] t-amber">{fr ? 'INTÉRÊT' : 'INTEREST'} →</span>
          <div className="pointer-events-none absolute inset-0 grid grid-cols-2 grid-rows-2 text-[9px] uppercase tracking-widest t-faint">
            <div className="border-b border-r border-[var(--t-line)] p-2 pt-7">{fr ? 'Tenir satisfait' : 'Keep satisfied'}</div>
            <div className="border-b border-[var(--t-line)] p-2 pt-7 text-right t-emerald">{fr ? 'Gérer de près' : 'Manage closely'}</div>
            <div className="border-r border-[var(--t-line)] p-2">{fr ? 'Surveiller' : 'Monitor'}</div>
            <div className="p-2 text-right">{fr ? 'Tenir informé' : 'Keep informed'}</div>
          </div>

          {placed.map((n) => (
            <motion.button
              key={n.id}
              onPointerDown={onPointerDownNode(n.id)}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full border px-2.5 py-1 text-[11px] font-semibold active:cursor-grabbing"
              style={{
                left: `${n.x}%`, top: `${n.y}%`,
                background: (n.y ?? 100) < 50 && (n.x ?? 0) > 50 ? 'var(--t-emerald-soft)' : 'var(--t-amber-soft)',
                borderColor: (n.y ?? 100) < 50 && (n.x ?? 0) > 50 ? 'rgba(16,185,129,.5)' : 'rgba(245,158,11,.4)',
                color: (n.y ?? 100) < 50 && (n.x ?? 0) > 50 ? 'var(--t-emerald)' : 'var(--t-amber)',
              }}
            >
              {n.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Side: grievances + telemetry */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <StatTile label={fr ? 'Acteurs placés' : 'Actors placed'}>{placed.length}<span className="t-faint text-base">/{nodes.length}</span></StatTile>
          <StatTile label={fr ? 'Gérer de près' : 'Manage closely'} tone="emerald"><span className="t-emerald">{critical}</span></StatTile>
        </div>

        <div className="t-glass rounded-2xl p-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{fr ? 'Registre des griefs' : 'Grievance register'}</p>
          <div className="mt-3 flex gap-2">
            <input
              value={gText}
              onChange={(e) => setGText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addGrievance()}
              placeholder={fr ? 'Nouveau grief…' : 'New grievance…'}
              className="min-w-0 flex-1 rounded-lg border border-[var(--t-line)] bg-transparent px-2.5 py-1.5 text-xs outline-none focus:border-[var(--t-amber)]"
            />
            <select value={gSev} onChange={(e) => setGSev(Number(e.target.value))}
              className="rounded-lg border border-[var(--t-line)] bg-transparent px-1.5 py-1.5 text-xs outline-none">
              <option value={1}>{fr ? 'faible' : 'low'}</option>
              <option value={2}>{fr ? 'moyen' : 'med'}</option>
              <option value={3}>{fr ? 'élevé' : 'high'}</option>
            </select>
            <button onClick={addGrievance} className="t-btn px-3 py-1.5 text-xs">+</button>
          </div>
          <ul className="mt-3 space-y-1.5">
            {grievances.length === 0 && <li className="text-xs t-faint">{fr ? 'Aucun grief enregistré.' : 'No grievances logged.'}</li>}
            {grievances.map((g) => (
              <li key={g.id} className="flex items-center gap-2 text-xs">
                <span className="t-mono" style={{ color: g.severity === 3 ? 'var(--t-red)' : g.severity === 2 ? 'var(--t-amber)' : 'var(--t-muted)' }}>
                  {'●'.repeat(g.severity)}
                </span>
                <span className="flex-1">{g.text}</span>
                <button onClick={() => setGrievances((gs) => gs.filter((x) => x.id !== g.id))} className="t-faint hover:t-amber">✕</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="t-glass rounded-2xl p-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{fr ? 'Charge de grief σ' : 'Grievance load σ'}</p>
          <div className="mt-2 t-progress" aria-hidden><span style={{ width: `${sigma}%`, background: sigma > 60 ? 'var(--t-red)' : undefined }} /></div>
          <p className="mt-2 t-mono text-xs t-muted">σ = {sigma} / 100 · {fr ? 'à réduire à l’étape 04' : 'reduce at step 04'}</p>
          <a href="contracts" className="t-btn mt-4 w-full justify-center text-xs">{fr ? 'Étape 03 : Contrats' : 'Step 03: Contracts'} →</a>
        </div>
      </div>
    </div>
  );
}
