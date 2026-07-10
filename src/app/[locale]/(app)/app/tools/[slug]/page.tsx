export const dynamic = 'force-dynamic';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link, redirect } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/infrastructure/prisma/client';
import { BLUEPRINTS } from '@/domain/tools/workspace-blueprint';
import { SOLUTIONS, solutionOf, journeyOf } from '@/domain/solutions/ecosystem';
import { ToolWorkspace } from '@/components/tools/tool-workspace';
import { DemoBanner } from '@/components/site/demo-banner';
import { DEMO_MODE } from '@/lib/demo';
import { ensureSession } from './actions';

export default async function ToolWorkspacePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const session = await getSession();
  const demo = !session && DEMO_MODE;
  if (!session && !DEMO_MODE) {
    redirect({ href: `/sign-in?redirect=/app/tools/${slug}`, locale });
  }

  const tool = await prisma.tool.findUnique({
    where: { slug },
    include: { pillar: true },
  });
  if (!tool) notFound();

  const [t, format] = await Promise.all([
    getTranslations('Workspace'),
    getFormatter(),
  ]);
  const isFr = locale === 'fr';
  const blueprint = BLUEPRINTS[tool.category];

  // Ensure a working session and load history + reports (skipped in Demo Mode
  // — sessions are persisted state and stay behind authentication).
  const sessionId = session ? await ensureSession(tool.id) : null;
  const [toolSession, allSessions] = sessionId
    ? await Promise.all([
        prisma.toolSession.findUnique({
          where: { id: sessionId },
          include: { reports: { orderBy: { createdAt: 'desc' } } },
        }),
        prisma.toolSession.findMany({
          where: { userId: session!.user.id, toolId: tool.id },
          orderBy: { updatedAt: 'desc' },
          include: { _count: { select: { reports: true } } },
        }),
      ])
    : [null, []];

  const name = isFr ? tool.nameFr : tool.nameEn;
  const benefits = isFr ? blueprint.benefitsFr : blueprint.benefitsEn;
  const instructions = isFr ? blueprint.instructionsFr : blueprint.instructionsEn;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs font-semibold text-apa-grey">
        <Link href="/tools" className="hover:text-apa-green">
          {t('backToMarketplace')}
        </Link>
        <span> / {tool.pillar.code}</span>
      </nav>

      {/* Overview */}
      <header className="mt-3">
        <span className="text-xs font-bold uppercase tracking-wide text-apa-grey">
          {t('toolNumber', { number: String(tool.number).padStart(2, '0') })}
        </span>
        <h1 className="mt-1 text-2xl font-bold text-apa-green sm:text-3xl">{name}</h1>
        <div className="apa-rule my-4" />
        <p className="max-w-3xl text-sm leading-relaxed text-apa-ink">
          {isFr ? tool.descFr : tool.descEn}
        </p>
      </header>

      {/* Benefits + Instructions */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="apa-box p-5">
          <h2 className="font-bold text-apa-green">{t('benefits')}</h2>
          <ul className="mt-3 space-y-2 text-sm text-apa-ink">
            {benefits.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="text-apa-green">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="apa-box apa-box-gold p-5">
          <h2 className="font-bold text-apa-green">{t('instructions')}</h2>
          <ol className="mt-3 space-y-2 text-sm text-apa-ink">
            {instructions.map((s, i) => (
              <li key={s} className="flex gap-2">
                <span className="font-bold text-apa-gold">{i + 1}.</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Workspace (form + results + export) */}
      <div className="mt-10 rounded-apa-lg border border-apa-line bg-white p-6">
        {sessionId ? (
          <ToolWorkspace
            sessionId={sessionId}
            slug={slug}
            locale={locale}
            toolName={name}
            category={tool.category}
            fields={blueprint.fields}
            initialData={(toolSession?.data as Record<string, unknown>) ?? {}}
            outputKind={blueprint.outputKind}
          />
        ) : (
          <div className="apa-box apa-box-gold p-5 text-sm">
            <p className="font-bold text-apa-navy">
              🎭 {isFr ? 'Mode Démo — atelier en aperçu' : 'Demo Mode — workspace preview'}
            </p>
            <p className="mt-1.5 text-apa-ink">
              {isFr
                ? 'Le formulaire interactif, le calcul des résultats et l’export de rapports fonctionnent avec un compte (les sessions sont sauvegardées). Créez un compte gratuit pour lancer une session de travail sur cet outil.'
                : 'The interactive form, results computation and report export run with an account (sessions are saved). Create a free account to start a working session on this tool.'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/sign-up" className="rounded-md bg-apa-green px-4 py-2 text-xs font-bold text-white hover:bg-apa-green-mid">
                {isFr ? 'Créer un compte gratuit' : 'Create a free account'}
              </Link>
              <Link href="/app/cspa" className="rounded-md border border-apa-line px-4 py-2 text-xs font-semibold text-apa-navy hover:border-apa-green">
                {isFr ? 'Essayer le diagnostic C-SPA (démo complète)' : 'Try the C-SPA diagnostic (full demo)'}
              </Link>
            </div>
          </div>
        )}
      </div>

      {demo ? <div className="mt-6"><DemoBanner locale={locale} /></div> : null}

      {/* Saved reports */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-apa-green">{t('savedReports')}</h2>
        {toolSession?.reports.length ? (
          <ul className="mt-4 divide-y divide-apa-mist rounded-apa border border-apa-line">
            {toolSession.reports.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="text-sm font-medium text-apa-navy">{r.title}</span>
                <a
                  href={`/api/v1/tools/${slug}/export?report=${r.id}`}
                  className="text-sm font-semibold text-apa-green hover:underline"
                >
                  ⬇ {t('export')}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 apa-box p-4 text-sm text-apa-grey">{t('noReports')}</p>
        )}
      </section>

      {/* History */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-apa-green">{t('history')}</h2>
        <ul className="mt-4 space-y-2">
          {allSessions.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between rounded-apa border border-apa-line px-4 py-3 text-sm"
            >
              <span className="text-apa-ink">
                {format.dateTime(s.updatedAt, { dateStyle: 'medium', timeStyle: 'short' })}
                {s.id === sessionId ? (
                  <span className="ml-2 rounded bg-apa-soft px-2 py-0.5 text-xs font-semibold text-apa-green">
                    {t('current')}
                  </span>
                ) : null}
              </span>
              <span className="text-apa-grey">
                {t('reportCount', { count: s._count.reports })}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Ecosystem — where this tool sits & what comes next */}
      {(() => {
        const solution = solutionOf(tool.number);
        const nextSolution = SOLUTIONS[(SOLUTIONS.findIndex((s) => s.id === solution.id) + 1) % SOLUTIONS.length];
        return (
          <section className="apa-box apa-box-navy mt-10 p-5">
            <h2 className="font-bold text-apa-green">
              {isFr ? 'Cet outil dans l’écosystème APA' : 'This tool in the APA ecosystem'}
            </h2>
            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-[11px] font-bold uppercase text-apa-grey">{isFr ? 'Solution' : 'Solution'}</dt>
                <dd className="mt-0.5 font-semibold text-apa-navy">{solution.code} · {isFr ? solution.nameFr : solution.nameEn}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase text-apa-grey">{isFr ? 'Framework' : 'Framework'}</dt>
                <dd className="mt-0.5">{tool.pillar.code} · {isFr ? tool.pillar.nameFr : tool.pillar.nameEn}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase text-apa-grey">{isFr ? 'Certification' : 'Certification'}</dt>
                <dd className="mt-0.5">{isFr ? solution.certificationFr : solution.certificationEn}</dd>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/journeys#${journeyOf(tool.number)}`} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-apa-green ring-1 ring-apa-line hover:ring-apa-green">
                {isFr ? 'Parcours lié' : 'Related journey'} →
              </Link>
              <Link href="/certification" className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-apa-navy ring-1 ring-apa-line hover:ring-apa-green">
                {isFr ? 'Aller à la certification' : 'Go to certification'} →
              </Link>
              <Link href={`/tools#${nextSolution.id}`} className="rounded-full bg-apa-green px-3 py-1 text-xs font-semibold text-white hover:bg-apa-green-mid">
                {isFr ? 'Solution suivante suggérée' : 'Next suggested solution'}: {nextSolution.code} →
              </Link>
            </div>
          </section>
        );
      })()}

      {/* Help / Support / AI Assistant */}
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-apa border border-apa-line bg-white p-5">
          <h3 className="font-bold text-apa-navy">{t('help')}</h3>
          <p className="mt-2 text-sm text-apa-grey">{t('helpBody')}</p>
        </div>
        <div className="rounded-apa border border-apa-line bg-white p-5">
          <h3 className="font-bold text-apa-navy">{t('support')}</h3>
          <a
            href="mailto:pape@theapaafrica.org"
            className="mt-2 inline-block text-sm font-semibold text-apa-green hover:underline"
          >
            pape@theapaafrica.org
          </a>
        </div>
        <div className="rounded-apa border border-apa-line bg-white p-5">
          <h3 className="font-bold text-apa-navy">{t('aiAssistant')}</h3>
          <p className="mt-2 text-sm text-apa-grey">{t('aiBody')}</p>
          <Link
            href="/intelligence"
            className="mt-2 inline-block text-sm font-semibold text-apa-green hover:underline"
          >
            {t('aiCta')} →
          </Link>
        </div>
      </section>
    </div>
  );
}
