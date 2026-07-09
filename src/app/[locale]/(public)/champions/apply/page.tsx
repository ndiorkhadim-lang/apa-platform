export const dynamic = 'force-dynamic';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { dbAvailable } from '@/infrastructure/prisma/client';
import { DBNotReady } from '@/components/site/db-not-ready';
import { prisma } from '@/infrastructure/prisma/client';
import { ChampionApplicationForm } from '@/components/champions/application-form';
import { GLOBAL_HUBS } from '@/domain/about/leadership';
import type { ApplicationType } from '@/generated/prisma/client';
import type { DraftInput } from './actions';

const REGION_LABEL: Record<string, { en: string; fr: string }> = {
  West: { en: 'West Africa', fr: 'Afrique de l’Ouest' },
  East: { en: 'East Africa', fr: 'Afrique de l’Est' },
  Central: { en: 'Central Africa', fr: 'Afrique Centrale' },
  North: { en: 'North Africa', fr: 'Afrique du Nord' },
  Southern: { en: 'Southern Africa', fr: 'Afrique Australe' },
};

const COPY: Record<ApplicationType, { fr: { title: string; sub: string }; en: { title: string; sub: string } }> = {
  CHAMPION: {
    fr: {
      title: 'Candidature — Programme Champions APA™',
      sub: 'Dossier professionnel en 5 sections. Enregistrez votre brouillon et reprenez à tout moment ; à la soumission, votre dossier entre en présélection (réponse sous 10 jours ouvrés).',
    },
    en: {
      title: 'Application — APA™ Champions Program',
      sub: 'Professional file in 5 sections. Save your draft and resume anytime; on submission your file enters screening (answer within 10 business days).',
    },
  },
  ADVISOR: {
    fr: {
      title: 'Candidature — Conseil Consultatif Mondial APA™',
      sub: 'Rejoignez le Conseil qui oriente la stratégie d’APA. Dossier professionnel en 5 sections, brouillon récupérable ; réponse du comité sous 10 jours ouvrés.',
    },
    en: {
      title: 'Application — APA™ Global Advisory Board',
      sub: 'Join the board that steers APA’s strategy. Professional 5-section file, recoverable draft; committee reply within 10 business days.',
    },
  },
};

const GATE = {
  fr: {
    title: 'Créez votre compte pour candidater',
    body: 'Votre candidature est liée à votre compte APA : brouillon récupérable, suivi de statut en temps réel (présélection → entretien → décision) et onboarding numérique si vous êtes retenu·e.',
    cta: 'Créer un compte gratuit',
    cta2: 'Déjà un compte ? Se connecter',
  },
  en: {
    title: 'Create your account to apply',
    body: 'Your application is tied to your APA account: recoverable draft, real-time status tracking (screening → interview → decision) and digital onboarding if selected.',
    cta: 'Create a free account',
    cta2: 'Already have an account? Sign in',
  },
} as const;

export default async function ApplyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!dbAvailable) return <DBNotReady locale={locale} />;
  const sp = await searchParams;
  const type: ApplicationType = sp.type === 'advisor' ? 'ADVISOR' : 'CHAMPION';
  const c = COPY[type][locale === 'en' ? 'en' : 'fr'];
  const g = GATE[locale === 'en' ? 'en' : 'fr'];
  const applyPath = `/champions/apply${type === 'ADVISOR' ? '?type=advisor' : ''}`;

  const session = await getSession();

  const [app, nations] = await Promise.all([
    session
      ? prisma.championApplication.findUnique({
          where: { userId_type: { userId: session.user.id, type } },
        })
      : null,
    prisma.nation.findMany({
      orderBy: locale === 'en' ? { nameEn: 'asc' } : { nameFr: 'asc' },
      select: { code: true, nameEn: true, nameFr: true },
    }),
  ]);

  const initial: DraftInput = app
    ? Object.fromEntries(
        Object.entries(app).filter(
          ([k, v]) =>
            v !== null &&
            !['id', 'userId', 'type', 'status', 'submittedAt', 'createdAt', 'updatedAt'].includes(k)
        )
      )
    : { email: session?.user.email };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold text-apa-green sm:text-3xl">{c.title}</h1>
      <div className="apa-rule my-4" />
      <p className="text-sm text-apa-grey">{c.sub}</p>

      {/* Sign-in prompt for anonymous visitors — the form stays fully visible below */}
      {!session ? (
        <div className="apa-box apa-box-gold mt-6 flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-sm text-apa-ink">
            <span className="font-bold text-apa-green">{g.title}.</span> {g.body}
          </p>
          <div className="flex shrink-0 gap-2">
            <Link
              href={`/sign-up?redirect=${applyPath}`}
              className="rounded-md bg-apa-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-apa-green-mid"
            >
              {g.cta}
            </Link>
            <Link
              href={`/sign-in?redirect=${applyPath}`}
              className="rounded-md border border-apa-green px-4 py-2 text-sm font-semibold text-apa-green transition-colors hover:bg-apa-green hover:text-white"
            >
              {g.cta2}
            </Link>
          </div>
        </div>
      ) : null}

      <div className="mt-8">
        <ChampionApplicationForm
          locale={locale}
          type={type}
          authenticated={Boolean(session)}
          signInHref={`/sign-in?redirect=${applyPath}`}
          initial={initial}
          submitted={Boolean(app && app.status !== 'DRAFT')}
          nations={nations.map((n) => ({
            code: n.code,
            name: locale === 'en' ? n.nameEn : n.nameFr,
          }))}
          hubs={GLOBAL_HUBS.map((h) => ({ code: h.code, label: `${h.flag} ${h.city}` }))}
          regions={Object.values(REGION_LABEL).map((r) => (locale === 'en' ? r.en : r.fr))}
        />
      </div>
    </div>
  );
}
