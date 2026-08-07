'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { CONTROL_TOWER } from './control-tower';

const TENANTS = [
  { id: 'dakar', label: 'Dakar Energy Corp', country: 'Senegal', flag: '🇸🇳' },
  { id: 'lagos', label: 'Lagos Infra Holdings', country: 'Nigeria', flag: '🇳🇬' },
  { id: 'nairobi', label: 'Nairobi Green Capital', country: 'Kenya', flag: '🇰🇪' },
  { id: 'accra', label: 'Accra Gold Ventures', country: 'Ghana', flag: '🇬🇭' },
];

const ROLES = [
  { id: 'candidate', en: 'Candidate', fr: 'Candidat' },
  { id: 'auditor', en: 'Auditor', fr: 'Auditeur' },
  { id: 'org-admin', en: 'Org Admin', fr: 'Admin Org' },
];

/**
 * The single sovereign application shell — one header, one Control-Tower
 * sidebar, one footer. Shared by the (terminal) and (app) planes so the whole
 * certified platform feels like one product. All navigation resolves inside the
 * shell; no cross-prototype chrome jumps.
 */
export function TerminalShell({ locale, children }: { locale: string; children: ReactNode }) {
  const [light, setLight] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [tenant, setTenant] = useState(TENANTS[0]);
  const [tenantOpen, setTenantOpen] = useState(false);
  const [role, setRole] = useState(ROLES[0]);
  const [roleOpen, setRoleOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({ telemetry: true, community: true, export: true });
  const fr = locale !== 'en';
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem('apa-terminal-theme') === 'light') setLight(true);
  }, []);
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('apa-terminal-theme', light ? 'light' : 'dark');
  }, [light]);
  useEffect(() => { setNavOpen(false); }, [pathname]);

  const active = (href: string) =>
    href === '/certify-v2' || href === '/platform'
      ? pathname === href
      : pathname === href || pathname.startsWith(href + '/');

  return (
    <div className={`apa-terminal ${light ? 'light' : ''} flex min-h-screen flex-col`}>
      {/* ══ Executive header — one row ══ */}
      <header className="sticky top-0 z-50 border-b border-[var(--t-line)] backdrop-blur-xl"
        style={{ background: 'color-mix(in srgb, var(--t-bg) 84%, transparent)' }}>
        <div className="flex items-center gap-3 px-3 py-2.5 sm:px-4">
          <button onClick={() => setNavOpen((v) => !v)} className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--t-line)] lg:hidden" aria-label="Toggle navigation">☰</button>

          <Link href="/platform" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg t-glow-amber t-amber text-lg font-black">⛨</span>
            <span className="hidden leading-none sm:flex sm:flex-col">
              <span className="t-display text-sm font-extrabold tracking-tight">APA <span className="t-muted font-semibold">Certification</span></span>
              <span className="t-mono text-[9px] uppercase tracking-[0.22em] t-amber">Sovereign Platform</span>
            </span>
          </Link>
          <span className="t-chip t-chip-emerald hidden xl:inline-flex">
            <span className="t-live-dot" /> SYSTEM_ONLINE_ZKP_VERIFIED
          </span>

          {/* Tenant / country context */}
          <div className="relative ml-1">
            <button onClick={() => { setTenantOpen((v) => !v); setRoleOpen(false); }} className="flex items-center gap-2 rounded-lg border border-[var(--t-line)] px-2.5 py-1.5 text-xs hover:border-[var(--t-line-strong)]">
              <span className="t-faint hidden sm:inline">{fr ? 'Locataire :' : 'Tenant:'}</span>
              <span className="font-semibold">{tenant.label}</span>
              <span>{tenant.flag}</span>
              <span className="t-faint">▾</span>
            </button>
            {tenantOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 w-60 rounded-xl border border-[var(--t-line-strong)] p-1 shadow-2xl" style={{ background: 'var(--t-panel-solid)' }}>
                {TENANTS.map((tn) => (
                  <button key={tn.id} onClick={() => { setTenant(tn); setTenantOpen(false); }}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs hover:bg-[var(--t-amber-soft)] ${tn.id === tenant.id ? 't-amber' : ''}`}>
                    <span>{tn.flag}</span><span className="font-semibold">{tn.label}</span>
                    <span className="t-faint ml-auto">{tn.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Live value compression ticker */}
          <div className="ml-auto hidden items-center gap-4 rounded-lg border border-[var(--t-line)] px-3 py-1.5 xl:flex">
            <Ticker label={fr ? 'Pénalité risque' : 'Risk penalty'} value="−350 bps" tone="emerald" />
            <span className="h-4 w-px bg-[var(--t-line)]" />
            <Ticker label={fr ? 'Uplift valo.' : 'Valuation'} value="+$2.5M" tone="amber" />
            <span className="h-4 w-px bg-[var(--t-line)]" />
            <Ticker label="σ" value="0.024" tone="emerald" />
          </div>

          {/* Quick actions */}
          <a href={`/${locale}/verify/APA-2026-SN-000001/certificate`} target="_blank" rel="noopener noreferrer" className="t-btn t-btn-ghost ml-auto hidden text-xs lg:inline-flex xl:ml-0">⇩ {fr ? 'Audit Shield PDF' : 'Audit Shield PDF'}</a>

          {/* Role switcher */}
          <div className="relative hidden sm:block">
            <button onClick={() => { setRoleOpen((v) => !v); setTenantOpen(false); }} className="flex items-center gap-1.5 rounded-lg border border-[var(--t-line)] px-2.5 py-1.5 text-xs hover:border-[var(--t-line-strong)]">
              <span className="t-faint hidden md:inline">{fr ? 'Rôle :' : 'Role:'}</span>
              <span className="font-semibold">{fr ? role.fr : role.en}</span>
              <span className="t-faint">▾</span>
            </button>
            {roleOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-xl border border-[var(--t-line-strong)] p-1 shadow-2xl" style={{ background: 'var(--t-panel-solid)' }}>
                {ROLES.map((r) => (
                  <button key={r.id} onClick={() => { setRole(r); setRoleOpen(false); }}
                    className={`flex w-full rounded-lg px-2.5 py-2 text-left text-xs hover:bg-[var(--t-amber-soft)] ${r.id === role.id ? 't-amber' : ''}`}>
                    {fr ? r.fr : r.en}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Locale + theme */}
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-0.5 rounded-lg border border-[var(--t-line)] p-0.5 text-xs sm:flex">
              <Link href={pathname} locale="en" className={`rounded px-2 py-1 ${!fr ? 't-amber font-bold' : 't-muted'}`}>EN</Link>
              <Link href={pathname} locale="fr" className={`rounded px-2 py-1 ${fr ? 't-amber font-bold' : 't-muted'}`}>FR</Link>
            </div>
            <button onClick={() => setLight((v) => !v)} aria-label="Toggle theme" className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--t-line)] text-sm hover:border-[var(--t-line-strong)]">{light ? '☾' : '☀'}</button>
          </div>
        </div>

        {/* Slim identity strip */}
        <div className="flex items-center gap-3 border-t border-[var(--t-line)] px-3 py-1.5 text-[11px] sm:px-4">
          <span className="t-mono t-faint">{fr ? 'Plateforme de Certification Unifiée' : 'Unified Certification Platform'}</span>
          <span className="t-chip t-chip-emerald xl:hidden"><span className="t-live-dot" /> ZKP</span>
          <span className="t-mono ml-auto flex gap-3 xl:hidden">
            <span className="t-emerald">−350bps</span><span className="t-amber">+$2.5M</span><span className="t-emerald">σ0.024</span>
          </span>
        </div>
      </header>

      {/* ══ Body: Control-Tower sidebar + main ══ */}
      <div className="flex flex-1">
        <aside className={`${navOpen ? 'fixed inset-y-0 left-0 z-40 w-72 translate-x-0 pt-[92px]' : 'fixed -translate-x-full'} lg:sticky lg:top-[86px] lg:h-[calc(100vh-86px)] lg:w-72 lg:translate-x-0 lg:pt-0 shrink-0 overflow-y-auto border-r border-[var(--t-line)] px-3 py-4 transition-transform`}
          style={{ background: 'color-mix(in srgb, var(--t-bg) 94%, transparent)' }}>
          <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] t-faint">{fr ? 'Tour de Contrôle' : 'Control Tower'}</p>
          {CONTROL_TOWER.map((g) => {
            const isCollapsed = collapsed[g.id];
            return (
              <div key={g.id} className="mb-1">
                <button onClick={() => setCollapsed((c) => ({ ...c, [g.id]: !c[g.id] }))}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[11px] font-bold uppercase tracking-wider t-muted hover:text-[var(--t-text)]">
                  <span className="t-amber">{g.glyph}</span>
                  <span className="flex-1">{fr ? g.titleFr : g.titleEn}</span>
                  <span className="t-faint transition-transform" style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'none' }}>▾</span>
                </button>
                {!isCollapsed && (
                  <div className="mb-2 space-y-0.5">
                    {g.items.map((it) => (
                      <Link key={it.slug} href={it.href}
                        className={`block rounded-lg px-2 py-1.5 pl-4 text-xs transition-colors ${active(it.href) ? 't-amber' : 't-muted hover:text-[var(--t-text)]'}`}
                        style={active(it.href) ? { background: 'var(--t-amber-soft)' } : undefined}>
                        <span className="flex items-center gap-1.5">
                          <span className="opacity-70">{it.glyph}</span>
                          <span className="font-semibold leading-tight">{fr ? it.titleFr : it.titleEn}</span>
                        </span>
                        <span className="mt-0.5 block pl-5 text-[10px] t-faint">{fr ? it.subFr : it.subEn}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </aside>
        {navOpen && <div onClick={() => setNavOpen(false)} className="fixed inset-0 z-30 bg-black/50 lg:hidden" />}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>

      {/* ══ Footer control bar ══ */}
      <footer className="border-t border-[var(--t-line)] px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] t-faint">
          <span className="t-mono t-muted">APA Senegal SARL — {fr ? 'Siège de Dakar' : 'Dakar HQ'}</span>
          <span>{fr ? 'Conforme ZKP & cadre de données GDPR / UA' : 'Zero-Knowledge Proof (ZKP) & GDPR / AU Data Framework Compliant'}</span>
          <span className="ml-auto flex items-center gap-2 t-mono">
            <span className="t-live-dot" />
            {['D.C.', 'London', 'Paris', 'Dubai', 'NY'].map((h) => <span key={h}>{h}</span>)}
          </span>
        </div>
      </footer>
    </div>
  );
}

function Ticker({ label, value, tone }: { label: string; value: string; tone: 'amber' | 'emerald' }) {
  return (
    <span className="flex flex-col leading-none">
      <span className="text-[9px] uppercase tracking-widest t-faint">{label}</span>
      <span className={`t-mono text-xs font-bold ${tone === 'emerald' ? 't-emerald' : 't-amber'}`}>{value}</span>
    </span>
  );
}
