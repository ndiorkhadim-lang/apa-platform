'use client';

import { useState } from 'react';
import {
  ROLE_META,
  DIFFICULTIES,
  THEMES,
  AUDIENCES,
  type RoleFilter,
  type Difficulty,
} from '@/types/journey';
import { slugify } from '@/data/journeys';

const INCLUDED = ['Accommodation', 'Meals', 'Local Transportation', 'Guides', 'Academic Sessions', 'Certificate'];
const NOT_INCLUDED = ['International Flights', 'Visa', 'Travel Insurance', 'Personal Expenses', 'Gratuities'];
const COUNTRIES = ['🇰🇪 Kenya', '🇸🇳 Senegal', '🇷🇼 Rwanda', '🇬🇭 Ghana', '🇳🇬 Nigeria', '🇲🇦 Morocco', '🇿🇦 South Africa'];

const input =
  'mt-1 w-full rounded-md border border-apa-line bg-white px-3 py-2.5 text-sm focus:border-apa-green focus:outline-none focus:ring-2 focus:ring-apa-green/20';
const errorCls = 'mt-1 text-xs font-semibold text-red-600';

interface ItineraryDayForm {
  title: string;
  description: string;
  accommodation: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}
interface FacilitatorForm { name: string; title: string; bio: string; years: string }
interface FaqForm { question: string; answer: string }
interface TestimonialForm { name: string; organization: string; quote: string }

function Section({ letter, title, children }: { letter: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-apa-lg border border-apa-line bg-white p-6">
      <h3 className="flex items-center gap-3 text-lg font-bold text-apa-green">
        <span className="apa-secnum text-sm">{letter}</span>
        {title}
      </h3>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Repeatable<T>({
  items,
  add,
  remove,
  addLabel,
  min,
  max,
  render,
}: {
  items: T[];
  add: () => void;
  remove: (i: number) => void;
  addLabel: string;
  min: number;
  max: number;
  render: (item: T, i: number) => React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-apa border border-apa-line bg-apa-soft p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-apa-grey">#{i + 1}</span>
            {items.length > min ? (
              <button type="button" onClick={() => remove(i)} className="text-xs font-semibold text-red-600 hover:underline">
                Remove
              </button>
            ) : null}
          </div>
          <div className="mt-2 space-y-2">{render(item, i)}</div>
        </div>
      ))}
      {items.length < max ? (
        <button type="button" onClick={add} className="rounded-md border border-apa-green px-4 py-2 text-sm font-semibold text-apa-green hover:bg-apa-green hover:text-white">
          + {addLabel}
        </button>
      ) : null}
    </div>
  );
}

export function SubmitActivityForm() {
  const [title, setTitle] = useState('');
  const [role, setRole] = useState<RoleFilter>('OBSERVER');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [objectives, setObjectives] = useState<string[]>(['', '']);
  const [themes, setThemes] = useState<string[]>([]);
  const [days, setDays] = useState<ItineraryDayForm[]>([
    { title: '', description: '', accommodation: '', breakfast: false, lunch: false, dinner: false },
  ]);
  const [difficulty, setDifficulty] = useState<Difficulty>('Pioneer');
  const [audiences, setAudiences] = useState<string[]>([]);
  const [price, setPrice] = useState('');
  const [included, setIncluded] = useState<string[]>([]);
  const [notIncluded, setNotIncluded] = useState<string[]>([]);
  const [capacity, setCapacity] = useState('');
  const [facilitators, setFacilitators] = useState<FacilitatorForm[]>([{ name: '', title: '', bio: '', years: '' }]);
  const [faq, setFaq] = useState<FaqForm[]>([{ question: '', answer: '' }, { question: '', answer: '' }]);
  const [testimonials, setTestimonials] = useState<TestimonialForm[]>([]);

  const [errors, setErrors] = useState<string[]>([]);
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  function validate(): string[] {
    const e: string[] = [];
    if (title.trim().length < 4) e.push('Journey title');
    if (!country) e.push('Country');
    if (!city.trim()) e.push('City/Region');
    if (description.trim().length < 500) e.push('Detailed description (min 500 characters)');
    if (objectives.filter((o) => o.trim()).length < 2) e.push('At least 2 objectives');
    if (themes.length === 0) e.push('At least 1 theme');
    if (days.some((d) => !d.title.trim() || !d.description.trim())) e.push('Complete each itinerary day');
    if (audiences.length === 0) e.push('Target audience');
    if (!price || Number(price) <= 0) e.push('Price per person');
    if (included.length === 0) e.push("What's included");
    if (!capacity || Number(capacity) <= 0) e.push('Maximum capacity');
    if (facilitators.some((f) => !f.name.trim() || !f.title.trim() || !f.bio.trim())) e.push('Complete each facilitator');
    if (faq.filter((f) => f.question.trim() && f.answer.trim()).length < 2) e.push('At least 2 FAQ items');
    return e;
  }

  function onSubmit() {
    const e = validate();
    setErrors(e);
    if (e.length === 0) setConfirm(true);
  }

  if (done) {
    return (
      <div className="apa-box p-8 text-center">
        <p className="text-xl font-bold text-apa-green">✓ Journey submitted for review</p>
        <p className="mt-2 text-sm text-apa-ink">
          Your journey <b>{title}</b> has been submitted. The APA team reviews submissions within 5 business
          days; you can track its status from your Partner dashboard.
        </p>
      </div>
    );
  }

  const descOk = description.trim().length >= 500;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-apa-green">Create & Submit a Journey</h2>
        <div className="apa-rule my-3" />
        <p className="text-sm text-apa-grey">
          Design an immersive field experience. Fields marked * are required; your submission is reviewed
          before publication.
        </p>
      </div>

      {/* SECTION A */}
      <Section letter="A" title="Journey Identity">
        <label className="block text-sm font-semibold text-apa-ink">
          Journey title *
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={input} />
          {title ? <span className="mt-1 block text-xs text-apa-grey">Slug: /{slugify(title) || '…'}</span> : null}
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="text-sm font-semibold text-apa-ink">Target role *</span>
            <div className="mt-1 space-y-2">
              {(['OBSERVER', 'PRACTITIONER'] as RoleFilter[]).map((r) => (
                <label key={r} className={`block cursor-pointer rounded-apa border p-3 text-sm ${role === r ? 'border-apa-green bg-apa-soft' : 'border-apa-line'}`}>
                  <input type="radio" name="role" checked={role === r} onChange={() => setRole(r)} className="mr-2 accent-apa-green" />
                  <b>{ROLE_META[r].label}</b>
                  <span className="mt-1 block text-xs text-apa-grey">{ROLE_META[r].description}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-apa-ink">
              Country *
              <select value={country} onChange={(e) => setCountry(e.target.value)} className={input}>
                <option value="" />
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold text-apa-ink">
              City / Region *
              <input value={city} onChange={(e) => setCity(e.target.value)} className={input} />
            </label>
            <p className="text-xs italic text-apa-grey">
              Cover & gallery image upload activates with secure storage; the card uses a brand gradient meanwhile.
            </p>
          </div>
        </div>
      </Section>

      {/* SECTION B */}
      <Section letter="B" title="Detailed Description">
        <label className="block text-sm font-semibold text-apa-ink">
          Detailed description * <span className={descOk ? 'text-apa-green' : 'text-apa-bronze'}>({description.trim().length}/500 min)</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className={input} />
        </label>
        <div>
          <span className="text-sm font-semibold text-apa-ink">Objectives * (2–5)</span>
          <Repeatable
            items={objectives}
            min={2}
            max={5}
            addLabel="Add objective"
            add={() => setObjectives((o) => [...o, ''])}
            remove={(i) => setObjectives((o) => o.filter((_, j) => j !== i))}
            render={(o, i) => (
              <input value={o} onChange={(e) => setObjectives((arr) => arr.map((x, j) => (j === i ? e.target.value : x)))} className={input} placeholder={`Objective ${i + 1}`} />
            )}
          />
        </div>
        <div>
          <span className="text-sm font-semibold text-apa-ink">Themes / tags *</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <button key={t} type="button" onClick={() => toggle(themes, setThemes, t)} className={`rounded-full border px-3 py-1 text-xs font-semibold ${themes.includes(t) ? 'border-apa-green bg-apa-green text-white' : 'border-apa-line text-apa-ink'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* SECTION C */}
      <Section letter="C" title="Itinerary (day by day)">
        <Repeatable
          items={days}
          min={1}
          max={30}
          addLabel="Add day"
          add={() => setDays((d) => [...d, { title: '', description: '', accommodation: '', breakfast: false, lunch: false, dinner: false }])}
          remove={(i) => setDays((d) => d.filter((_, j) => j !== i))}
          render={(d, i) => (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase text-apa-green">Day {i + 1}</p>
              <input value={d.title} onChange={(e) => setDays((arr) => arr.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} className={input} placeholder="Day title (e.g. Arrival & Welcome Dinner)" />
              <textarea value={d.description} onChange={(e) => setDays((arr) => arr.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} rows={2} className={input} placeholder="Activities" />
              <input value={d.accommodation} onChange={(e) => setDays((arr) => arr.map((x, j) => (j === i ? { ...x, accommodation: e.target.value } : x)))} className={input} placeholder="Accommodation" />
              <div className="flex gap-4 text-xs">
                {(['breakfast', 'lunch', 'dinner'] as const).map((m) => (
                  <label key={m} className="flex items-center gap-1 capitalize">
                    <input type="checkbox" checked={d[m]} onChange={(e) => setDays((arr) => arr.map((x, j) => (j === i ? { ...x, [m]: e.target.checked } : x)))} className="accent-apa-green" />
                    {m}
                  </label>
                ))}
              </div>
            </div>
          )}
        />
      </Section>

      {/* SECTION D */}
      <Section letter="D" title="Quick Info">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm font-semibold text-apa-ink">
            Difficulty *
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className={input}>
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-apa-ink">
            Price / person (USD) *
            <input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} className={input} />
          </label>
          <label className="block text-sm font-semibold text-apa-ink">
            Max capacity *
            <input type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} className={input} />
          </label>
        </div>
        <div>
          <span className="text-sm font-semibold text-apa-ink">Target audience *</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {AUDIENCES.map((a) => (
              <button key={a} type="button" onClick={() => toggle(audiences, setAudiences, a)} className={`rounded-full border px-3 py-1 text-xs font-semibold ${audiences.includes(a) ? 'border-apa-green bg-apa-green text-white' : 'border-apa-line text-apa-ink'}`}>{a}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="text-sm font-semibold text-apa-ink">What&apos;s included *</span>
            <div className="mt-2 space-y-1 text-sm">
              {INCLUDED.map((x) => (
                <label key={x} className="flex items-center gap-2"><input type="checkbox" checked={included.includes(x)} onChange={() => toggle(included, setIncluded, x)} className="accent-apa-green" />{x}</label>
              ))}
            </div>
          </div>
          <div>
            <span className="text-sm font-semibold text-apa-ink">What&apos;s NOT included</span>
            <div className="mt-2 space-y-1 text-sm">
              {NOT_INCLUDED.map((x) => (
                <label key={x} className="flex items-center gap-2"><input type="checkbox" checked={notIncluded.includes(x)} onChange={() => toggle(notIncluded, setNotIncluded, x)} className="accent-apa-green" />{x}</label>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* SECTION E */}
      <Section letter="E" title="Facilitators / Experts">
        <Repeatable
          items={facilitators}
          min={1}
          max={8}
          addLabel="Add facilitator"
          add={() => setFacilitators((f) => [...f, { name: '', title: '', bio: '', years: '' }])}
          remove={(i) => setFacilitators((f) => f.filter((_, j) => j !== i))}
          render={(f, i) => (
            <div className="space-y-2">
              <input value={f.name} onChange={(e) => setFacilitators((arr) => arr.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} className={input} placeholder="Full name" />
              <input value={f.title} onChange={(e) => setFacilitators((arr) => arr.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} className={input} placeholder="Title / role" />
              <textarea value={f.bio} onChange={(e) => setFacilitators((arr) => arr.map((x, j) => (j === i ? { ...x, bio: e.target.value } : x)))} rows={2} className={input} placeholder="Bio" />
              <input type="number" value={f.years} onChange={(e) => setFacilitators((arr) => arr.map((x, j) => (j === i ? { ...x, years: e.target.value } : x)))} className={input} placeholder="Years of experience" />
            </div>
          )}
        />
      </Section>

      {/* SECTION F */}
      <Section letter="F" title="FAQ">
        <Repeatable
          items={faq}
          min={2}
          max={12}
          addLabel="Add question"
          add={() => setFaq((f) => [...f, { question: '', answer: '' }])}
          remove={(i) => setFaq((f) => f.filter((_, j) => j !== i))}
          render={(f, i) => (
            <div className="space-y-2">
              <input value={f.question} onChange={(e) => setFaq((arr) => arr.map((x, j) => (j === i ? { ...x, question: e.target.value } : x)))} className={input} placeholder="Question" />
              <textarea value={f.answer} onChange={(e) => setFaq((arr) => arr.map((x, j) => (j === i ? { ...x, answer: e.target.value } : x)))} rows={2} className={input} placeholder="Answer" />
            </div>
          )}
        />
      </Section>

      {/* SECTION G */}
      <Section letter="G" title="Testimonials (optional)">
        <Repeatable
          items={testimonials}
          min={0}
          max={8}
          addLabel="Add testimonial"
          add={() => setTestimonials((t) => [...t, { name: '', organization: '', quote: '' }])}
          remove={(i) => setTestimonials((t) => t.filter((_, j) => j !== i))}
          render={(t, i) => (
            <div className="space-y-2">
              <input value={t.name} onChange={(e) => setTestimonials((arr) => arr.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} className={input} placeholder="Name" />
              <input value={t.organization} onChange={(e) => setTestimonials((arr) => arr.map((x, j) => (j === i ? { ...x, organization: e.target.value } : x)))} className={input} placeholder="Organization" />
              <textarea value={t.quote} onChange={(e) => setTestimonials((arr) => arr.map((x, j) => (j === i ? { ...x, quote: e.target.value } : x)))} rows={2} className={input} placeholder="Testimonial" />
            </div>
          )}
        />
      </Section>

      {errors.length > 0 ? (
        <div className="apa-box apa-box-gold p-4">
          <p className="text-sm font-bold text-apa-navy">Please complete:</p>
          <ul className="mt-1 list-disc pl-5 text-sm text-apa-ink">
            {errors.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </div>
      ) : null}

      <button type="button" onClick={onSubmit} className="w-full rounded-md bg-apa-green px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-apa-green-mid">
        Submit Journey for Review
      </button>

      {/* Confirmation modal */}
      {confirm ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-apa-navy/60 p-4" role="dialog" aria-modal="true" onClick={() => setConfirm(false)}>
          <div className="w-full max-w-md rounded-apa-lg bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-apa-green">Submit for review?</h3>
            <p className="mt-2 text-sm text-apa-ink">
              Your journey <b>{title}</b> will be sent to the APA team for review before publication. You can
              still edit it while it is pending.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirm(false)} className="rounded-md border border-apa-line px-4 py-2 text-sm font-semibold text-apa-grey">Cancel</button>
              <button type="button" onClick={() => { setConfirm(false); setDone(true); }} className="rounded-md bg-apa-green px-4 py-2 text-sm font-bold text-white hover:bg-apa-green-mid">Confirm & Submit</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
