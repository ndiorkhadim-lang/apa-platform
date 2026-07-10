export const dynamic = 'force-dynamic';
import { setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { DemoBanner } from '@/components/site/demo-banner';
import { DEMO_MODE, DEMO_USER } from '@/lib/demo';
import { INTEREST_AREAS } from '@/domain/onboarding/personas';
import {
  SWITCHER_ORDER, PROFILE_MAP, pick,
  profileForRelationship, profileById,
} from '@/domain/onboarding/profiles';
import { RoleDashboard } from '@/components/dashboard/RoleDashboard';
import { DashboardSwitcher } from '@/components/dashboard/DashboardSwitcher';

export default async function AppHomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const session = await getSession();
  const demo = !session && DEMO_MODE;
  if (!session && !DEMO_MODE) redirect({ href: '/sign-in', locale });

  const isFr = locale !== 'en';
  const user = session?.user ?? DEMO_USER;
  const role = (user as { platformRole?: string }).platformRole ?? 'USER';
  const relationshipId = (user as { apaRelationship?: string }).apaRelationship ?? null;
  const interestsRaw = (user as { apaInterests?: string }).apaInterests ?? '';
  const welcome = sp.welcome === '1';
  const chosenInterests = INTEREST_AREAS.filter((a) => interestsRaw.split(',').includes(a.id));

  // Who may use the Demo Dashboard Switcher: administrators, or anyone in demo mode.
  const canSwitch = demo || role === 'ADMIN_APA';
  const asParam = typeof sp.as === 'string' ? sp.as : undefined;
  const previewing = Boolean(canSwitch && asParam && PROFILE_MAP.has(asParam));

  // Resolve the active profile: an admin/demo preview (?as=) wins, otherwise
  // the user's declared relationship → profile (default: participant).
  const profile = previewing
    ? profileById(asParam)!
    : profileForRelationship(relationshipId);

  const switchItems = SWITCHER_ORDER.map((id) => {
    const p = PROFILE_MAP.get(id)!;
    return { id: p.id, label: pick(p.label, isFr), icon: p.icon, group: pick(p.group, isFr) };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {demo ? <DemoBanner locale={locale} /> : null}

      {/* Preview banner when an admin/demo user is impersonating a profile */}
      {previewing ? (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-apa-lg border border-apa-navy bg-apa-navy/5 px-4 py-3">
          <p className="text-sm text-apa-ink">
            <span className="mr-2 rounded bg-apa-navy px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">🎭 {isFr ? 'Aperçu' : 'Preview'}</span>
            {isFr ? 'Vous prévisualisez le tableau de bord de : ' : 'You’re previewing the dashboard for: '}
            <strong className="text-apa-navy">{pick(profile.label, isFr)}</strong>
          </p>
          <a href={`/${locale}/app`} className="text-xs font-semibold text-apa-green hover:underline">
            {isFr ? '← Revenir à mon profil' : '← Back to my profile'}
          </a>
        </div>
      ) : null}

      {/* Welcome celebration after signup */}
      {welcome && !previewing ? (
        <div className="mb-6 rounded-apa-lg border border-apa-green bg-apa-green/5 px-5 py-4">
          <p className="text-sm font-bold text-apa-green">
            🎉 {isFr ? `Bienvenue chez APA, ${user.name.split(' ')[0]} !` : `Welcome to APA, ${user.name.split(' ')[0]}!`}
          </p>
          <p className="mt-1 text-sm text-apa-ink">
            {isFr ? 'Votre espace est personnalisé selon votre profil.' : 'Your workspace is personalized to your profile.'}
          </p>
        </div>
      ) : null}

      {/* Persona hero */}
      <div className="overflow-hidden rounded-apa-lg border border-apa-line">
        <div className="apa-gradient flex flex-wrap items-start justify-between gap-4 px-6 py-8 text-white sm:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide">
              <span>{profile.icon}</span> {pick(profile.badge, isFr)}
            </span>
            <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{pick(profile.title, isFr)}</h1>
            <p className="mt-2 max-w-xl text-sm text-apa-mint">{pick(profile.subtitle, isFr)}</p>
            <p className="mt-3 text-xs text-apa-sage">
              {isFr ? 'Connecté·e en tant que' : 'Signed in as'}{' '}
              <strong className="text-white">{previewing ? pick(profile.label, isFr) : user.name}</strong>
            </p>
          </div>
          {demo ? null : <SignOutButton />}
        </div>
      </div>

      {/* Chosen interests (only on the user's own dashboard) */}
      {chosenInterests.length && !previewing ? (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase text-apa-grey">{isFr ? 'Vos centres d’intérêt' : 'Your interests'}:</span>
          {chosenInterests.map((a) => (
            <span key={a.id} className="rounded-full border border-apa-sage bg-apa-soft px-3 py-1 text-xs font-semibold text-apa-green">
              {a.icon} {isFr ? a.labelFr : a.labelEn}
            </span>
          ))}
        </div>
      ) : null}

      {/* The Role-Based Experience dashboard */}
      <div className="mt-8">
        <RoleDashboard profile={profile} locale={locale} userName={user.name} />
      </div>

      {/* Admin/demo-only Demo Dashboard Switcher */}
      <DashboardSwitcher items={switchItems} currentId={profile.id} locale={locale} enabled={canSwitch} />
    </div>
  );
}
