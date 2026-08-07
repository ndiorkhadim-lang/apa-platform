'use client';

import { useMemo, useState } from 'react';

export type TagOption = { value: string; label: string };

function toOptions(options: readonly (string | TagOption)[]): TagOption[] {
  return options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
}

type Props = {
  label: string;
  options: readonly (string | TagOption)[];
  value: string[];
  onChange: (next: string[]) => void;
  multi?: boolean;
  required?: boolean;
  hint?: string;
  searchable?: boolean;
  allowCustom?: boolean;
  max?: number;
  columns?: boolean; // dense grid layout for long lists
};

/**
 * Premium chip / tag selector — single or multi-select, optional search and
 * free-text add. Selected chips fill APA green; the rest are outlined pills.
 * Used across the Journey Partner wizard in place of native dropdowns.
 */
export function TagField({
  label, options, value, onChange, multi = true, required, hint,
  searchable, allowCustom, max, columns,
}: Props) {
  const [query, setQuery] = useState('');
  const [custom, setCustom] = useState('');
  const opts = useMemo(() => toOptions(options), [options]);

  const filtered = useMemo(() => {
    if (!query.trim()) return opts;
    const q = query.toLowerCase();
    return opts.filter((o) => o.label.toLowerCase().includes(q));
  }, [opts, query]);

  // Selected custom values not present in the option list.
  const extraSelected = value.filter((v) => !opts.some((o) => o.value === v));

  function toggle(v: string) {
    if (value.includes(v)) {
      onChange(value.filter((x) => x !== v));
      return;
    }
    if (multi) {
      if (max && value.length >= max) return;
      onChange([...value, v]);
    } else {
      onChange([v]);
    }
  }

  function addCustom() {
    const v = custom.trim();
    if (!v) return;
    if (!value.includes(v)) onChange(multi ? [...value, v] : [v]);
    setCustom('');
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-sm font-semibold text-apa-navy">
          {label}{required ? <span className="text-red-600"> *</span> : null}
        </label>
        {multi && value.length > 0 ? (
          <span className="text-[11px] font-semibold text-apa-grey">{value.length} selected{max ? ` / ${max}` : ''}</span>
        ) : null}
      </div>
      {hint ? <p className="mt-0.5 text-xs text-apa-grey">{hint}</p> : null}

      {searchable ? (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${label.toLowerCase()}…`}
          className="mt-2 w-full rounded-md border border-apa-line bg-white px-3 py-2 text-sm outline-none focus:border-apa-green focus:ring-1 focus:ring-apa-green"
        />
      ) : null}

      <div className={`mt-2 flex flex-wrap gap-2 ${searchable ? 'max-h-56 overflow-y-auto rounded-md border border-apa-line bg-apa-soft/40 p-2.5' : ''}`}>
        {filtered.map((o) => {
          const on = value.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(o.value)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-semibold transition ${
                on
                  ? 'border-apa-green bg-apa-green text-white shadow-sm'
                  : 'border-apa-line bg-white text-apa-navy hover:border-apa-green hover:text-apa-green'
              }`}
            >
              {on ? <span aria-hidden>✓</span> : null}
              {o.label}
            </button>
          );
        })}
        {/* custom-added chips rendered as selected */}
        {extraSelected.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => toggle(v)}
            className="inline-flex items-center gap-1.5 rounded-full border border-apa-gold bg-apa-gold/15 px-3 py-1.5 text-[13px] font-semibold text-apa-ink"
          >
            ✓ {v} <span aria-hidden className="text-apa-grey">×</span>
          </button>
        ))}
        {searchable && filtered.length === 0 ? (
          <span className="px-1 py-1 text-xs text-apa-grey">No match{allowCustom ? ' — add it below.' : '.'}</span>
        ) : null}
      </div>

      {allowCustom ? (
        <div className="mt-2 flex gap-2">
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } }}
            placeholder="Add your own…"
            className="flex-1 rounded-md border border-apa-line bg-white px-3 py-2 text-sm outline-none focus:border-apa-green focus:ring-1 focus:ring-apa-green"
          />
          <button type="button" onClick={addCustom} className="rounded-md border border-apa-green px-3 py-2 text-sm font-semibold text-apa-green hover:bg-apa-green hover:text-white">
            Add
          </button>
        </div>
      ) : null}
      {columns ? null : null}
    </div>
  );
}
