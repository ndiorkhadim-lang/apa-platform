export const dynamic = 'force-dynamic';
import { getFormatter, setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/infrastructure/prisma/client';
import type { ChampionAppStatus, Prisma } from '@/generated/prisma/client';
import { reviewApplication } from './actions';

const STATUSES: ChampionAppStatus[] = [
  'SUBMITTED',
  'SCREENING',
  'INTERVIEW',
  'ACCEPTED',
  'REJECTED',
];

const STATUS_STYLE: Record<string, string> = {
  SUBMITTED: 'bg-apa-navy text-white',
  SCREENING: 'bg-apa-gold text-apa-ink',
  INTERVIEW: 'bg-apa-teal text-white',
  ACCEPTED: 'bg-apa-green text-white',
  REJECTED: 'bg-red-700 text-white',
  DRAFT: 'bg-apa-soft text-apa-grey',
};

const C = {
  fr: {
    title: 'Admin — Candidatures Champions',
    sub: 'Pipeline de recrutement : filtrez, évaluez, décidez. Chaque décision notifie le candidat et trace un audit log.',
    all: 'Tous statuts', search: 'Rechercher (nom, email, pays)…', filter: 'Filtrer',
    exportCsv: 'Exporter CSV', empty: 'Aucune candidature pour ces critères.',
    cols: { candidate: 'Candidat', country: 'Pays', position: 'Poste', submitted: 'Soumise', status: 'Statut', reviews: 'Éval.' },
    score: 'Score /100', notes: 'Notes', decide: 'Décision', apply: 'Enregistrer',
    stats: '{total} candidatures · {pending} à traiter',
  },
  en: {
    title: 'Admin — Champion Applications',
    sub: 'Recruitment pipeline: filter, score, decide. Every decision notifies the candidate and writes an audit log.',
    all: 'All statuses', search: 'Search (name, email, country)…', filter: 'Filter',
    exportCsv: 'Export CSV', empty: 'No applications for these criteria.',
    cols: { candidate: 'Candidate', country: 'Country', position: 'Position', submitted: 'Submitted', status: 'Status', reviews: 'Rev.' },
    score: 'Score /100', notes: 'Notes', decide: 'Decision', apply: 'Save',
    stats: '{total} applications · {pending} to process',
  },
} as const;

export default async function AdminChampionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getSession();
  const role = (session?.user as { platformRole?: string } | undefined)?.platformRole;
  if (!session) redirect({ href: '/sign-in?redirect=/app/admin/champions', locale });
  if (role !== 'ADMIN_APA') redirect({ href: '/app', locale });

  const sp = await searchParams;
  const c = C[locale === 'en' ? 'en' : 'fr'];
  const format = await getFormatter();

  const statusFilter =
    typeof sp.status === 'string' && (STATUSES as string[]).includes(sp.status)
      ? (sp.status as ChampionAppStatus)
      : undefined;
  const q = typeof sp.q === 'string' ? sp.q.trim() : '';

  const where: Prisma.ChampionApplicationWhereInput = {
    status: statusFilter ?? { not: 'DRAFT' },
    ...(q
      ? {
          OR: [
            { firstName: { contains: q, mode: 'insensitive' } },
            { lastName: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
            { countryResidence: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [apps, total, pending] = await Promise.all([
    prisma.championApplication.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
      include: { reviews: { orderBy: { createdAt: 'desc' }, take: 3 } },
      take: 100,
    }),
    prisma.championApplication.count({ where: { status: { not: 'DRAFT' } } }),
    prisma.championApplication.count({ where: { status: { in: ['SUBMITTED', 'SCREENING', 'INTERVIEW'] } } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-apa-green">{c.title}</h1>
      <div className="apa-rule my-4" />
      <p className="text-sm text-apa-grey">{c.sub}</p>
      <p className="mt-2 text-sm font-semibold text-apa-navy">
        {c.stats.replace('{total}', String(total)).replace('{pending}', String(pending))}
      </p>

      {/* Filters */}
      <form method="GET" className="mt-6 flex flex-wrap items-end gap-3 rounded-apa border border-apa-line bg-apa-soft p-4">
        <select name="status" defaultValue={statusFilter ?? ''} className="rounded-md border border-apa-line bg-white px-3 py-2 text-sm">
          <option value="">{c.all}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder={c.search}
          className="min-w-56 flex-1 rounded-md border border-apa-line bg-white px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-md bg-apa-green px-4 py-2 text-sm font-semibold text-white">
          {c.filter}
        </button>
        <a
          href={`/api/v1/champions/export${statusFilter ? `?status=${statusFilter}` : ''}`}
          className="rounded-md border border-apa-green px-4 py-2 text-sm font-semibold text-apa-green hover:bg-apa-green hover:text-white"
        >
          ⬇ {c.exportCsv}
        </a>
      </form>

      {/* Applications */}
      {apps.length === 0 ? (
        <p className="apa-box mt-6 p-4 text-sm text-apa-grey">{c.empty}</p>
      ) : (
        <div className="mt-6 space-y-4">
          {apps.map((a) => (
            <details key={a.id} className="rounded-apa-lg border border-apa-line bg-white">
              <summary className="flex cursor-pointer flex-wrap items-center gap-3 px-5 py-4">
                <span className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${a.type === 'ADVISOR' ? 'bg-apa-gold text-apa-ink' : 'bg-apa-green text-white'}`}>
                  {a.type === 'ADVISOR' ? (locale === 'fr' ? 'Conseiller' : 'Advisor') : (locale === 'fr' ? 'Champion' : 'Champion')}
                </span>
                <span className="font-bold text-apa-navy">
                  {a.firstName} {a.lastName}
                </span>
                <span className="text-sm text-apa-grey">{a.email}</span>
                <span className="text-sm text-apa-grey">· {a.countryResidence}</span>
                <span className="text-sm text-apa-grey">· {a.position} @ {a.organization}</span>
                <span className={`ml-auto rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${STATUS_STYLE[a.status]}`}>
                  {a.status}
                </span>
                <span className="text-xs text-apa-grey">
                  {a.submittedAt ? format.dateTime(a.submittedAt, { dateStyle: 'medium' }) : '—'}
                </span>
              </summary>
              <div className="grid gap-6 border-t border-apa-mist px-5 py-4 lg:grid-cols-2">
                <div className="space-y-3 text-sm">
                  <p><b>{locale === 'fr' ? 'Expertise' : 'Expertise'}:</b> {a.expertise} · {a.yearsExperience} ans · {a.languages}</p>
                  <p><b>{locale === 'fr' ? 'Pourquoi' : 'Why'}:</b> {a.motivationWhy}</p>
                  <p><b>Leadership:</b> {a.motivationLeadership}</p>
                  <p><b>Impact:</b> {a.motivationImpact}</p>
                  <p><b>{locale === 'fr' ? 'Valeur' : 'Value'}:</b> {a.motivationValue}</p>
                  <p className="text-xs text-apa-grey">
                    CV: {a.cvUrl ? <a href={a.cvUrl} className="text-apa-green underline" target="_blank" rel="noreferrer">{a.cvUrl}</a> : '—'}
                    {' '}· LinkedIn: {a.linkedin ?? '—'} · ✍ {a.signature}
                  </p>
                  {a.reviews.length > 0 ? (
                    <div className="apa-box p-3 text-xs">
                      {a.reviews.map((r) => (
                        <p key={r.id}>
                          {format.dateTime(r.createdAt, { dateStyle: 'short' })} — score {r.score ?? '—'} · {r.decision ?? ''} {r.notes ? `· ${r.notes}` : ''}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </div>
                <form action={reviewApplication} className="space-y-3 rounded-apa border border-apa-line bg-apa-soft p-4 text-sm">
                  <input type="hidden" name="applicationId" value={a.id} />
                  <input type="hidden" name="locale" value={locale} />
                  <label className="block font-semibold">
                    {c.score}
                    <input type="number" name="score" min={0} max={100} className="mt-1 w-28 rounded-md border border-apa-line bg-white px-3 py-2" />
                  </label>
                  <label className="block font-semibold">
                    {c.notes}
                    <textarea name="notes" rows={2} className="mt-1 w-full rounded-md border border-apa-line bg-white px-3 py-2" />
                  </label>
                  <label className="block font-semibold">
                    {c.decide}
                    <select name="decision" className="mt-1 w-full rounded-md border border-apa-line bg-white px-3 py-2">
                      <option value="" />
                      <option value="SCREENING">SCREENING</option>
                      <option value="INTERVIEW">INTERVIEW</option>
                      <option value="ACCEPTED">ACCEPTED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </label>
                  <button type="submit" className="rounded-md bg-apa-green px-4 py-2 font-semibold text-white hover:bg-apa-green-mid">
                    {c.apply}
                  </button>
                </form>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
