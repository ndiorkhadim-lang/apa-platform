'use client';

import { useMemo, useState, useTransition } from 'react';
import { saveDraft, submitApplication, type DraftInput } from '@/app/[locale]/(public)/champions/apply/actions';

type L = 'fr' | 'en';

const T = {
  fr: {
    sections: {
      personal: 'Informations personnelles',
      professional: 'Profil professionnel',
      motivation: 'Motivation APA',
      documents: 'Documents (liens)',
      declarations: 'Déclarations & signature',
    },
    f: {
      firstName: 'Prénom *', lastName: 'Nom *', gender: 'Genre', dateOfBirth: 'Date de naissance',
      nationality: 'Nationalité *', countryResidence: 'Pays de résidence *', city: 'Ville *',
      regionalHub: 'Hub mondial de rattachement', preferredRegion: 'Région de travail préférée',
      phone: 'Téléphone *', email: 'Email *', linkedin: 'LinkedIn', website: 'Site web',
      position: 'Poste actuel *', organization: 'Organisation *', industry: 'Secteur',
      yearsExperience: "Années d'expérience *", education: 'Diplôme le plus élevé *',
      certifications: 'Certifications professionnelles', languages: 'Langues parlées *',
      expertise: "Domaines d'expertise *",
      motivationWhy: 'Pourquoi voulez-vous devenir Champion APA ? *',
      motivationLeadership: 'Décrivez votre expérience de leadership. *',
      motivationImpact: 'Décrivez votre impact dans votre communauté. *',
      motivationValue: "Quelle valeur apporterez-vous à APA ? *",
      cvUrl: 'CV (lien Drive/LinkedIn) *', coverLetterUrl: 'Lettre de motivation (lien)',
      idDocUrl: "Pièce d'identité (lien)", certificatesUrl: 'Certifications (lien)',
      recommendationUrl: 'Lettres de recommandation (lien, facultatif)', portfolioUrl: 'Portfolio (lien, facultatif)',
      signature: 'Signature électronique (tapez votre nom complet) *',
    },
    genders: ['Femme', 'Homme', 'Autre / préfère ne pas dire'],
    decl: {
      ethics: "J'accepte le Code d'Éthique APA (mandats #25, #55 — anti-représailles & narration éthique).",
      privacy: "J'accepte la Politique de Confidentialité (données traitées pour la seule sélection).",
      resp: "J'accepte les Responsabilités du Champion (représentation, intégrité, disponibilité).",
    },
    wordBudget: 'Budget total motivation : {n}/1000 mots',
    saveDraft: 'Enregistrer le brouillon',
    saved: 'Brouillon enregistré — reprenez quand vous voulez.',
    submit: 'Soumettre ma candidature',
    submitting: 'Soumission…',
    missing: 'Champs requis manquants :',
    words: 'Motivation trop longue : {n} mots (max 1000).',
    docsNote: "Le dépôt direct de fichiers s'active avec le stockage sécurisé S3 ; en attendant, partagez des liens (Drive, Dropbox…).",
  },
  en: {
    sections: {
      personal: 'Personal information',
      professional: 'Professional profile',
      motivation: 'APA motivation',
      documents: 'Documents (links)',
      declarations: 'Declarations & signature',
    },
    f: {
      firstName: 'First name *', lastName: 'Last name *', gender: 'Gender', dateOfBirth: 'Date of birth',
      nationality: 'Nationality *', countryResidence: 'Country of residence *', city: 'City *',
      regionalHub: 'Global hub affiliation', preferredRegion: 'Preferred working region',
      phone: 'Phone *', email: 'Email *', linkedin: 'LinkedIn', website: 'Website',
      position: 'Current position *', organization: 'Organization *', industry: 'Industry',
      yearsExperience: 'Years of experience *', education: 'Highest education *',
      certifications: 'Professional certifications', languages: 'Languages spoken *',
      expertise: 'Areas of expertise *',
      motivationWhy: 'Why do you want to become an APA Champion? *',
      motivationLeadership: 'Describe your leadership experience. *',
      motivationImpact: 'Describe your impact in your community. *',
      motivationValue: 'What value will you bring to APA? *',
      cvUrl: 'CV (Drive/LinkedIn link) *', coverLetterUrl: 'Cover letter (link)',
      idDocUrl: 'Identity document (link)', certificatesUrl: 'Certifications (link)',
      recommendationUrl: 'Recommendation letters (link, optional)', portfolioUrl: 'Portfolio (link, optional)',
      signature: 'Electronic signature (type your full name) *',
    },
    genders: ['Female', 'Male', 'Other / prefer not to say'],
    decl: {
      ethics: 'I accept the APA Code of Ethics (mandates #25, #55 — anti-retaliation & ethical storytelling).',
      privacy: 'I accept the Privacy Policy (data processed for selection only).',
      resp: 'I accept the Champion Responsibilities (representation, integrity, availability).',
    },
    wordBudget: 'Total motivation budget: {n}/1000 words',
    saveDraft: 'Save draft',
    saved: 'Draft saved — resume anytime.',
    submit: 'Submit my application',
    submitting: 'Submitting…',
    missing: 'Missing required fields:',
    words: 'Motivation too long: {n} words (max 1000).',
    docsNote: 'Direct file upload activates with secure S3 storage; meanwhile share links (Drive, Dropbox…).',
  },
} as const;

const inputCls =
  'mt-1 w-full rounded-md border border-apa-line bg-white px-3 py-2.5 text-sm focus:border-apa-green focus:outline-none focus:ring-2 focus:ring-apa-green/20';

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold text-apa-ink">
      {label}
      {children}
    </label>
  );
}

export function ChampionApplicationForm({
  locale,
  initial,
  nations,
  hubs,
  regions,
  submitted,
}: {
  locale: string;
  initial: DraftInput;
  nations: { code: string; name: string }[];
  hubs: { code: string; label: string }[];
  regions: string[];
  submitted: boolean;
}) {
  const t = T[(locale as L) in T ? (locale as L) : 'fr'];
  const [d, setD] = useState<DraftInput>(initial);
  const [savedMsg, setSavedMsg] = useState(false);
  const [errors, setErrors] = useState<string[] | null>(null);
  const [wordErr, setWordErr] = useState<number | null>(null);
  const [done, setDone] = useState(submitted);
  const [pending, start] = useTransition();

  const words = useMemo(
    () =>
      [d.motivationWhy, d.motivationLeadership, d.motivationImpact, d.motivationValue]
        .filter(Boolean)
        .join(' ')
        .split(/\s+/)
        .filter(Boolean).length,
    [d.motivationWhy, d.motivationLeadership, d.motivationImpact, d.motivationValue]
  );

  const set = (k: keyof DraftInput) => (v: string | number | boolean) => {
    setD((p) => ({ ...p, [k]: v }));
    setSavedMsg(false);
  };

  const text = (k: keyof DraftInput, type = 'text') => (
    <Field label={t.f[k as keyof typeof t.f]}>
      <input
        type={type}
        value={String(d[k] ?? '')}
        onChange={(e) => set(k)(type === 'number' ? Number(e.target.value) : e.target.value)}
        className={inputCls}
      />
    </Field>
  );

  const area = (k: keyof DraftInput, rows = 4) => (
    <Field label={t.f[k as keyof typeof t.f]}>
      <textarea
        rows={rows}
        value={String(d[k] ?? '')}
        onChange={(e) => set(k)(e.target.value)}
        className={inputCls}
      />
    </Field>
  );

  if (done) {
    return (
      <div className="apa-box p-6 text-sm">
        <p className="text-lg font-bold text-apa-green">
          {locale === 'fr' ? '✓ Candidature soumise' : '✓ Application submitted'}
        </p>
        <p className="mt-2 text-apa-ink">
          {locale === 'fr'
            ? "Votre dossier est en cours d'examen. Suivez son statut dans votre espace : Mon espace → Ma candidature Champion."
            : 'Your file is under review. Track its status in your workspace: My workspace → My Champion application.'}
        </p>
      </div>
    );
  }

  function onSave() {
    start(async () => {
      await saveDraft(d, locale);
      setSavedMsg(true);
      setErrors(null);
      setWordErr(null);
    });
  }

  function onSubmit() {
    start(async () => {
      const res = await submitApplication(d, locale);
      if (res.ok) {
        setDone(true);
      } else if ('wordCount' in res && res.wordCount) {
        setWordErr(res.wordCount);
      } else {
        setErrors(res.missing as string[]);
      }
    });
  }

  const section = (title: string) => (
    <h2 className="mt-10 flex items-center gap-3 text-lg font-bold text-apa-green first:mt-0">
      <span className="h-[3px] w-8 bg-apa-gold" />
      {title}
    </h2>
  );

  return (
    <div>
      {section(t.sections.personal)}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {text('firstName')}
        {text('lastName')}
        <Field label={t.f.gender}>
          <select
            value={String(d.gender ?? '')}
            onChange={(e) => set('gender')(e.target.value)}
            className={inputCls}
          >
            <option value="" />
            {t.genders.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </Field>
        {text('dateOfBirth', 'date')}
        {text('nationality')}
        <Field label={t.f.countryResidence}>
          <select
            value={String(d.countryResidence ?? '')}
            onChange={(e) => set('countryResidence')(e.target.value)}
            className={inputCls}
          >
            <option value="" />
            {nations.map((n) => (
              <option key={n.code} value={n.name}>
                {n.name}
              </option>
            ))}
          </select>
        </Field>
        {text('city')}
        <Field label={t.f.regionalHub}>
          <select
            value={String(d.regionalHub ?? '')}
            onChange={(e) => set('regionalHub')(e.target.value)}
            className={inputCls}
          >
            <option value="" />
            {hubs.map((h) => (
              <option key={h.code} value={h.code}>
                {h.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t.f.preferredRegion}>
          <select
            value={String(d.preferredRegion ?? '')}
            onChange={(e) => set('preferredRegion')(e.target.value)}
            className={inputCls}
          >
            <option value="" />
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>
        {text('phone')}
        {text('email', 'email')}
        {text('linkedin')}
        {text('website')}
      </div>

      {section(t.sections.professional)}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {text('position')}
        {text('organization')}
        {text('industry')}
        {text('yearsExperience', 'number')}
        {text('education')}
        {text('certifications')}
        {text('languages')}
        {text('expertise')}
      </div>

      {section(t.sections.motivation)}
      <p className="mt-2 text-xs font-semibold text-apa-grey">
        {t.wordBudget.replace('{n}', String(words))}
      </p>
      <div className="mt-3 space-y-4">
        {area('motivationWhy')}
        {area('motivationLeadership')}
        {area('motivationImpact')}
        {area('motivationValue')}
      </div>

      {section(t.sections.documents)}
      <p className="mt-2 text-xs text-apa-grey">{t.docsNote}</p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {text('cvUrl')}
        {text('coverLetterUrl')}
        {text('idDocUrl')}
        {text('certificatesUrl')}
        {text('recommendationUrl')}
        {text('portfolioUrl')}
      </div>

      {section(t.sections.declarations)}
      <div className="mt-4 space-y-3 text-sm">
        {(
          [
            ['acceptEthics', t.decl.ethics],
            ['acceptPrivacy', t.decl.privacy],
            ['acceptResponsibilities', t.decl.resp],
          ] as const
        ).map(([k, label]) => (
          <label key={k} className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={Boolean(d[k])}
              onChange={(e) => set(k)(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-apa-green"
            />
            <span>{label}</span>
          </label>
        ))}
        <div className="max-w-md">{text('signature')}</div>
      </div>

      {errors?.length ? (
        <p role="alert" className="apa-box apa-box-gold mt-6 p-3 text-sm">
          {t.missing} {errors.join(', ')}
        </p>
      ) : null}
      {wordErr ? (
        <p role="alert" className="apa-box apa-box-gold mt-6 p-3 text-sm">
          {t.words.replace('{n}', String(wordErr))}
        </p>
      ) : null}
      {savedMsg ? <p className="mt-6 text-sm font-semibold text-apa-green">✓ {t.saved}</p> : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={pending}
          className="rounded-md border border-apa-green px-5 py-2.5 text-sm font-semibold text-apa-green transition-colors hover:bg-apa-green hover:text-white disabled:opacity-60"
        >
          {t.saveDraft}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={pending}
          className="rounded-md bg-apa-green px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-apa-green-mid disabled:opacity-60"
        >
          {pending ? t.submitting : t.submit}
        </button>
      </div>
    </div>
  );
}
