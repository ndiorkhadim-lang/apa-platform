'use client';

import { useState, useTransition } from 'react';
import { useRouter } from '@/i18n/navigation';
import { PRIORITY_COUNTRIES, ROLE_ORDER, ROLE_META, THEMES } from '@/types/journey';
import { submitJourneyProposal } from '@/app/[locale]/(app)/journeys/partner/actions';

/** Journey Partner — submit a new journey proposal (enters APA review). */
export function ProposalForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();

  const inp = 'w-full rounded-md border border-apa-line px-3 py-2 text-sm focus:border-apa-green focus:outline-none';

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    start(async () => {
      try {
        await submitJourneyProposal(locale, fd);
        setDone(true);
        setOpen(false);
        router.refresh();
      } catch {
        setError('Could not submit. Check the required fields (summary ≥ 120 characters) and try again.');
      }
    });
  }

  if (!open) {
    return (
      <div>
        {done ? (
          <p className="mb-3 rounded-apa border border-apa-green bg-apa-green/5 px-4 py-2 text-sm font-semibold text-apa-green">
            ✓ Proposal submitted — it has entered APA review. You’ll see its status update below.
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => { setOpen(true); setDone(false); }}
          className="rounded-md bg-apa-green px-5 py-2.5 text-sm font-bold text-white hover:bg-apa-green-mid"
        >
          ＋ Submit a Journey Proposal
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-apa-lg border border-apa-line bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-apa-navy">New Journey Proposal</h3>
      <div className="apa-rule my-3" />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-[11px] font-bold uppercase text-apa-grey">Journey title *
          <input name="title" required minLength={4} className={inp} placeholder="e.g. Nigeria Governance Immersion" />
        </label>
        <label className="text-[11px] font-bold uppercase text-apa-grey">Role tier *
          <select name="roleTier" required className={inp} defaultValue="OBSERVER">
            {ROLE_ORDER.map((r) => <option key={r} value={r}>{ROLE_META[r].label}</option>)}
          </select>
        </label>
        <label className="text-[11px] font-bold uppercase text-apa-grey">Country *
          <select name="country" required className={inp} defaultValue="">
            <option value="" disabled>Select a country</option>
            {PRIORITY_COUNTRIES.map((c) => <option key={c.code} value={c.name}>{c.flag} {c.name}</option>)}
          </select>
        </label>
        <label className="text-[11px] font-bold uppercase text-apa-grey">Region
          <input name="region" className={inp} placeholder="West / East / …" />
        </label>
        <label className="text-[11px] font-bold uppercase text-apa-grey">Duration (days)
          <input name="durationDays" type="number" min={1} max={60} className={inp} defaultValue={5} />
        </label>
        <label className="text-[11px] font-bold uppercase text-apa-grey">Price (USD)
          <input name="priceUSD" type="number" min={0} step={100} className={inp} defaultValue={3000} />
        </label>
      </div>
      <label className="mt-4 block text-[11px] font-bold uppercase text-apa-grey">Themes (comma-separated)
        <input name="themes" className={inp} placeholder={THEMES.slice(0, 3).join(', ')} />
      </label>
      <label className="mt-4 block text-[11px] font-bold uppercase text-apa-grey">Summary * (min 120 characters)
        <textarea name="summary" required minLength={120} className={`${inp} min-h-28`} placeholder="Describe the journey: purpose, itinerary, community interface, expected outcomes…" />
      </label>

      {error ? <p className="mt-3 text-sm font-semibold text-apa-bronze">{error}</p> : null}

      <div className="mt-5 flex items-center gap-3">
        <button type="button" onClick={() => setOpen(false)} className="text-sm font-semibold text-apa-grey hover:text-apa-green">Cancel</button>
        <button type="submit" disabled={pending} className="ml-auto rounded-md bg-apa-green px-6 py-2.5 text-sm font-bold text-white hover:bg-apa-green-mid disabled:opacity-60">
          {pending ? 'Submitting…' : 'Submit for review'}
        </button>
      </div>
      <p className="mt-2 text-xs text-apa-grey">Proposals are never auto-published — an APA administrator reviews and approves before publication.</p>
    </form>
  );
}
