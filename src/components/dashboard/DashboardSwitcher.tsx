'use client';

import { useState } from 'react';

/**
 * Demo Dashboard Switcher — lets an administrator instantly preview any role's
 * dashboard (?as=<id>) with realistic sample data, without creating accounts.
 * Rendered only when enabled (demo mode or admin). Easy to disable: the parent
 * passes `enabled=false` and it renders nothing.
 */
export interface SwitchItem { id: string; label: string; icon: string; group: string }

export function DashboardSwitcher({
  items,
  currentId,
  locale,
  enabled,
}: {
  items: SwitchItem[];
  currentId: string;
  locale: string;
  enabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const fr = locale !== 'en';
  if (!enabled) return null;

  // Group items preserving order.
  const groups: { name: string; items: SwitchItem[] }[] = [];
  for (const it of items) {
    let g = groups.find((x) => x.name === it.group);
    if (!g) { g = { name: it.group, items: [] }; groups.push(g); }
    g.items.push(it);
  }

  return (
    <>
      {/* Floating trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full apa-gradient px-4 py-3 text-sm font-bold text-white shadow-xl transition-transform hover:scale-105"
        aria-expanded={open}
      >
        <span aria-hidden>🎭</span>
        <span className="hidden sm:inline">{fr ? 'Aperçu du tableau de bord' : 'Preview Dashboard As'}</span>
        <span className="sm:hidden">{fr ? 'Aperçu' : 'Preview'}</span>
      </button>

      {open ? (
        <>
          <div className="fixed inset-0 z-50 bg-black/20" onClick={() => setOpen(false)} aria-hidden />
          <div className="fixed bottom-20 right-5 z-50 max-h-[70vh] w-80 overflow-y-auto rounded-apa-lg border border-apa-line bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-apa-navy">{fr ? 'Prévisualiser en tant que' : 'Preview Dashboard As'}</div>
                <div className="text-[11px] text-apa-grey">{fr ? 'Démo — chargement instantané, données d’exemple' : 'Demo — instant load, sample data'}</div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-md px-2 py-1 text-apa-grey hover:bg-apa-soft" aria-label="Close">✕</button>
            </div>
            {groups.map((g) => (
              <div key={g.name} className="mb-3">
                <div className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-wide text-apa-grey">{g.name}</div>
                <div className="grid gap-1">
                  {g.items.map((it) => {
                    const active = it.id === currentId;
                    return (
                      <a
                        key={it.id}
                        href={`/${locale}/app?as=${it.id}`}
                        className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-semibold transition-colors ${
                          active ? 'bg-apa-green text-white' : 'text-apa-navy hover:bg-apa-soft'
                        }`}
                      >
                        <span aria-hidden>{it.icon}</span>
                        <span className="min-w-0 flex-1 truncate">{it.label}</span>
                        {active ? <span className="text-[10px]">●</span> : null}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
            <a href={`/${locale}/app`} className="mt-1 block rounded-lg border border-apa-line px-3 py-2 text-center text-xs font-semibold text-apa-grey hover:border-apa-green">
              {fr ? 'Réinitialiser (mon profil)' : 'Reset to my profile'}
            </a>
          </div>
        </>
      ) : null}
    </>
  );
}
