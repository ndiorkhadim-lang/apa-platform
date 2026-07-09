'use client';

import { useMemo } from 'react';
import type { JourneyFilters, RoleFilter } from '@/types/journey';
import { ROLE_META, ROLE_ORDER, DIFFICULTIES, PRIORITY_COUNTRIES, REGIONS } from '@/types/journey';

const ROLE_TABS: (RoleFilter | 'ALL')[] = ['ALL', ...ROLE_ORDER];

export function JourneyFilterBar({
  filters,
  onChange,
  themes,
  priceMax,
}: {
  filters: JourneyFilters;
  onChange: (next: Partial<JourneyFilters>) => void;
  themes: string[];
  priceMax: number;
}) {
  const select =
    'rounded-md border border-apa-line bg-white px-3 py-2 text-sm text-apa-ink focus:border-apa-green focus:outline-none';

  // Country list is the full 22-nation priority set (scalable), optionally
  // narrowed by the selected region and searchable via the native datalist.
  const countryOptions = useMemo(() => {
    const list =
      filters.region === 'ALL'
        ? PRIORITY_COUNTRIES
        : PRIORITY_COUNTRIES.filter((c) => c.region === filters.region);
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [filters.region]);

  return (
    <div className="rounded-apa-lg border border-apa-line bg-apa-soft p-4">
      {/* Role tabs */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by role">
        {ROLE_TABS.map((r) => {
          const active = filters.role === r;
          const label = r === 'ALL' ? 'All Roles' : ROLE_META[r].label;
          return (
            <button
              key={r}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange({ role: r })}
              title={r === 'ALL' ? 'All journeys' : ROLE_META[r].description}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                active ? 'apa-gradient text-white' : 'border border-apa-line bg-white text-apa-navy hover:border-apa-green'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      {filters.role !== 'ALL' ? (
        <p className="mt-2 text-xs italic text-apa-grey">{ROLE_META[filters.role].description}</p>
      ) : null}

      {/* Complementary filters */}
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-[11px] font-bold uppercase text-apa-grey">
          Search
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search journeys…"
            className={`${select} min-w-48`}
          />
        </label>
        <label className="flex flex-col gap-1 text-[11px] font-bold uppercase text-apa-grey">
          Region
          <select
            value={filters.region}
            onChange={(e) => onChange({ region: e.target.value, country: 'ALL' })}
            className={select}
          >
            <option value="ALL">All regions</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r} Africa</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[11px] font-bold uppercase text-apa-grey">
          Country
          <input
            type="text"
            list="apa-country-list"
            value={filters.country === 'ALL' ? '' : filters.country}
            onChange={(e) => onChange({ country: e.target.value.trim() === '' ? 'ALL' : e.target.value })}
            placeholder="All countries"
            className={`${select} min-w-44`}
          />
          <datalist id="apa-country-list">
            {countryOptions.map((c) => (
              <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
            ))}
          </datalist>
        </label>
        <label className="flex flex-col gap-1 text-[11px] font-bold uppercase text-apa-grey">
          Difficulty
          <select value={filters.difficulty} onChange={(e) => onChange({ difficulty: e.target.value as JourneyFilters['difficulty'] })} className={select}>
            <option value="ALL">All levels</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[11px] font-bold uppercase text-apa-grey">
          Theme
          <select value={filters.theme} onChange={(e) => onChange({ theme: e.target.value as JourneyFilters['theme'] })} className={select}>
            <option value="ALL">All themes</option>
            {themes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="flex min-w-40 flex-1 flex-col gap-1 text-[11px] font-bold uppercase text-apa-grey">
          Max price {filters.maxPrice ? `· $${filters.maxPrice.toLocaleString()}` : ''}
          <input
            type="range"
            min={1000}
            max={priceMax}
            step={500}
            value={filters.maxPrice ?? priceMax}
            onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
            className="accent-apa-green"
          />
        </label>
        <button
          type="button"
          onClick={() =>
            onChange({ role: 'ALL', country: 'ALL', region: 'ALL', difficulty: 'ALL', theme: 'ALL', maxPrice: null, search: '' })
          }
          className="px-2 py-2 text-sm font-medium text-apa-grey hover:text-apa-green"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
