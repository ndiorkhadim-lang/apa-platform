'use client';

import { useMemo, useState } from 'react';
import {
  GLOSSARY_CATEGORIES,
  type GlossaryCategory,
  type GlossaryTerm,
} from '@/domain/glossary/terms';

export function GlossaryExplorer({ locale, terms }: { locale: string; terms: GlossaryTerm[] }) {
  const fr = locale !== 'en';
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<GlossaryCategory | 'ALL'>('ALL');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return terms
      .filter((t) => (cat === 'ALL' ? true : t.category === cat))
      .filter((t) => {
        if (!q) return true;
        const hay = `${t.term} ${t.termFr ?? ''} ${fr ? t.defFr : t.defEn}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [terms, query, cat, fr]);

  const catLabel = (id: GlossaryCategory) => {
    const c = GLOSSARY_CATEGORIES.find((x) => x.id === id);
    return c ? (fr ? c.fr : c.en) : id;
  };

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={fr ? 'Rechercher un concept, une définition…' : 'Search a concept, a definition…'}
          className="min-w-[220px] flex-1 rounded-lg border border-[var(--t-line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--t-line-strong)]"
          style={{ background: 'var(--t-panel)' }}
          aria-label={fr ? 'Rechercher' : 'Search'}
        />
        <button
          onClick={() => window.print()}
          className="t-btn t-btn-ghost text-xs"
          aria-label={fr ? 'Télécharger en PDF' : 'Download as PDF'}
        >
          ⇩ {fr ? 'Télécharger le PDF' : 'Download PDF'}
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 print:hidden">
        <FilterChip active={cat === 'ALL'} onClick={() => setCat('ALL')}>
          {fr ? 'Tout' : 'All'} · {terms.length}
        </FilterChip>
        {GLOSSARY_CATEGORIES.map((c) => (
          <FilterChip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
            <span className="t-amber">{c.glyph}</span> {fr ? c.fr : c.en}
          </FilterChip>
        ))}
      </div>

      <p className="t-mono text-xs t-faint print:hidden">
        {filtered.length} {fr ? 'termes' : 'terms'}
      </p>

      {/* Term list */}
      <dl className="grid gap-3 sm:grid-cols-2">
        {filtered.map((t) => (
          <div key={t.id} id={t.id} className="t-glass rounded-2xl p-4">
            <div className="flex items-start justify-between gap-2">
              <dt className="t-display text-sm font-bold">{fr && t.termFr ? t.termFr : t.term}</dt>
              <span className="t-chip shrink-0 text-[10px]">{catLabel(t.category)}</span>
            </div>
            <dd className="mt-2 text-xs leading-relaxed t-muted">{fr ? t.defFr : t.defEn}</dd>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {t.volume && <span className="t-mono text-[10px] t-faint">{t.volume}</span>}
              {t.tools?.map((n) => (
                <span key={n} className="t-mono rounded px-1.5 py-0.5 text-[10px] t-amber" style={{ background: 'var(--t-amber-soft)' }}>
                  #{n}
                </span>
              ))}
            </div>
          </div>
        ))}
      </dl>

      {filtered.length === 0 && (
        <p className="t-muted rounded-2xl border border-[var(--t-line)] p-6 text-center text-sm">
          {fr ? 'Aucun terme ne correspond à votre recherche.' : 'No term matches your search.'}
        </p>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
        active ? 't-amber border-[var(--t-line-strong)]' : 't-muted border-[var(--t-line)] hover:text-[var(--t-text)]'
      }`}
      style={active ? { background: 'var(--t-amber-soft)' } : undefined}
    >
      {children}
    </button>
  );
}
