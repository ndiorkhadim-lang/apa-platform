'use client';

import { useState } from 'react';
import type { JourneyAlertPrefs, RoleFilter } from '@/types/journey';
import { PRIORITY_COUNTRIES, REGIONS, ROLE_ORDER, ROLE_META, ACTIVITY_TYPES, DELIVERY_FORMATS } from '@/types/journey';

/**
 * "Notify Me About Future Opportunities" — captures alert preferences.
 * Persists to localStorage today (key: apa.journey.alerts); the same payload
 * shape is push/email-ready for a backend + notification worker.
 */
export function JourneyAlerts({
  defaultCountry = 'ANY',
  defaultRole = 'ANY',
  compact = false,
}: {
  defaultCountry?: string;
  defaultRole?: RoleFilter | 'ANY';
  compact?: boolean;
}) {
  const [prefs, setPrefs] = useState<JourneyAlertPrefs>({
    country: defaultCountry,
    region: 'ANY',
    journeyRole: defaultRole,
    activityType: 'ANY',
    language: 'Both',
    deliveryMode: 'ANY',
    email: '',
  });
  const [saved, setSaved] = useState(false);
  const set = (p: Partial<JourneyAlertPrefs>) => { setPrefs((s) => ({ ...s, ...p })); setSaved(false); };

  function save() {
    if (!prefs.email.trim()) return;
    try {
      const key = 'apa.journey.alerts';
      const prev = JSON.parse(localStorage.getItem(key) || '[]');
      prev.push({ ...prefs, createdAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(prev));
    } catch { /* ignore */ }
    setSaved(true);
  }

  const sel = 'w-full rounded-md border border-apa-line bg-white px-2.5 py-2 text-sm focus:border-apa-green focus:outline-none';

  if (saved) {
    return (
      <div className={`rounded-apa-lg border border-apa-green bg-apa-soft p-5 ${compact ? '' : 'mx-auto max-w-lg'}`}>
        <div className="text-sm font-bold text-apa-green">🔔 You're on the list</div>
        <p className="mt-1 text-sm text-apa-ink">
          We'll notify <strong>{prefs.email}</strong> by email and in your dashboard when a matching opportunity opens.
        </p>
        <button type="button" onClick={() => setSaved(false)} className="mt-2 text-xs font-semibold text-apa-green underline">
          Edit preferences
        </button>
      </div>
    );
  }

  return (
    <div className={`rounded-apa-lg border border-apa-gold bg-white p-5 ${compact ? '' : 'mx-auto max-w-2xl'}`}>
      <h3 className="text-sm font-bold text-apa-navy">🔔 Notify me about future opportunities</h3>
      <p className="mt-1 text-xs text-apa-grey">Tell us what you're looking for and we'll alert you the moment it's scheduled.</p>

      <div className={`mt-4 grid gap-3 ${compact ? '' : 'sm:grid-cols-2'}`}>
        <label className="text-[11px] font-bold uppercase text-apa-grey">Region
          <select className={sel} value={prefs.region} onChange={(e) => set({ region: e.target.value })}>
            <option value="ANY">Any region</option>
            {REGIONS.map((r) => <option key={r} value={r}>{r} Africa</option>)}
          </select>
        </label>
        <label className="text-[11px] font-bold uppercase text-apa-grey">Country
          <select className={sel} value={prefs.country} onChange={(e) => set({ country: e.target.value })}>
            <option value="ANY">Any country</option>
            {PRIORITY_COUNTRIES.map((c) => <option key={c.code} value={c.name}>{c.flag} {c.name}</option>)}
          </select>
        </label>
        <label className="text-[11px] font-bold uppercase text-apa-grey">Journey role
          <select className={sel} value={prefs.journeyRole} onChange={(e) => set({ journeyRole: e.target.value as JourneyAlertPrefs['journeyRole'] })}>
            <option value="ANY">Any role</option>
            {ROLE_ORDER.map((r) => <option key={r} value={r}>{ROLE_META[r].label}</option>)}
          </select>
        </label>
        <label className="text-[11px] font-bold uppercase text-apa-grey">Activity type
          <select className={sel} value={prefs.activityType} onChange={(e) => set({ activityType: e.target.value as JourneyAlertPrefs['activityType'] })}>
            <option value="ANY">Any activity</option>
            {ACTIVITY_TYPES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>
        <label className="text-[11px] font-bold uppercase text-apa-grey">Language
          <select className={sel} value={prefs.language} onChange={(e) => set({ language: e.target.value as JourneyAlertPrefs['language'] })}>
            <option value="Both">English & French</option>
            <option value="English">English</option>
            <option value="French">French</option>
          </select>
        </label>
        <label className="text-[11px] font-bold uppercase text-apa-grey">Delivery mode
          <select className={sel} value={prefs.deliveryMode} onChange={(e) => set({ deliveryMode: e.target.value as JourneyAlertPrefs['deliveryMode'] })}>
            <option value="ANY">Any format</option>
            {DELIVERY_FORMATS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
      </div>

      <label className="mt-3 block text-[11px] font-bold uppercase text-apa-grey">Email *
        <input type="email" className={sel} placeholder="you@organization.org" value={prefs.email} onChange={(e) => set({ email: e.target.value })} />
      </label>

      <button
        type="button"
        onClick={save}
        disabled={!prefs.email.trim()}
        className="mt-4 w-full rounded-md apa-gradient px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
      >
        Notify me
      </button>
    </div>
  );
}
