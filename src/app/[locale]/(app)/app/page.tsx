export const dynamic = 'force-dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link, redirect } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { DemoBanner } from '@/components/site/demo-banner';
import { DEMO_MODE, DEMO_USER } from '@/lib/demo';

interface AppCard {
  title: string;
  desc: string;
  cta: string;
  href: string;
}

export default async function AppHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getSession();
  const demo = !session && DEMO_MODE;
  if (!session && !DEMO_MODE) redirect({ href: '/sign-in', locale });

  const t = await getTranslations('AppHome');
  const user = session?.user ?? DEMO_USER;
  const role = (user as { platformRole?: string }).platformRole ?? 'USER';
  const cards = t.raw('cards') as AppCard[];
  const isFr = locale !== 'en';

  let championApp: { status: string } | null = null;
  if (session) {
    const { prisma } = await import('@/infrastructure/prisma/client');
    championApp = await prisma.championApplication.findUnique({
      where: { userId_type: { userId: user.id, type: 'CHAMPION' } },
      select: { status: true },
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {demo ? <DemoBanner locale={locale} /> : null}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-apa-green sm:text-3xl">
            {t('welcome', { name: user.name })}
          </h1>
          <div className="apa-rule my-4" />
          <p className="text-sm text-apa-grey">{t('subtitle')}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-apa-navy">
            {t('roleLabel')} ·{' '}
            <span className="rounded bg-apa-soft px-2 py-0.5 text-apa-green">
              {t(`roles.${role}`)}
            </span>
          </p>
        </div>
        {demo ? null : <SignOutButton />}
      </div>

      <h2 className="mt-12 text-xl font-bold text-apa-green">{t('nextTitle')}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group rounded-apa-lg border border-apa-line bg-white p-6 transition-shadow hover:shadow-md"
          >
            <h3 className="font-bold text-apa-navy group-hover:text-apa-green">
              {c.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-apa-grey">{c.desc}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-apa-gold">
              {c.cta} →
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

      <p className="apa-box mt-10 p-4 text-sm text-apa-ink">{t('engineNote')}</p>
    </div>
  );
}
