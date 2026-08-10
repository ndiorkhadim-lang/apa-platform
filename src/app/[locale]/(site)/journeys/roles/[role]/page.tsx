import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { JOURNEYS } from '@/data/journeys';
import { ROLE_DOSSIERS, ROLE_META, ROLE_ORDER } from '@/types/journey';
import type { RoleFilter } from '@/types/journey';
import { JourneyCard } from '@/components/journey/JourneyCard';

const SLUG_TO_ROLE: Record<string, RoleFilter> = {
  observer: 'OBSERVER',
  practitioner: 'PRACTITIONER',
  'co-architect': 'CO_ARCHITECT',
};

export function generateStaticParams() {
  return ROLE_ORDER.map((r) => ({ role: ROLE_META[r].slug }));
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-apa-lg border border-apa-line bg-white p-5">
      <h3 className="text-sm font-bold uppercase tracking-wide text-apa-green">{title}</h3>
      <div className="apa-rule my-3" />
      <div className="text-sm leading-relaxed text-apa-ink">{children}</div>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((i) => (
        <li key={i} className="flex gap-2"><span className="text-apa-gold">◆</span><span>{i}</span></li>
      ))}
    </ul>
  );
}

export default async function RoleLandingPage({
  params,
}: {
  params: Promise<{ locale: string; role: string }>;
}) {
  const { locale, role: roleSlug } = await params;
  setRequestLocale(locale);
  const role = SLUG_TO_ROLE[roleSlug];
  if (!role) notFound();

  const dossier = ROLE_DOSSIERS[role];
  const meta = ROLE_META[role];
  const journeys = JOURNEYS.filter((j) => j.roleFilter === role);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Role switcher */}
      <div className="mb-6 flex flex-wrap gap-2">
        {ROLE_ORDER.map((r) => (
          <Link
            key={r}
            href={`/journeys/roles/${ROLE_META[r].slug}`}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              r === role ? 'apa-gradient text-white' : 'border border-apa-line bg-white text-apa-navy hover:border-apa-green'
            }`}
          >
            {ROLE_META[r].label}
          </Link>
        ))}
      </div>

      {/* Hero */}
      <header className="overflow-hidden rounded-apa-lg border border-apa-line">
        <div className="apa-gradient px-6 py-10 text-white sm:px-10">
          <span className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${meta.badge}`}>{meta.label} tier</span>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{meta.label} Journeys</h1>
          <p className="mt-2 max-w-2xl text-apa-mint">{dossier.tagline}</p>
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <Block title="Purpose"><p>{dossier.purpose}</p></Block>
        </div>
        <Block title="Objectives"><List items={dossier.objectives} /></Block>
        <Block title="Eligibility"><List items={dossier.eligibility} /></Block>
        <Block title="Responsibilities"><List items={dossier.responsibilities} /></Block>
        <Block title="Learning Pathway">
          <ol className="space-y-2">
            {dossier.learningPathway.map((s, i) => (
              <li key={s} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-apa-green text-xs font-bold text-white">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </Block>
        <div className="lg:col-span-2">
          <Block title="Certification Pathway">
            <p>{dossier.certificationPathway}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {dossier.benefits.map((b) => (
                <span key={b} className="rounded-full bg-apa-soft px-3 py-1 text-xs font-semibold text-apa-green">{b}</span>
              ))}
            </div>
          </Block>
        </div>
      </div>

      {/* Journeys for this role */}
      <div className="mt-12">
        <div className="flex items-center gap-3">
          <span className="apa-secnum text-sm">✦</span>
          <h2 className="text-xl font-bold text-apa-navy">{meta.label} Journeys open now</h2>
        </div>
        <div className="apa-rule my-3" />
        {journeys.length ? (
          <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {journeys.map((j) => (
              <JourneyCard key={j.id} journey={j} role="explorer" />
            ))}
          </div>
        ) : (
          <div className="apa-box mt-4 p-6 text-sm text-apa-grey">
            No {meta.label} journeys are scheduled yet.{' '}
            <Link href="/journeys" className="font-semibold text-apa-green underline">Set a journey alert →</Link>
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/journeys" className="rounded-md border border-apa-line px-5 py-2.5 text-sm font-semibold text-apa-navy hover:border-apa-green">
          ← All journeys
        </Link>
      </div>
    </div>
  );
}
