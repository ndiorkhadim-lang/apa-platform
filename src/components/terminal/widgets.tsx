'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/* ── Animated count-up (rAF, eased) ─────────────────────────────── */
export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    const start = performance.now();
    const dur = 600;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      fromRef.current = to;
    };
  }, [value]);

  const formatted = display.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return <span className={`t-mono ${className}`}>{prefix}{formatted}{suffix}</span>;
}

/* ── Stat tile ──────────────────────────────────────────────────── */
export function StatTile({
  label,
  children,
  hint,
  tone = 'default',
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  tone?: 'default' | 'amber' | 'emerald';
}) {
  const toneClass = tone === 'amber' ? 't-glow-amber' : tone === 'emerald' ? 't-glow-emerald' : '';
  return (
    <div className={`t-glass ${toneClass} rounded-2xl p-4`}>
      <p className="text-[11px] font-semibold uppercase tracking-widest t-faint">{label}</p>
      <div className="mt-1.5 text-2xl font-bold leading-none">{children}</div>
      {hint && <p className="mt-1.5 text-xs t-muted">{hint}</p>}
    </div>
  );
}

/* ── Radar chart (SVG) ──────────────────────────────────────────── */
export function RadarChart({
  axes,
  values,
  size = 260,
}: {
  axes: string[];
  values: number[]; // 0..100 each, same length as axes
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 34;
  const n = axes.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, radius: number) => [cx + radius * Math.cos(angle(i)), cy + radius * Math.sin(angle(i))];
  const rings = [0.25, 0.5, 0.75, 1];

  const dataPts = values.map((v, i) => point(i, (Math.max(0, Math.min(100, v)) / 100) * r));
  const dataPath = dataPts.map((p) => p.join(',')).join(' ');

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" style={{ maxWidth: size }} aria-hidden>
      {rings.map((ring, ri) => (
        <polygon
          key={ri}
          points={axes.map((_, i) => point(i, r * ring).join(',')).join(' ')}
          fill="none"
          stroke="var(--t-line)"
          strokeWidth={1}
        />
      ))}
      {axes.map((_, i) => {
        const [x, y] = point(i, r);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--t-line)" strokeWidth={1} />;
      })}
      <polygon points={dataPath} fill="rgba(245,158,11,0.18)" stroke="var(--t-amber)" strokeWidth={2} strokeLinejoin="round" />
      {dataPts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill="var(--t-amber)" />
      ))}
      {axes.map((label, i) => {
        const [x, y] = point(i, r + 18);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            fontSize={10} fill="var(--t-muted)" className="t-mono">
            {label}
          </text>
        );
      })}
    </svg>
  );
}

/* ── Semicircular gauge (SVG) ───────────────────────────────────── */
export function Gauge({
  value,
  size = 200,
  label,
  suffix = '',
  tone = 'amber',
}: {
  value: number; // 0..100
  size?: number;
  label?: string;
  suffix?: string;
  tone?: 'amber' | 'emerald';
}) {
  const v = Math.max(0, Math.min(100, value));
  const stroke = 14;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = Math.PI * r; // half circle
  const dash = (v / 100) * circ;
  const color = tone === 'emerald' ? 'var(--t-emerald)' : 'var(--t-amber)';

  return (
    <svg viewBox={`0 0 ${size} ${size / 2 + 24}`} width="100%" style={{ maxWidth: size }} aria-hidden>
      <path d={`M ${stroke / 2} ${cy} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${cy}`}
        fill="none" stroke="var(--t-line)" strokeWidth={stroke} strokeLinecap="round" />
      <path d={`M ${stroke / 2} ${cy} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${cy}`}
        fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`} style={{ transition: 'stroke-dasharray .6s cubic-bezier(.16,1,.3,1)' }} />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize={size * 0.2} fontWeight={800} fill="var(--t-text)" className="t-mono">
        {Math.round(v)}{suffix}
      </text>
      {label && (
        <text x={cx} y={cy + 16} textAnchor="middle" fontSize={11} fill="var(--t-muted)">{label}</text>
      )}
    </svg>
  );
}
