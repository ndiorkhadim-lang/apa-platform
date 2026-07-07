import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/infrastructure/prisma/client';
import { ChampionApplicationForm } from '@/components/champions/application-form';
import { GLOBAL_HUBS } from '@/domain/about/leadership';
import type { DraftInput } from './actions';

const REGION_LABEL: Record<string, { en: string; fr: string }> = {
  West: { en: 'West Africa', fr: 'Afrique de l’Ouest' },
  East: { en: 'East Africa', fr: 'Afrique de l’Est' },
  Central: { en: 'Central Africa', fr: 'Afrique Centrale' },
  North: { en: 'North Africa', fr: 'Afrique du Nord' },
  Southern: { en: 'Southern Africa', fr: 'Afrique Australe' },
};

const COPY = {
  fr: {
    title: 'Candidature — Programme Champions APA™',
    sub: 'Dossier professionnel en 5 sections. Enregistrez votre brouillon et reprenez à tout moment ; à la soumission, votre dossier entre en présélection (réponse sous 10 jours ouvrés).',
    gateTitle: 'Créez votre compte pour candidater',
    gateBody: 'Votre candidature est liée à votre compte APA : brouillon récupérable, suivi de statut en temps réel (présélection → entretien → décision) et onboarding numérique si vous êtes retenu·e.',
    gateCta: 'Créer un compte gratuit',
    gateCta2: 'Déjà un compte ? Se connecter',
  },
  en: {
    title: 'Application — APA™ Champions Program',
    sub: 'Professional file in 5 sections. Save your draft and resume anytime; on submission your file enters screening (answer within 10 business days).',
    gateTitle: 'Create your account to apply',
    gateBody: 'Your application is tied to your APA account: recoverable draft, real-time status tracking (screening → interview → decision) and digital onboarding if selected.',
    gateCta: 'Create a free account',
    gateCta2: 'Already have an account? Sign in',
  },
} as const;

export default async function ChampionApplyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = COPY[locale === 'en' ? 'en' : 'fr'];

  const session = await getSession();

  const [app, nations] = await Promise.all([
    session
      ? prisma.championApplication.findUnique({ where: { userId: session.user.id } })
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
            !['id', 'userId', 'status', 'submittedAt', 'createdAt', 'updatedAt'].includes(k)
        )
      )
    : { email: session?.user.email };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold text-apa-green sm:text-3xl">{c.title}</h1>
      <div className="apa-rule my-4" />
      <p className="text-sm text-apa-grey">{c.sub}</p>

      <div className="mt-8">
        {session ? (
          <ChampionApplicationForm
            locale={locale}
            initial={initial}
            submitted={Boolean(app && app.status !== 'DRAFT')}
            nations={nations.map((n) => ({
              code: n.code,
              name: locale === 'en' ? n.nameEn : n.nameFr,
            }))}
            hubs={GLOBAL_HUBS.map((h) => ({ code: h.code, label: `${h.flag} ${h.city}` }))}
            regions={Object.values(REGION_LABEL).map((r) => (locale === 'en' ? r.en : r.fr))}
          />
        ) : (
          <div className="apa-gradient rounded-apa-lg p-8 text-white">
            <h2 className="text-xl font-bold">{c.gateTitle}</h2>
            <p className="mt-3 max-w-xl text-sm text-apa-mint">{c.gateBody}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/sign-up?redirect=/champions/apply"
                className="rounded-md bg-apa-gold-bright px-5 py-2.5 text-sm font-semibold text-apa-ink transition-colors hover:bg-apa-gold"
              >
                {c.gateCta} →
              </Link>
              <Link
                href="/sign-in?redirect=/champions/apply"
                className="rounded-md border border-apa-gold-bright px-5 py-2.5 text-sm font-semibold text-apa-gold-bright transition-colors hover:bg-apa-gold-bright hover:text-apa-ink"
              >
                {c.gateCta2}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
