import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { OnboardingForm } from '@/components/auth/onboarding-form';

export const metadata: Metadata = { title: 'Create your account — APA' };

export default async function SignUpPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';
  const sp = await searchParams;
  const rawRedirect = typeof sp.redirect === 'string' ? sp.redirect : '/app';
  const redirectTo = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/app';

  const session = await getSession();
  if (session) redirect({ href: redirectTo, locale });

  const bullets = fr
    ? ['Certification GRC vérifiable', 'Parcours immersifs sur 22 nations', 'Intelligence de gouvernance & ACRI', 'Tableau de bord personnalisé selon votre profil']
    : ['Verifiable GRC certification', 'Immersive journeys across 22 nations', 'Governance intelligence & ACRI', 'A dashboard tailored to your profile'];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
      <div className="grid overflow-hidden rounded-2xl border border-apa-line bg-white shadow-xl lg:grid-cols-2">
        {/* Brand / value panel */}
        <div className="apa-gradient relative hidden flex-col justify-between p-10 text-white lg:flex">
          <div>
            <div className="text-2xl font-bold tracking-tight">APA<span className="mx-2 opacity-50">|</span><span className="font-normal">Digital Hub</span></div>
            <h2 className="mt-10 text-3xl font-bold leading-tight">
              {fr ? 'L’onboarding qui personnalise toute la plateforme.' : 'The onboarding that personalizes the entire platform.'}
            </h2>
            <p className="mt-4 max-w-md text-apa-mint">
              {fr
                ? 'Dites-nous qui vous êtes — votre espace APA s’adapte à votre relation avec l’écosystème.'
                : 'Tell us who you are — your APA workspace adapts to your relationship with the ecosystem.'}
            </p>
            <ul className="mt-8 space-y-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-apa-gold-bright">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-apa-sage">© {new Date().getFullYear()} Accountable Partners for Africa™ · theapaafrica.org</p>
        </div>

        {/* Form panel */}
        <div className="p-7 sm:p-10">
          <OnboardingForm locale={locale} redirectTo={redirectTo} />
        </div>
      </div>
    </div>
  );
}
