'use client';

import { useMemo, useState } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import {
  RELATIONSHIP_GROUPS, DEFAULT_RELATIONSHIP, INTEREST_AREAS, relationshipById,
} from '@/domain/onboarding/personas';

/**
 * APA intelligent onboarding — a progressive registration journey that
 * personalizes the platform. Step 1 captures identity + the APA relationship
 * (with a live contextual hint); step 2 collects interest areas; then the
 * account is created and the user lands on a persona-specific dashboard.
 *
 * The relationship is a personalization signal only — platformRole stays USER.
 */
export function OnboardingForm({ locale, redirectTo = '/app' }: { locale: string; redirectTo?: string }) {
  const fr = locale !== 'en';
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [relationship, setRelationship] = useState(DEFAULT_RELATIONSHIP);
  const [interests, setInterests] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const rel = useMemo(() => relationshipById(relationship), [relationship]);

  const t = {
    title: fr ? 'Créez votre compte' : 'Create your account',
    have: fr ? 'Vous avez déjà un compte ?' : 'Already have an account?',
    signInHere: fr ? 'Se connecter' : 'Sign in here',
    name: fr ? 'Nom complet' : 'Full name',
    email: fr ? 'Adresse e-mail' : 'Email address',
    password: fr ? 'Mot de passe' : 'Password',
    confirm: fr ? 'Confirmer le mot de passe' : 'Confirm password',
    relationship: fr ? 'Quelle est votre relation ou votre intérêt avec APA ?' : 'What is your relationship or interest with APA?',
    passwordHint: fr ? '10 caractères minimum.' : 'Minimum 10 characters.',
    continue: fr ? 'Continuer' : 'Continue',
    back: fr ? '← Retour' : '← Back',
    step: fr ? 'Étape' : 'Step',
    of: fr ? 'sur' : 'of',
    interestTitle: fr ? 'Qu’aimeriez-vous explorer en premier ?' : 'What would you like to explore first?',
    interestSub: fr ? 'Sélectionnez ce qui compte pour vous — nous personnalisons votre tableau de bord. (Optionnel)' : 'Pick what matters to you — we’ll tailor your dashboard. (Optional)',
    createAccount: fr ? 'Créer mon compte' : 'Create my account',
    mismatch: fr ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.',
    tooShort: fr ? 'Le mot de passe doit contenir au moins 10 caractères.' : 'Password must be at least 10 characters.',
    exists: fr ? 'Un compte existe déjà avec cet e-mail.' : 'An account already exists with this email.',
    generic: fr ? 'Une erreur est survenue. Réessayez.' : 'Something went wrong. Please try again.',
    personalizes: fr ? 'Cela personnalise votre espace APA.' : 'This personalizes your APA workspace.',
  };

  function toStep2(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 10) { setError(t.tooShort); return; }
    if (password !== confirm) { setError(t.mismatch); return; }
    setStep(1);
  }

  function toggleInterest(id: string) {
    setInterests((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  async function createAccount() {
    setError(null);
    setPending(true);
    const res = await authClient.signUp.email({
      name, email, password,
      // Personalization signals — never authorization.
      apaRelationship: relationship,
      apaInterests: interests.join(','),
    } as Parameters<typeof authClient.signUp.email>[0]);
    setPending(false);
    if (res.error) {
      setError(res.error.status === 422 ? t.exists : t.generic);
      setStep(0);
      return;
    }
    router.push(`${redirectTo}?welcome=1`);
    router.refresh();
  }

  const input =
    'mt-1 w-full rounded-lg border border-apa-line px-4 py-3 text-sm text-apa-ink transition-colors focus:border-apa-green focus:outline-none focus:ring-2 focus:ring-apa-green/20';

  return (
    <div className="w-full">
      {/* Progress */}
      <div className="mb-6 flex items-center gap-3">
        {[0, 1].map((i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-apa-green' : 'bg-apa-line'}`} />
        ))}
        <span className="text-xs font-bold text-apa-grey">{t.step} {step + 1} {t.of} 2</span>
      </div>

      <h1 className="text-3xl font-bold text-apa-navy">{t.title}</h1>
      <p className="mt-1.5 text-sm text-apa-grey">
        {t.have}{' '}
        <Link href="/sign-in" className="font-semibold text-apa-green hover:underline">{t.signInHere}</Link>
      </p>

      {step === 0 ? (
        <form onSubmit={toStep2} className="mt-7 space-y-4">
          <label className="block text-sm font-semibold text-apa-ink">
            {t.name}
            <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" className={input} placeholder={t.name} />
          </label>
          <label className="block text-sm font-semibold text-apa-ink">
            {t.email}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className={input} placeholder="you@organization.org" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-apa-ink">
              {t.password}
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={10} autoComplete="new-password" className={input} placeholder="••••••••••" />
            </label>
            <label className="block text-sm font-semibold text-apa-ink">
              {t.confirm}
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={10} autoComplete="new-password" className={input} placeholder="••••••••••" />
            </label>
          </div>
          <p className="text-xs text-apa-grey">{t.passwordHint}</p>

          {/* Relationship selector — grouped, with live hint */}
          <div>
            <label className="block text-sm font-semibold text-apa-ink" htmlFor="apa-relationship">{t.relationship}</label>
            <select
              id="apa-relationship"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className={`${input} appearance-none bg-white`}
            >
              {RELATIONSHIP_GROUPS.map((g, gi) =>
                g.labelEn ? (
                  <optgroup key={gi} label={fr ? g.labelFr : g.labelEn}>
                    {g.options.map((o) => (
                      <option key={o.id} value={o.id}>{fr ? o.labelFr : o.labelEn}</option>
                    ))}
                  </optgroup>
                ) : (
                  g.options.map((o) => (
                    <option key={o.id} value={o.id}>{fr ? o.labelFr : o.labelEn}</option>
                  ))
                )
              )}
            </select>
            {/* Live contextual hint */}
            <div className="mt-2 rounded-lg border border-apa-mint bg-apa-soft px-4 py-3 text-sm text-apa-ink">
              <span aria-hidden className="mr-1.5">💡</span>
              {fr ? rel.hintFr : rel.hintEn}
              {rel.requiresVerification ? (
                <span className="mt-1 block text-xs font-semibold text-apa-bronze">
                  {fr ? 'Rôle équipe — accès activé après vérification par APA.' : 'Team role — access activated after APA verification.'}
                </span>
              ) : null}
            </div>
          </div>

          {error ? <p role="alert" className="apa-box apa-box-gold p-3 text-sm text-apa-ink">{error}</p> : null}

          <button type="submit" className="w-full rounded-lg bg-apa-green px-4 py-3.5 text-sm font-bold text-white transition-colors hover:bg-apa-green-mid">
            {t.continue} →
          </button>
        </form>
      ) : (
        <div className="mt-7">
          <h2 className="text-lg font-bold text-apa-navy">{t.interestTitle}</h2>
          <p className="mt-1 text-sm text-apa-grey">{t.interestSub}</p>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {INTEREST_AREAS.map((a) => {
              const on = interests.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggleInterest(a.id)}
                  aria-pressed={on}
                  className={`flex items-center gap-2.5 rounded-lg border px-3 py-3 text-left text-sm font-semibold transition-all ${
                    on ? 'border-apa-green bg-apa-green/10 text-apa-green' : 'border-apa-line text-apa-navy hover:border-apa-green'
                  }`}
                >
                  <span className="text-lg">{a.icon}</span>
                  <span>{fr ? a.labelFr : a.labelEn}</span>
                  {on ? <span className="ml-auto text-apa-green">✓</span> : null}
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-lg border border-apa-mint bg-apa-soft px-4 py-3 text-sm text-apa-ink">
            <span aria-hidden className="mr-1.5">{relationshipById(relationship).persona === 'PARTICIPANT' ? '🧭' : '✦'}</span>
            {fr ? `Vous rejoignez APA en tant que « ${rel.labelFr} ». ${t.personalizes}` : `You’re joining APA as “${rel.labelEn}”. ${t.personalizes}`}
          </div>

          {error ? <p role="alert" className="apa-box apa-box-gold mt-4 p-3 text-sm text-apa-ink">{error}</p> : null}

          <div className="mt-6 flex items-center gap-3">
            <button type="button" onClick={() => setStep(0)} className="rounded-lg border border-apa-line px-4 py-3 text-sm font-semibold text-apa-grey hover:border-apa-green hover:text-apa-green">
              {t.back}
            </button>
            <button type="button" onClick={createAccount} disabled={pending} className="flex-1 rounded-lg bg-apa-green px-4 py-3.5 text-sm font-bold text-white transition-colors hover:bg-apa-green-mid disabled:opacity-60">
              {pending ? '…' : t.createAccount}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
