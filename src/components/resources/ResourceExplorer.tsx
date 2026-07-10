'use client';

import { useMemo, useState } from 'react';
import type { Resource, ResourceFilters } from '@/types/resource';
import {
  DEFAULT_RESOURCE_FILTERS, RESOURCE_TYPES, INDUSTRIES, GOVERNANCE_DOMAINS,
  RESOURCE_LANGUAGES, SORT_OPTIONS, SOLUTION_LABEL,
} from '@/types/resource';
import { PRIORITY_COUNTRIES } from '@/types/journey';
import { ResourceCard } from './ResourceCard';

/** Lightweight semantic-ish scoring: token overlap across the full corpus text. */
function searchScore(r: Resource, q: string): number {
  if (!q) return 1;
  const hay = [
    r.title, r.executiveSummary, r.type, r.author, r.authorTitle,
    ...r.domains, ...r.industries, ...r.countries,
    ...r.relatedFrameworks.map((f) => `pillar ${f} framework`),
    ...r.relatedSolutions.map((s) => SOLUTION_LABEL[s] ?? s),
    ...r.relatedJourneys, ...r.relatedCertifications,
    ...r.keyInsights, new Date(r.publishedAt).getFullYear().toString(), r.language,
  ].join(' ').toLowerCase();
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  const hits = tokens.filter((t) => hay.includes(t)).length;
  return hits / Math.max(1, tokens.length);
}

const YEARS = [2026, 2025, 2024];

export function ResourceExplorer({ resources }: { resources: Resource[] }) {
  const [filters, setFilters] = useState<ResourceFilters>(DEFAULT_RESOURCE_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const set = (p: Partial<ResourceFilters>) => setFilters((f) => ({ ...f, ...p }));

  const filtered = useMemo(() => {
    const withScore = resources
      .map((r) => ({ r, score: searchScore(r, filters.search.trim()) }))
      .filter(({ r, score }) => {
        if (filters.search.trim() && score === 0) return false;
        if (filters.type !== 'ALL' && r.type !== filters.type) return false;
        if (filters.industry !== 'ALL' && !r.industries.includes(filters.industry)) return false;
        if (filters.domain !== 'ALL' && !r.domains.includes(filters.domain)) return false;
        if (filters.country !== 'ALL' && !r.countries.includes(filters.country) && !r.countries.includes('Pan-African')) return false;
        if (filters.language !== 'ALL' && r.language !== filters.language && !r.otherLanguages.includes(filters.language)) return false;
        if (filters.year !== 'ALL' && new Date(r.publishedAt).getFullYear() !== filters.year) return false;
        return true;
      });

    const sorted = [...withScore].sort((a, b) => {
      if (filters.search.trim() && a.score !== b.score) return b.score - a.score;
      switch (filters.sort) {
        case 'Most Popular': return b.r.views - a.r.views;
        case 'Most Downloaded': return b.r.downloads - a.r.downloads;
        case "Editor's Choice": return Number(b.r.featured) - Number(a.r.featured) || b.r.rating - a.r.rating;
        case 'Recently Updated': return b.r.updatedAt.localeCompare(a.r.updatedAt);
        case 'Newest': default: return b.r.publishedAt.localeCompare(a.r.publishedAt);
      }
    });
    return sorted.map((x) => x.r);
  }, [resources, filters]);

  const activeCount = [
    filters.type, filters.industry, filters.domain, filters.country, filters.language,
    filters.year === 'ALL' ? 'ALL' : String(filters.year),
  ].filter((v) => v !== 'ALL').length;

  const sel = 'w-full rounded-md border border-apa-line bg-white px-3 py-2 text-sm text-apa-ink focus:border-apa-green focus:outline-none';

  return (
    <div>
      {/* Search bar */}
      <div className="rounded-apa-lg border border-apa-line bg-white p-2 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="pl-2 text-apa-grey" aria-hidden>🔎</span>
          <input
            type="search"
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Search by title, keyword, framework, solution, country, author, year…"
            className="min-w-0 flex-1 bg-transparent py-2 text-sm text-apa-ink outline-none"
            aria-label="Search the knowledge library"
          />
          <button
            type="button"
            onClick={() => setShowFilters((s) => !s)}
            className="flex shrink-0 items-center gap-1.5 rounded-md border border-apa-line px-3 py-2 text-sm font-semibold text-apa-navy hover:border-apa-green"
          >
            ⚙ Filters{activeCount ? <span className="rounded-full bg-apa-green px-1.5 text-[10px] text-white">{activeCount}</span> : null}
          </button>
        </div>
        <p className="px-2 pb-1 pt-1 text-[11px] text-apa-grey">AI semantic search across the APA corpus — ranked by relevance.</p>
      </div>

      {/* Advanced filters */}
      {showFilters ? (
        <div className="mt-3 grid gap-3 rounded-apa-lg border border-apa-line bg-apa-soft p-4 sm:grid-cols-2 lg:grid-cols-3">
          <Label text="Resource type">
            <select className={sel} value={filters.type} onChange={(e) => set({ type: e.target.value as ResourceFilters['type'] })}>
              <option value="ALL">All types</option>
              {RESOURCE_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Label>
          <Label text="Industry">
            <select className={sel} value={filters.industry} onChange={(e) => set({ industry: e.target.value as ResourceFilters['industry'] })}>
              <option value="ALL">All industries</option>
              {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
            </select>
          </Label>
          <Label text="Governance domain">
            <select className={sel} value={filters.domain} onChange={(e) => set({ domain: e.target.value as ResourceFilters['domain'] })}>
              <option value="ALL">All domains</option>
              {GOVERNANCE_DOMAINS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </Label>
          <Label text="Country">
            <select className={sel} value={filters.country} onChange={(e) => set({ country: e.target.value })}>
              <option value="ALL">All countries</option>
              <option value="Pan-African">Pan-African</option>
              {PRIORITY_COUNTRIES.map((c) => <option key={c.code} value={c.name}>{c.flag} {c.name}</option>)}
            </select>
          </Label>
          <Label text="Language">
            <select className={sel} value={filters.language} onChange={(e) => set({ language: e.target.value as ResourceFilters['language'] })}>
              <option value="ALL">All languages</option>
              {RESOURCE_LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </Label>
          <Label text="Publication year">
            <select className={sel} value={String(filters.year)} onChange={(e) => set({ year: e.target.value === 'ALL' ? 'ALL' : Number(e.target.value) })}>
              <option value="ALL">All years</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </Label>
          <div className="sm:col-span-2 lg:col-span-3">
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_RESOURCE_FILTERS)}
              className="text-sm font-semibold text-apa-grey hover:text-apa-green"
            >
              Reset all filters
            </button>
          </div>
        </div>
      ) : null}

      {/* Result bar + sort */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-apa-grey">
          {filtered.length} {filtered.length === 1 ? 'resource' : 'resources'}
        </p>
        <label className="flex items-center gap-2 text-xs font-bold uppercase text-apa-grey">
          Sort
          <select className="rounded-md border border-apa-line bg-white px-2 py-1.5 text-sm normal-case text-apa-ink" value={filters.sort} onChange={(e) => set({ sort: e.target.value as ResourceFilters['sort'] })}>
            {SORT_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="apa-box mt-4 p-8 text-center text-sm text-apa-grey">
          No resources match your search. Try fewer filters or ask the AI Knowledge Assistant below.
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r, i) => (
            <div key={r.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
              <ResourceCard resource={r} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-[11px] font-bold uppercase text-apa-grey">
      {text}
      <span className="font-normal normal-case">{children}</span>
    </label>
  );
}
