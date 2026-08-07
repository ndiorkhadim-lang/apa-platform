'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import { submitPartnerApplication } from '@/app/[locale]/(public)/journeys/partner/apply/actions';
import { TagField } from '@/components/journey/TagField';
import {
  ORG_TYPES, JOURNEY_THEMES, JOURNEY_AUDIENCES, JOURNEY_LANGUAGES, TRAVEL_TYPES,
  DIFFICULTY_LEVELS, CERTIFICATION_ALIGNMENT, FRAMEWORK_MODULES, SDGS,
  EXPECTED_OUTCOMES, APA_REGIONAL_HUBS, SECTOR_FOCUS, DURATION_DAYS,
} from '@/data/partner-taxonomy';

type Tool = { number: number; name: string };

const COUNTRIES = [
  'Nigeria', 'Ghana', 'Senegal', 'Côte d’Ivoire', 'Benin', 'Guinea', 'Togo', 'Gambia', 'Mali',
  'Kenya', 'Ethiopia', 'Tanzania', 'Rwanda', 'Uganda', 'Mauritius',
  'Cameroon', 'DR Congo', 'Gabon', 'Chad',
  'Morocco', 'Egypt', 'Tunisia', 'Algeria',
  'South Africa', 'Zambia', 'Zimbabwe', 'Mozambique', 'Botswana', 'Namibia',
];

type FormState = {
  organization: string; orgTypeTags: string[]; country: string[]; regionalHub: string[];
  regNumber: string; legalRepName: string; legalRepTitle: string; email: string;
  phone: string; website: string; linkedin: string;
  acceptKinship: boolean; acceptPayParity: boolean; acceptCVP: boolean; licenseFileName: string;
  jTitle: string; jSector: string[]; jDurationDays: string[]; jMaxCapacity: string;
  jLocation: string; jItinerary: string;
  themeTags: string[]; audienceTags: string[]; languages: string[]; sdgs: string[];
  frameworkModules: string[]; toolNumbers: string[]; communityPartners: string[];
  expectedOutcomes: string[]; travelType: string[]; difficulty: string[]; certificationAlignment: string[];
};

const EMPTY: FormState = {
  organization: '', orgTypeTags: [], country: [], regionalHub: [], regNumber: '',
  legalRepName: '', legalRepTitle: '', email: '', phone: '', website: '', linkedin: '',
  acceptKinship: false, acceptPayParity: false, acceptCVP: false, licenseFileName: '',
  jTitle: '', jSector: [], jDurationDays: [], jMaxCapacity: '', jLocation: '', jItinerary: '',
  themeTags: [], audienceTags: [], languages: [], sdgs: [], frameworkModules: [],
  toolNumbers: [], communityPartners: [], expectedOutcomes: [], travelType: [],
  difficulty: [], certificationAlignment: [],
};

const inputCls =
  'w-full rounded-md border border-apa-line bg-white px-3 py-2.5 text-sm text-apa-ink outline-none focus:border-apa-green focus:ring-1 focus:ring-apa-green';

function Text({ label, value, onChange, placeholder, required, type = 'text', hint }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  required?: boolean; type?: string; hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-apa-navy">{label}{required ? <span className="text-red-600"> *</span> : null}</span>
      {hint ? <span className="mt-0.5 block text-xs text-apa-grey">{hint}</span> : null}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`mt-1.5 ${inputCls}`} />
    </label>
  );
}

const DRAFT_KEY = 'apa.partner.apply.draft.v1';

export function PartnerApplicationWizard({
  locale, defaultEmail, authenticated: initialAuthed, userName, tools,
}: {
  locale: string; defaultEmail?: string; authenticated: boolean; userName?: string; tools: Tool[];
}) {
  const router = useRouter();
  const [authed, setAuthed] = useState(initialAuthed);
  const [data, setData] = useState<FormState>({ ...EMPTY, email: defaultEmail ?? '', legalRepName: userName ?? '' });
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Account step (guests only)
  const [acct, setAcct] = useState({ name: userName ?? '', email: defaultEmail ?? '', password: '', confirm: '' });
  const [acctBusy, setAcctBusy] = useState(false);
  const [acctErr, setAcctErr] = useState<string | null>(null);

  const toolOptions = useMemo(() => tools.map((t) => ({ value: String(t.number), label: `#${t.number} — ${t.name}` })), [tools]);

  // Restore / persist draft (application data only, never the password).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) setData((d) => ({ ...d, ...JSON.parse(saved) }));
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch { /* ignore */ }
  }, [data]);

  const set = <K extends keyof FormState>(k: K) => (v: FormState[K]) => setData((d) => ({ ...d, [k]: v }));

  // Steps definition — account only when guest.
  const steps = useMemo(() => {
    const base = [
      { id: 'org', title: 'Organization', blurb: 'Who is applying' },
      { id: 'ethics', title: 'Ethics & GRC', blurb: 'Mandates & license' },
      { id: 'journey', title: 'First Journey', blurb: 'Design your journey' },
      { id: 'review', title: 'Review & Submit', blurb: 'Confirm & send' },
    ];
    return authed ? base : [{ id: 'account', title: 'Create Account', blurb: 'Your partner login' }, ...base];
  }, [authed]);

  const current = steps[step];

  async function createAccount() {
    setAcctErr(null);
    if (!acct.name.trim() || !acct.email.trim()) return setAcctErr('Name and email are required.');
    if (acct.password.length < 10) return setAcctErr('Password must be at least 10 characters.');
    if (acct.password !== acct.confirm) return setAcctErr('Passwords do not match.');
    setAcctBusy(true);
    try {
      const res = await authClient.signUp.email({
        name: acct.name, email: acct.email, password: acct.password,
        // personalization only — never a privilege grant
        apaRelationship: 'business_partner',
      } as Parameters<typeof authClient.signUp.email>[0]);
      if ((res as { error?: { message?: string } })?.error) {
        setAcctErr((res as { error?: { message?: string } }).error?.message ?? 'Could not create your account.');
        return;
      }
      setData((d) => ({ ...d, email: acct.email, legalRepName: d.legalRepName || acct.name }));
      setAuthed(true);
      setStep(1);
    } catch {
      setAcctErr('Could not create your account. The email may already be registered — sign in instead.');
    } finally {
      setAcctBusy(false);
    }
  }

  function validateStep(): string | null {
    const id = current.id;
    if (id === 'org') {
      if (!data.organization.trim()) return 'Organization name is required.';
      if (data.orgTypeTags.length === 0) return 'Select at least one organization type.';
      if (data.country.length === 0) return 'Select your country of operation.';
      if (data.regionalHub.length === 0) return 'Select your APA regional hub.';
      if (!data.regNumber.trim()) return 'Legal registration / tax ID is required.';
      if (!data.legalRepName.trim() || !data.legalRepTitle.trim()) return 'Legal representative name and title are required.';
      if (!data.email.trim()) return 'A professional email is required.';
      if (!data.phone.trim()) return 'A phone / WhatsApp number is required.';
    }
    if (id === 'ethics') {
      if (!data.acceptKinship || !data.acceptPayParity || !data.acceptCVP) return 'You must accept all three GRC mandates.';
    }
    if (id === 'journey') {
      if (!data.jTitle.trim()) return 'A journey title is required.';
      if (data.jSector.length === 0) return 'Select a primary sector focus.';
      if (data.themeTags.length === 0) return 'Select at least one journey theme.';
      if (data.jDurationDays.length === 0) return 'Select a duration.';
      if (!data.jMaxCapacity.trim()) return 'Max guest capacity is required.';
      if (!data.jLocation.trim()) return 'Exact field location is required.';
      if (data.jItinerary.trim().length < 60) return 'Please provide a fuller itinerary (min 60 characters).';
    }
    return null;
  }

  function next() {
    const v = validateStep();
    if (v) { setError(v); return; }
    setError(null);
    setStep((s) => Math.min(s + 1, steps.length - 1));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function back() { setError(null); setStep((s) => Math.max(s - 1, 0)); }

  function submit() {
    setError(null);
    const payload = {
      organization: data.organization, orgTypeTags: data.orgTypeTags,
      country: data.country[0] ?? '', regionalHub: data.regionalHub[0] ?? '',
      regNumber: data.regNumber, legalRepName: data.legalRepName, legalRepTitle: data.legalRepTitle,
      email: data.email, phone: data.phone, website: data.website, linkedin: data.linkedin,
      acceptKinship: data.acceptKinship, acceptPayParity: data.acceptPayParity, acceptCVP: data.acceptCVP,
      licenseFileName: data.licenseFileName,
      jTitle: data.jTitle, jSector: data.jSector[0] ?? '', jDurationDays: data.jDurationDays[0] ?? '',
      jMaxCapacity: data.jMaxCapacity, jLocation: data.jLocation, jItinerary: data.jItinerary,
      themeTags: data.themeTags, audienceTags: data.audienceTags, languages: data.languages,
      sdgs: data.sdgs, frameworkModules: data.frameworkModules,
      toolNumbers: data.toolNumbers.map(Number), communityPartners: data.communityPartners,
      expectedOutcomes: data.expectedOutcomes, travelType: data.travelType[0] ?? '',
      difficulty: data.difficulty[0] ?? '', certificationAlignment: data.certificationAlignment[0] ?? '',
      locale,
    };
    const fd = new FormData();
    fd.set('payload', JSON.stringify(payload));
    startTransition(async () => {
      try {
        const res = await submitPartnerApplication(fd);
        if (res.ok) {
          try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
          router.push('/journeys/partner?submitted=1');
          return;
        }
        setError(
          res.error === 'already_submitted' ? 'A partner application is already on file for your account.'
            : res.error === 'mandates' ? 'You must accept all three GRC mandates.'
            : 'Submission failed — please review the required fields.',
        );
      } catch {
        setError('Something went wrong submitting your application. Please try again.');
      }
    });
  }

  const pct = Math.round(((step + (current.id === 'review' ? 1 : 0)) / steps.length) * 100);

  return (
    <div className="grid gap-0 overflow-hidden rounded-2xl border border-apa-line bg-white shadow-xl lg:grid-cols-[300px_1fr]">
      {/* ── Left rail: branded progress ── */}
      <aside className="apa-gradient relative hidden flex-col justify-between p-7 text-white lg:flex">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide">
            ✦ APA Partner Program
          </span>
          <h2 className="mt-4 text-2xl font-bold leading-tight">Become a<br />Journey Partner</h2>
          <p className="mt-2 text-sm text-white/80">Certify your organization and publish immersive Strategic Journeys across Africa.</p>

          <ol className="mt-8 space-y-1.5">
            {steps.map((s, i) => {
              const state = i < step ? 'done' : i === step ? 'active' : 'todo';
              return (
                <li key={s.id} className={`flex items-start gap-3 rounded-lg px-2.5 py-2 ${state === 'active' ? 'bg-white/15' : ''}`}>
                  <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    state === 'done' ? 'bg-apa-gold text-apa-ink' : state === 'active' ? 'bg-white text-apa-green' : 'bg-white/20 text-white/80'
                  }`}>{state === 'done' ? '✓' : i + 1}</span>
                  <span>
                    <span className="block text-sm font-semibold">{s.title}</span>
                    <span className="block text-[11px] text-white/70">{s.blurb}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="mt-8 space-y-2 text-[11px] text-white/70">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-apa-gold transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p>Your progress is auto-saved on this device.</p>
        </div>
      </aside>

      {/* ── Right: step content ── */}
      <div className="min-h-[560px] p-6 sm:p-9">
        {/* mobile progress */}
        <div className="mb-6 lg:hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-apa-grey">
            <span>Step {step + 1} of {steps.length} · {current.title}</span><span>{pct}%</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-apa-soft"><div className="h-full rounded-full bg-apa-green" style={{ width: `${pct}%` }} /></div>
        </div>

        {current.id === 'account' && (
          <StepShell n="01" title="Create your Partner account" desc="This dedicated partner login is different from a standard account — it routes you straight into the application.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><Text label="Full name" value={acct.name} onChange={(v) => setAcct({ ...acct, name: v })} required placeholder="Your name" /></div>
              <div className="sm:col-span-2"><Text label="Professional email" type="email" value={acct.email} onChange={(v) => setAcct({ ...acct, email: v })} required placeholder="name@organization.org" /></div>
              <Text label="Password" type="password" value={acct.password} onChange={(v) => setAcct({ ...acct, password: v })} required hint="Minimum 10 characters" />
              <Text label="Confirm password" type="password" value={acct.confirm} onChange={(v) => setAcct({ ...acct, confirm: v })} required />
            </div>
            {acctErr ? <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{acctErr}</p> : null}
            <div className="mt-7 flex items-center justify-between">
              <a href={`/${locale}/sign-in?redirect=%2Fjourneys%2Fpartner%2Fapply`} className="text-sm font-semibold text-apa-grey hover:text-apa-green">Already have an account? Sign in</a>
              <button type="button" onClick={createAccount} disabled={acctBusy} className="apa-gradient rounded-md px-6 py-3 text-sm font-bold text-white disabled:opacity-60">
                {acctBusy ? 'Creating…' : 'Create account & continue →'}
              </button>
            </div>
          </StepShell>
        )}

        {current.id === 'org' && (
          <StepShell n="02" title="Entity & Legal Representative" desc="Tell us about the organization applying for APA Partner certification.">
            <div className="space-y-5">
              <Text label="Organization Name" value={data.organization} onChange={set('organization')} required placeholder="Legal name of the applying entity" />
              <TagField label="Organization Type" required options={ORG_TYPES} value={data.orgTypeTags} onChange={set('orgTypeTags')} hint="Select all that apply" />
              <div className="grid gap-5 sm:grid-cols-2">
                <TagField label="Country of Operation" required multi={false} searchable options={COUNTRIES} value={data.country} onChange={set('country')} />
                <TagField label="APA Regional Hub Node" required multi={false} options={APA_REGIONAL_HUBS} value={data.regionalHub} onChange={set('regionalHub')} />
              </div>
              <Text label="Legal Registration / Tax ID Number" value={data.regNumber} onChange={set('regNumber')} required placeholder="SN-DKR-2026-B-1234" hint="e.g. SN-DKR-2026-B-1234" />
              <div className="grid gap-5 sm:grid-cols-2">
                <Text label="Legal Representative Name" value={data.legalRepName} onChange={set('legalRepName')} required placeholder="Full name" />
                <Text label="Title / Role" value={data.legalRepTitle} onChange={set('legalRepTitle')} required placeholder="e.g. Managing Director" />
                <Text label="Official Professional Email" type="email" value={data.email} onChange={set('email')} required placeholder="name@organization.org" />
                <Text label="Phone / WhatsApp Number" value={data.phone} onChange={set('phone')} required placeholder="+221 …" />
                <Text label="Organization Website" value={data.website} onChange={set('website')} placeholder="https://…" />
                <Text label="LinkedIn Profile / Corporate Page" value={data.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/company/…" />
              </div>
            </div>
          </StepShell>
        )}

        {current.id === 'ethics' && (
          <StepShell n="03" title="Ethical Mandates & GRC Compliance" desc="APA partnership is bound by three non-negotiable mandates.">
            <div className="space-y-3">
              {[
                { k: 'acceptKinship' as const, t: 'Adherence to Kinship Equity™ Principles', d: 'We commit to APA’s Kinship Equity™ framework across every journey.' },
                { k: 'acceptPayParity' as const, t: 'Pay Parity Mandate & Fair Remuneration', d: 'We guarantee fair, transparent remuneration and pay parity for local staff, facilitators and host communities.' },
                { k: 'acceptCVP' as const, t: 'Community Verification Protocol (CVP) Veto Right', d: 'We recognize host communities’ CVP veto right over any activity that affects them.' },
              ].map((m) => (
                <button type="button" key={m.k} onClick={() => set(m.k)(!data[m.k])} className={`flex w-full gap-3 rounded-xl border p-4 text-left transition ${data[m.k] ? 'border-apa-green bg-apa-green/5' : 'border-apa-line hover:border-apa-green'}`}>
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${data[m.k] ? 'border-apa-green bg-apa-green text-white' : 'border-apa-line'}`}>{data[m.k] ? '✓' : ''}</span>
                  <span><span className="block text-sm font-semibold text-apa-navy">{m.t}</span><span className="mt-0.5 block text-xs text-apa-grey">{m.d}</span></span>
                </button>
              ))}
              <label className="mt-2 block rounded-xl border border-dashed border-apa-line p-4">
                <span className="text-sm font-semibold text-apa-navy">Upload Legal Registration / Operating License (PDF) <span className="text-red-600">*</span></span>
                <span className="mt-0.5 block text-xs text-apa-grey">PDF, max 10 MB</span>
                <input type="file" accept="application/pdf" onChange={(e) => set('licenseFileName')(e.target.files?.[0]?.name ?? '')}
                  className="mt-2 block w-full text-sm text-apa-grey file:mr-3 file:rounded-md file:border-0 file:bg-apa-green file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-apa-green-mid" />
                {data.licenseFileName ? <span className="mt-1 block text-xs font-semibold text-apa-green">✓ {data.licenseFileName}</span> : null}
              </label>
            </div>
          </StepShell>
        )}

        {current.id === 'journey' && (
          <StepShell n="04" title="Your First Strategic Journey" desc="Design the immersive journey you want to publish. Use tags to make it discoverable.">
            <div className="space-y-6">
              <Text label="Proposed Journey Title" value={data.jTitle} onChange={set('jTitle')} required placeholder="e.g. Ground-Truth Governance Immersion — Casamance" />
              <TagField label="Journey Themes" required options={JOURNEY_THEMES} value={data.themeTags} onChange={set('themeTags')} hint="Pick the themes this journey advances" />
              <div className="grid gap-5 sm:grid-cols-2">
                <TagField label="Primary Sector Focus" required multi={false} options={SECTOR_FOCUS} value={data.jSector} onChange={set('jSector')} />
                <TagField label="Travel Type" multi={false} options={TRAVEL_TYPES} value={data.travelType} onChange={set('travelType')} />
                <TagField label="Duration" required multi={false} options={DURATION_DAYS.map((d) => ({ value: String(d), label: `${d} days` }))} value={data.jDurationDays} onChange={set('jDurationDays')} />
                <TagField label="Difficulty Level" multi={false} options={DIFFICULTY_LEVELS} value={data.difficulty} onChange={set('difficulty')} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Text label="Max Guest Capacity" type="number" value={data.jMaxCapacity} onChange={set('jMaxCapacity')} required placeholder="12" hint="e.g. 12 participants" />
                <Text label="Exact Field Location" value={data.jLocation} onChange={set('jLocation')} required placeholder="Ziguinchor, Casamance, Senegal" hint="City / Region, Country" />
              </div>
              <TagField label="Target Audience" options={JOURNEY_AUDIENCES} value={data.audienceTags} onChange={set('audienceTags')} />
              <TagField label="Languages of Delivery" options={JOURNEY_LANGUAGES} value={data.languages} onChange={set('languages')} />
              <TagField label="APA Framework Modules" options={FRAMEWORK_MODULES.map((m) => ({ value: m.code, label: m.label }))} value={data.frameworkModules} onChange={set('frameworkModules')} hint="Pillars this journey builds capacity in" />
              <TagField label="Applicable APA Tools" searchable options={toolOptions} value={data.toolNumbers} onChange={set('toolNumbers')} hint="Search the 63 GRC tools this journey applies" />
              <TagField label="UN SDGs" searchable options={SDGS} value={data.sdgs} onChange={set('sdgs')} />
              <TagField label="Expected Outcomes" allowCustom options={EXPECTED_OUTCOMES} value={data.expectedOutcomes} onChange={set('expectedOutcomes')} />
              <TagField label="Associated Local Host Communities" allowCustom options={[]} value={data.communityPartners} onChange={set('communityPartners')} hint="Type each host community and press Enter" />
              <TagField label="Certification Alignment" multi={false} options={CERTIFICATION_ALIGNMENT} value={data.certificationAlignment} onChange={set('certificationAlignment')} />
              <label className="block">
                <span className="text-sm font-semibold text-apa-navy">Ground-Truth Itinerary Description <span className="text-red-600">*</span></span>
                <textarea value={data.jItinerary} onChange={(e) => set('jItinerary')(e.target.value)} rows={6} className={`mt-1.5 ${inputCls}`} placeholder="Day-by-day itinerary, field sites, institutional meetings, community immersions and learning outcomes." />
              </label>
            </div>
          </StepShell>
        )}

        {current.id === 'review' && (
          <StepShell n="05" title="Review & Submit" desc="Confirm your application and first journey. APA reviews both together.">
            <div className="space-y-4">
              <ReviewCard title="Organization" onEdit={() => setStep(authed ? 0 : 1)} rows={[
                ['Organization', data.organization], ['Type', data.orgTypeTags.join(', ')],
                ['Country', data.country[0] ?? ''], ['Hub', data.regionalHub[0] ?? ''],
                ['Reg / Tax ID', data.regNumber], ['Representative', `${data.legalRepName} — ${data.legalRepTitle}`],
                ['Email', data.email], ['Phone', data.phone],
              ]} />
              <ReviewCard title="Ethics & GRC" onEdit={() => setStep(authed ? 1 : 2)} rows={[
                ['Kinship Equity™', data.acceptKinship ? 'Accepted' : '—'],
                ['Pay Parity', data.acceptPayParity ? 'Accepted' : '—'],
                ['CVP Veto', data.acceptCVP ? 'Accepted' : '—'],
                ['License', data.licenseFileName || 'Not attached'],
              ]} />
              <ReviewCard title="First Journey" onEdit={() => setStep(authed ? 2 : 3)} rows={[
                ['Title', data.jTitle], ['Sector', data.jSector[0] ?? ''], ['Themes', data.themeTags.join(', ')],
                ['Duration', data.jDurationDays[0] ? `${data.jDurationDays[0]} days` : ''], ['Capacity', data.jMaxCapacity],
                ['Location', data.jLocation], ['Audience', data.audienceTags.join(', ')],
                ['Languages', data.languages.join(', ')], ['SDGs', data.sdgs.join(', ')],
                ['APA Tools', data.toolNumbers.length ? `${data.toolNumbers.length} selected` : ''],
                ['Outcomes', data.expectedOutcomes.join(', ')],
              ]} />
              <p className="text-xs text-apa-grey">By submitting, you confirm the information is accurate and agree to APA’s governance review. On approval, your account is upgraded to <strong>Partner</strong> and this journey is published.</p>
            </div>
          </StepShell>
        )}

        {error ? <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}

        {/* Nav */}
        {current.id !== 'account' && (
          <div className="mt-8 flex items-center justify-between border-t border-apa-line pt-6">
            <button type="button" onClick={back} disabled={step === 0} className="rounded-md border border-apa-line px-5 py-2.5 text-sm font-semibold text-apa-navy hover:border-apa-green disabled:opacity-40">← Back</button>
            {current.id === 'review' ? (
              <button type="button" onClick={submit} disabled={pending} className="apa-gradient rounded-md px-6 py-3 text-sm font-bold text-white disabled:opacity-60">
                {pending ? 'Submitting…' : 'SUBMIT PARTNER APPLICATION & JOURNEY'}
              </button>
            ) : (
              <button type="button" onClick={next} className="rounded-md bg-apa-green px-6 py-2.5 text-sm font-bold text-white hover:bg-apa-green-mid">Continue →</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StepShell({ n, title, desc, children }: { n: string; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-apa-gold text-sm font-bold text-apa-ink">{n}</span>
        <h1 className="text-xl font-bold text-apa-navy sm:text-2xl">{title}</h1>
      </div>
      <p className="mt-2 text-sm text-apa-grey">{desc}</p>
      <div className="apa-rule my-5" />
      {children}
    </div>
  );
}

function ReviewCard({ title, rows, onEdit }: { title: string; rows: [string, string][]; onEdit: () => void }) {
  return (
    <div className="rounded-xl border border-apa-line bg-apa-soft/30 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-apa-green">{title}</h3>
        <button type="button" onClick={onEdit} className="text-xs font-semibold text-apa-grey hover:text-apa-green">Edit</button>
      </div>
      <dl className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-2">
        {rows.filter(([, v]) => v).map(([k, v]) => (
          <div key={k} className="flex gap-2 text-xs">
            <dt className="shrink-0 font-semibold text-apa-grey">{k}:</dt><dd className="text-apa-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
