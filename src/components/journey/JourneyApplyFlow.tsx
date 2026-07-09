'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Journey, JourneyApplicationForm } from '@/types/journey';

/**
 * Journey application workflow (client, mock-persisted to localStorage so the
 * CEO demo tracks end-to-end without a backend):
 *   Review → Personal → Professional → Motivation → Documents → Declarations →
 *   Confirmation. On submit we mint a reference and push it to the user's
 *   Journey Dashboard ("apa.journey.applications").
 */

const STEPS = ['Review', 'Personal', 'Professional', 'Motivation', 'Documents', 'Declarations', 'Done'] as const;
type Step = number;

const EMPTY: JourneyApplicationForm = {
  firstName: '', lastName: '', dateOfBirth: '', gender: '', nationality: '',
  countryResidence: '', city: '', email: '', phone: '', position: '',
  organization: '', industry: '', yearsExperience: '', languages: '', expertise: '',
  motivationWhy: '', motivationImpact: '', priorExperience: '',
  acceptEthics: false, acceptPrivacy: false, signature: '',
};

const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

type DocKey = 'cv' | 'idDoc' | 'motivationLetter' | 'reference';
const DOCS: { key: DocKey; label: string; required: boolean }[] = [
  { key: 'cv', label: 'Curriculum Vitae / Resume', required: true },
  { key: 'idDoc', label: 'Passport / National ID', required: true },
  { key: 'motivationLetter', label: 'Motivation Letter (optional)', required: false },
  { key: 'reference', label: 'Letter of Reference (optional)', required: false },
];

export function JourneyApplyFlow({
  journey,
  locale,
  autoOpen = false,
}: {
  journey: Journey;
  locale: string;
  autoOpen?: boolean;
}) {
  const [open, setOpen] = useState(autoOpen);
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<JourneyApplicationForm>(EMPTY);
  const [docs, setDocs] = useState<Record<DocKey, string>>({ cv: '', idDoc: '', motivationLetter: '', reference: '' });
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoOpen && topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [autoOpen]);

  const set = (patch: Partial<JourneyApplicationForm>) => setForm((f) => ({ ...f, ...patch }));

  const canContinue = useMemo(() => {
    switch (step) {
      case 1: return form.firstName && form.lastName && form.dateOfBirth && form.nationality && form.countryResidence && form.city && form.email && form.phone;
      case 2: return form.position && form.organization && form.yearsExperience && form.languages && form.expertise;
      case 3: return form.motivationWhy.trim().length >= 100 && form.motivationImpact.trim().length >= 50;
      case 4: return docs.cv && docs.idDoc;
      case 5: return form.acceptEthics && form.acceptPrivacy && form.signature.trim().length > 2;
      default: return true;
    }
  }, [step, form, docs]);

  function next() {
    if (!canContinue) { setError('Please complete the required fields before continuing.'); return; }
    setError(null);
    if (step === 5) return submit();
    setStep((s) => (s + 1) as Step);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function back() { setError(null); setStep((s) => Math.max(0, s - 1) as Step); }

  function submit() {
    const ref = `APA-J-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    setReference(ref);
    try {
      const key = 'apa.journey.applications';
      const prev = JSON.parse(localStorage.getItem(key) || '[]');
      prev.push({
        reference: ref,
        journeyId: journey.id,
        journeyTitle: journey.title,
        country: journey.country,
        appliedAt: new Date().toISOString(),
        status: 'Submitted',
        applicant: `${form.firstName} ${form.lastName}`,
      });
      localStorage.setItem(key, JSON.stringify(prev));
    } catch { /* storage unavailable — confirmation still shows */ }
    setStep(6);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (!open) {
    return (
      <div className="rounded-apa-lg apa-gradient p-6 text-white sm:p-8">
        <h2 className="text-xl font-bold">Ready to apply?</h2>
        <p className="mt-1 max-w-xl text-sm text-apa-sage">
          Join the {journey.title}. The application takes ~10 minutes: personal & professional details,
          your motivation, and two documents. You can track your status on your Journey Dashboard.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 rounded-md bg-white px-5 py-2.5 text-sm font-bold text-apa-green transition-colors hover:bg-apa-soft"
        >
          Start application →
        </button>
      </div>
    );
  }

  return (
    <div ref={topRef} className="rounded-apa-lg border border-apa-line bg-white p-6 shadow-sm sm:p-8">
      {/* Progress */}
      <ol className="mb-6 flex flex-wrap gap-1.5 text-[11px] font-bold uppercase">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={`rounded-full px-2.5 py-1 ${
              i === step ? 'apa-gradient text-white' : i < step ? 'bg-apa-green/10 text-apa-green' : 'bg-apa-soft text-apa-grey'
            }`}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div>
          <h2 className="text-xl font-bold text-apa-navy">Review before you apply</h2>
          <div className="apa-box mt-4 space-y-1 p-4 text-sm">
            <p><strong>{journey.title}</strong></p>
            <p>{journey.countryFlag} {journey.country} · {journey.cityRegion}</p>
            <p>{journey.durationDays} days · {journey.deliveryFormat} · {money(journey.priceUSD)}</p>
          </div>
          <ul className="mt-4 space-y-1 text-sm text-apa-ink">
            <li>✓ You meet the {journey.difficulty}-level eligibility for this role.</li>
            <li>✓ You can commit to the full duration and dates.</li>
            <li>✓ You have a CV and an ID document ready to upload.</li>
          </ul>
        </div>
      )}

      {step === 1 && (
        <Fieldset title="Personal information">
          <Grid>
            <Field label="First name *"><input className={inp} value={form.firstName} onChange={(e) => set({ firstName: e.target.value })} /></Field>
            <Field label="Last name *"><input className={inp} value={form.lastName} onChange={(e) => set({ lastName: e.target.value })} /></Field>
            <Field label="Date of birth *"><input type="date" className={inp} value={form.dateOfBirth} onChange={(e) => set({ dateOfBirth: e.target.value })} /></Field>
            <Field label="Gender"><input className={inp} value={form.gender} onChange={(e) => set({ gender: e.target.value })} /></Field>
            <Field label="Nationality *"><input className={inp} value={form.nationality} onChange={(e) => set({ nationality: e.target.value })} /></Field>
            <Field label="Country of residence *"><input className={inp} value={form.countryResidence} onChange={(e) => set({ countryResidence: e.target.value })} /></Field>
            <Field label="City *"><input className={inp} value={form.city} onChange={(e) => set({ city: e.target.value })} /></Field>
            <Field label="Email *"><input type="email" className={inp} value={form.email} onChange={(e) => set({ email: e.target.value })} /></Field>
            <Field label="Phone *"><input className={inp} value={form.phone} onChange={(e) => set({ phone: e.target.value })} /></Field>
          </Grid>
        </Fieldset>
      )}

      {step === 2 && (
        <Fieldset title="Professional background">
          <Grid>
            <Field label="Current position *"><input className={inp} value={form.position} onChange={(e) => set({ position: e.target.value })} /></Field>
            <Field label="Organization *"><input className={inp} value={form.organization} onChange={(e) => set({ organization: e.target.value })} /></Field>
            <Field label="Industry"><input className={inp} value={form.industry} onChange={(e) => set({ industry: e.target.value })} /></Field>
            <Field label="Years of experience *"><input className={inp} value={form.yearsExperience} onChange={(e) => set({ yearsExperience: e.target.value })} /></Field>
            <Field label="Languages spoken *"><input className={inp} value={form.languages} onChange={(e) => set({ languages: e.target.value })} placeholder="e.g. English, French" /></Field>
          </Grid>
          <Field label="Areas of expertise *"><textarea className={`${inp} min-h-20`} value={form.expertise} onChange={(e) => set({ expertise: e.target.value })} /></Field>
        </Fieldset>
      )}

      {step === 3 && (
        <Fieldset title="Motivation">
          <Field label="Why do you want to join this journey? * (min 100 characters)">
            <textarea className={`${inp} min-h-28`} value={form.motivationWhy} onChange={(e) => set({ motivationWhy: e.target.value })} />
            <Counter n={form.motivationWhy.length} min={100} />
          </Field>
          <Field label="What impact do you intend to create afterwards? * (min 50 characters)">
            <textarea className={`${inp} min-h-24`} value={form.motivationImpact} onChange={(e) => set({ motivationImpact: e.target.value })} />
            <Counter n={form.motivationImpact.length} min={50} />
          </Field>
          <Field label="Relevant prior experience (optional)">
            <textarea className={`${inp} min-h-20`} value={form.priorExperience} onChange={(e) => set({ priorExperience: e.target.value })} />
          </Field>
        </Fieldset>
      )}

      {step === 4 && (
        <Fieldset title="Supporting documents">
          <p className="text-sm text-apa-grey">Attach the required files. In this preview, selecting a file records its name; upload wiring plugs into the same fields.</p>
          <div className="mt-4 space-y-3">
            {DOCS.map((d) => (
              <label key={d.key} className="flex flex-wrap items-center justify-between gap-3 rounded-apa border border-apa-line p-3">
                <span className="text-sm font-semibold text-apa-navy">{d.label}{d.required && <span className="text-apa-bronze"> *</span>}</span>
                <span className="flex items-center gap-3">
                  {docs[d.key] ? <span className="text-xs font-semibold text-apa-green">✓ {docs[d.key]}</span> : null}
                  <input
                    type="file"
                    className="text-xs"
                    onChange={(e) => setDocs((prev) => ({ ...prev, [d.key]: e.target.files?.[0]?.name ?? '' }))}
                  />
                </span>
              </label>
            ))}
          </div>
        </Fieldset>
      )}

      {step === 5 && (
        <Fieldset title="Declarations & signature">
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1" checked={form.acceptEthics} onChange={(e) => set({ acceptEthics: e.target.checked })} />
            <span>I commit to the APA Code of Ethics and to respecting community narrative sovereignty throughout the journey.</span>
          </label>
          <label className="mt-3 flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1" checked={form.acceptPrivacy} onChange={(e) => set({ acceptPrivacy: e.target.checked })} />
            <span>I consent to APA processing my application data in line with its privacy policy.</span>
          </label>
          <Field label="Electronic signature (type your full name) *">
            <input className={inp} value={form.signature} onChange={(e) => set({ signature: e.target.value })} />
          </Field>
        </Fieldset>
      )}

      {step === 6 && reference && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-apa-green text-2xl text-white">✓</div>
          <h2 className="mt-4 text-2xl font-bold text-apa-navy">Application submitted</h2>
          <p className="mt-2 text-sm text-apa-grey">Thank you, {form.firstName}. Your application to <strong>{journey.title}</strong> has been received.</p>
          <div className="apa-box apa-box-gold mx-auto mt-4 inline-block px-6 py-3 text-left">
            <div className="text-[11px] font-bold uppercase text-apa-grey">Reference</div>
            <div className="text-lg font-bold tracking-wider text-apa-navy">{reference}</div>
          </div>
          <ol className="mx-auto mt-6 max-w-md space-y-2 text-left text-sm text-apa-ink">
            <li>1. Our team reviews your application and documents (5–10 business days).</li>
            <li>2. Shortlisted candidates are invited to a short interview.</li>
            <li>3. Final decision and onboarding instructions by email.</li>
          </ol>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={`/${locale}/journeys/dashboard`} className="rounded-md bg-apa-green px-5 py-2.5 text-sm font-bold text-white hover:bg-apa-green-mid">
              Track on my dashboard
            </a>
            <a href={`/${locale}/journeys`} className="rounded-md border border-apa-line px-5 py-2.5 text-sm font-semibold text-apa-navy hover:border-apa-green">
              Browse more journeys
            </a>
          </div>
        </div>
      )}

      {step < 6 && (
        <>
          {error ? <p className="mt-4 text-sm font-semibold text-apa-bronze">{error}</p> : null}
          <div className="mt-6 flex items-center justify-between">
            <button type="button" onClick={step === 0 ? () => setOpen(false) : back} className="text-sm font-semibold text-apa-grey hover:text-apa-green">
              {step === 0 ? 'Cancel' : '← Back'}
            </button>
            <button
              type="button"
              onClick={next}
              className="rounded-md bg-apa-green px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-apa-green-mid disabled:opacity-50"
            >
              {step === 5 ? 'Submit application' : step === 0 ? 'Begin →' : 'Continue →'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const inp = 'w-full rounded-md border border-apa-line px-3 py-2 text-sm text-apa-ink focus:border-apa-green focus:outline-none';

function Fieldset({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-apa-navy">{title}</h2>
      <div className="apa-rule my-3" />
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-[11px] font-bold uppercase text-apa-grey">
      {label}
      <span className="font-normal normal-case">{children}</span>
    </label>
  );
}
function Counter({ n, min }: { n: number; min: number }) {
  return <span className={`mt-1 block text-[11px] ${n >= min ? 'text-apa-green' : 'text-apa-grey'}`}>{n} / {min} min</span>;
}
