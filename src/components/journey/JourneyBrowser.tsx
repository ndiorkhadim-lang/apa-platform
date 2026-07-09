'use client';

import { useMemo, useState } from 'react';
import type { Journey, JourneyFilters, JourneyUserType } from '@/types/journey';
import { PRIORITY_COUNTRIES } from '@/types/journey';
import { JourneyFilterBar } from './JourneyFilterBar';
import { JourneyCard } from './JourneyCard';
import { SubmitActivityForm } from './SubmitActivityForm';

const DEFAULT_FILTERS: JourneyFilters = {
  role: 'ALL',
  country: 'ALL',
  region: 'ALL',
  difficulty: 'ALL',
  theme: 'ALL',
  maxPrice: null,
  search: '',
};

const COUNTRY_REGION = new Map(PRIORITY_COUNTRIES.map((c) => [c.name, c.region]));

export function JourneyBrowser({
  journeys,
  role,
  currentUserId,
  initialTab = 'browse',
}: {
  journeys: Journey[];
  role: JourneyUserType;
  currentUserId?: string;
  initialTab?: 'browse' | 'submit';
}) {
  const isPartner = role === 'partner_business';
  const [tab, setTab] = useState<'browse' | 'submit'>(
    initialTab === 'submit' && isPartner ? 'submit' : 'browse'
  );
  const [filters, setFilters] = useState<JourneyFilters>(DEFAULT_FILTERS);

  const themes = useMemo(() => [...new Set(journeys.flatMap((j) => j.themes))].sort(), [journeys]);
  const priceMax = useMemo(() => Math.max(...journeys.map((j) => j.priceUSD), 7000), [journeys]);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return journeys.filter((j) => {
      if (filters.role !== 'ALL' && j.roleFilter !== filters.role) return false;
      if (filters.region !== 'ALL' && COUNTRY_REGION.get(j.country) !== filters.region) return false;
      if (filters.country !== 'ALL' && j.country !== filters.country) return false;
      if (filters.difficulty !== 'ALL' && j.difficulty !== filters.difficulty) return false;
      if (filters.theme !== 'ALL' && !j.themes.includes(filters.theme)) return false;
      if (filters.maxPrice != null && j.priceUSD > filters.maxPrice) return false;
      if (
        q &&
        !`${j.title} ${j.country} ${j.cityRegion} ${j.themes.join(' ')}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [journeys, filters]);

  return (
    <div>
      {/* Tabs: Browse / Submit (partner only) */}
      {isPartner ? (
        <div className="mb-6 flex gap-2">
          <button
            type="button"
            onClick={() => setTab('browse')}
            className={`rounded-md px-4 py-2 text-sm font-bold transition-colors ${
              tab === 'browse' ? 'bg-apa-green text-white' : 'border border-apa-line bg-white text-apa-navy'
            }`}
          >
            Browse Journeys
          </button>
          <button
            type="button"
            onClick={() => setTab('submit')}
            className={`rounded-md px-4 py-2 text-sm font-bold transition-colors ${
              tab === 'submit' ? 'apa-gradient text-white' : 'border border-apa-gold bg-white text-apa-navy'
            }`}
          >
            ✦ Submit an Activity
          </button>
        </div>
      ) : null}

      {tab === 'submit' && isPartner ? (
        <SubmitActivityForm />
      ) : (
        <>
          <JourneyFilterBar
            filters={filters}
            onChange={(next) => setFilters((f) => ({ ...f, ...next }))}
            themes={themes}
            priceMax={priceMax}
          />

          <p className="mt-4 text-sm font-semibold text-apa-grey">
            {filtered.length} {filtered.length === 1 ? 'journey' : 'journeys'}
          </p>

          {filtered.length === 0 ? (
            <div className="apa-box mt-4 p-8 text-center text-sm text-apa-grey">
              No journeys match your filters. Try widening the criteria.
            </div>
          ) : (
            <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((j, i) => (
                <div key={j.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <JourneyCard journey={j} role={role} isOwner={j.ownerId === currentUserId} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
