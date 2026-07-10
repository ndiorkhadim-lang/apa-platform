export const dynamic = 'force-dynamic';
import { setRequestLocale } from 'next-intl/server';
import { Link, redirect } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { DemoBanner } from '@/components/site/demo-banner';
import { DEMO_MODE, DEMO_USER } from '@/lib/demo';
import { PERSONAS, relationshipById, INTEREST_AREAS } from '@/domain/onboarding/personas';

const ACCENT: Record<string, string> = {
  green: 'border-apa-green/40',
  gold: 'border-apa-gold',
  navy: 'border-apa-navy/40',
};

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
  const rel = relationshipById(relationshipId);
  const persona = PERSONAS[rel.persona];
  const welcome = sp.welcome === '1';
  const chosenInterests = INTEREST_AREAS.filter((a) => interestsRaw.split(',').includes(a.id));

  let championApp: { status: string } | null = null;
  if (session) {
    const { prisma } = await import('@/infrastructure/prisma/client');
    championApp = await prisma.championApplication.findUnique({
      where: { userId_type: { userId: user.id, type: 'CHAMPION' } },
      select: { status: true },
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {demo ? <DemoBanner locale={locale} /> : null}

      {/* Welcome celebration after signup */}
      {welcome ? (
        <div className="mb-6 rounded-apa-lg border border-apa-green bg-apa-green/5 px-5 py-4">
          <p className="text-sm font-bold text-apa-green">
            🎉 {isFr ? `Bienvenue chez APA, ${user.name.split(' ')[0]} !` : `Welcome to APA, ${user.name.split(' ')[0]}!`}
          </p>
          <p className="mt-1 text-sm text-apa-ink">
            {isFr
              ? 'Votre espace est personnalisé selon votre profil. Voici par où commencer.'
              : 'Your workspace is personalized to your profile. Here’s where to begin.'}
          </p>
        </div>
      ) : null}

      {/* Persona hero */}
      <div className="overflow-hidden rounded-apa-lg border border-apa-line">
        <div className="apa-gradient flex flex-wrap items-start justify-between gap-4 px-6 py-8 text-white sm:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide">
              <span>{persona.icon}</span> {isFr ? persona.badgeFr : persona.badgeEn}
            </span>
            <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
              {isFr ? persona.titleFr : persona.titleEn}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-apa-mint">
              {isFr ? persona.subtitleFr : persona.subtitleEn}
            </p>
            <p className="mt-3 text-xs text-apa-sage">
              {isFr ? 'Connecté·e en tant que' : 'Signed in as'} <strong className="text-white">{user.name}</strong>
            </p>
          </div>
          {demo ? null : <SignOutButton />}
        </div>
      </div>

      {/* Team verification notice */}
      {rel.requiresVerification ? (
        <div className="apa-box apa-box-gold mt-4 p-4 text-sm">
          <strong className="text-apa-navy">{isFr ? 'Accès équipe en attente de vérification.' : 'Team access pending verification.'}</strong>{' '}
          {isFr
            ? `Vous vous êtes déclaré·e « ${rel.labelFr} ». Un administrateur APA activera les consoles privilégiées après vérification. En attendant, vous pouvez explorer en aperçu.`
            : `You declared yourself “${rel.labelEn}”. An APA administrator will activate privileged consoles after verification. Meanwhile you can explore in preview.`}
        </div>
      ) : null}

      {/* Chosen interests */}
      {chosenInterests.length ? (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase text-apa-grey">{isFr ? 'Vos centres d’intérêt' : 'Your interests'}:</span>
          {chosenInterests.map((a) => (
            <span key={a.id} className="rounded-full border border-apa-sage bg-apa-soft px-3 py-1 text-xs font-semibold text-apa-green">
              {a.icon} {isFr ? a.labelFr : a.labelEn}
            </span>
          ))}
        </div>
      ) : null}

      {/* Persona quick actions */}
      <h2 className="mt-10 text-xl font-bold text-apa-green">{isFr ? 'Vos prochaines étapes' : 'Your next steps'}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {persona.cards.map((c) => (
          <Link
            key={c.href + c.titleEn}
            href={c.href}
            className={`group rounded-apa-lg border bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-md ${ACCENT[c.accent ?? 'green']}`}
          >
            <h3 className="font-bold text-apa-navy group-hover:text-apa-green">
              {isFr ? c.titleFr : c.titleEn}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-apa-grey">{isFr ? c.descFr : c.descEn}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-apa-gold">
              {isFr ? c.ctaFr : c.ctaEn} →
            </span>
          </Link>
        ))}
      </div>

      {/* Champion application tracking */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/champions/apply"
          className="group rounded-apa-lg border border-apa-gold bg-white p-6 transition-shadow hover:shadow-md"
        >
          <h3 className="font-bold text-apa-navy group-hover:text-apa-green">
            {isFr ? 'Ma candidature Champion' : 'My Champion application'}
          </h3>
          <p className="mt-2 text-sm text-apa-grey">
            {championApp
              ? (isFr ? 'Statut actuel : ' : 'Current status: ') + championApp.status
              : isFr
                ? 'Aucune candidature — le programme recrute dans 54 nations.'
                : 'No application yet — the program recruits across 54 nations.'}
          </p>
          <span className="mt-3 inline-block text-sm font-semibold text-apa-gold">
            {championApp
              ? isFr ? 'Voir mon dossier' : 'View my file'
              : isFr ? 'Candidater' : 'Apply'}{' '}
            →
          </span>
        </Link>

        {role === 'ADMIN_APA' ? (
          <Link
            href="/app/admin/champions"
            className="group rounded-apa-lg border border-apa-navy bg-white p-6 transition-shadow hover:shadow-md"
          >
            <h3 className="font-bold text-apa-navy group-hover:text-apa-green">
              {isFr ? 'Admin — Candidatures Champions' : 'Admin — Champion applications'}
            </h3>
            <p className="mt-2 text-sm text-apa-grey">
              {isFr
                ? 'Pipeline de recrutement : filtrer, évaluer, décider, exporter.'
                : 'Recruitment pipeline: filter, score, decide, export.'}
            </p>
            <span className="mt-3 inline-block text-sm font-semibold text-apa-gold">
              {isFr ? 'Ouvrir le pipeline' : 'Open the pipeline'} →
            </span>
          </Link>
        ) : null}
      </div>

      <p className="apa-box mt-10 p-4 text-sm text-apa-ink">
        {isFr
          ? 'Astuce : votre relation avec APA personnalise ce tableau de bord. Vous pouvez la mettre à jour à tout moment depuis votre profil.'
          : 'Tip: your relationship with APA personalizes this dashboard. You can update it anytime from your profile.'}
      </p>
    </div>
  );
}
