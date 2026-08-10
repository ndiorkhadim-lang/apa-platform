import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getJourneyBySlug, JOURNEYS } from '@/data/journeys';
import { ROLE_META } from '@/types/journey';
import { JourneyApplyFlow } from '@/components/journey/JourneyApplyFlow';
import { JourneyAlerts } from '@/components/journey/JourneyAlerts';

const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

export function generateStaticParams() {
  return JOURNEYS.map((j) => ({ slug: j.slug }));
}

const MEAL_LABEL = (m: { breakfast: boolean; lunch: boolean; dinner: boolean }) =>
  [m.breakfast && 'B', m.lunch && 'L', m.dinner && 'D'].filter(Boolean).join(' · ') || '—';

function Section({ id, num, title, children }: { id: string; num: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-apa-line pt-8">
      <div className="flex items-center gap-3">
        <span className="apa-secnum text-sm">{num}</span>
        <h2 className="text-xl font-bold text-apa-navy">{title}</h2>
      </div>
      <div className="apa-rule my-3" />
      <div className="mt-4 text-[15px] leading-relaxed text-apa-ink">{children}</div>
    </section>
  );
}

export default async function JourneyDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const journey = getJourneyBySlug(slug);
  if (!journey) notFound();

  const role = ROLE_META[journey.roleFilter];
  const applyOpen = sp.apply === '1';

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-xs font-semibold text-apa-grey">
        <Link href="/journeys" className="hover:text-apa-green">APA Journeys</Link>
        <span>›</span>
        <Link href={`/journeys/roles/${role.slug}`} className="hover:text-apa-green">{role.label}</Link>
        <span>›</span>
        <span className="text-apa-navy">{journey.title}</span>
      </nav>

      {/* Hero */}
      <header className="overflow-hidden rounded-apa-lg border border-apa-line">
        <div className="apa-gradient relative px-6 py-10 text-white sm:px-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${role.badge}`}>
              {role.label}
            </span>
            <span className="rounded bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase">{journey.difficulty}</span>
            <span className="rounded bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase">{journey.deliveryFormat}</span>
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">{journey.title}</h1>
          <p className="mt-2 text-apa-sage">
            {journey.countryFlag} {journey.country} · {journey.cityRegion}
          </p>
          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            <div><div className="text-apa-sage">Duration</div><div className="text-lg font-bold">{journey.durationDays} days</div></div>
            <div><div className="text-apa-sage">Investment</div><div className="text-lg font-bold">{money(journey.priceUSD)}</div></div>
            <div><div className="text-apa-sage">Cohort size</div><div className="text-lg font-bold">Max {journey.maxCapacity}</div></div>
            <div><div className="text-apa-sage">Applications</div><div className="text-lg font-bold">{journey.applicationsCount}</div></div>
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="space-y-8">
          <Section id="overview" num="01" title="Overview">
            <p>{journey.description}</p>
          </Section>

          <Section id="purpose" num="02" title="Purpose">
            <p>{journey.purpose}</p>
          </Section>

          <Section id="context" num="03" title="Strategic Context">
            <p>{journey.strategicContext}</p>
          </Section>

          <Section id="outcomes" num="04" title="Expected Outcomes">
            <ul className="space-y-2">
              {journey.expectedOutcomes.map((o) => (
                <li key={o} className="flex gap-2"><span className="text-apa-gold">◆</span><span>{o}</span></li>
              ))}
            </ul>
          </Section>

          <Section id="objectives" num="05" title="Objectives">
            <ul className="grid gap-2 sm:grid-cols-2">
              {journey.objectives.map((o) => (
                <li key={o} className="apa-box p-3 text-sm">{o}</li>
              ))}
            </ul>
          </Section>

          <Section id="audience" num="06" title="Target Audience & Eligibility">
            <div className="flex flex-wrap gap-2">
              {journey.audiences.map((a) => (
                <span key={a} className="rounded-full border border-apa-sage bg-apa-soft px-3 py-1 text-xs font-semibold text-apa-green">{a}</span>
              ))}
            </div>
            <p className="mt-4 text-sm text-apa-grey">
              This journey is designed for the <strong className="text-apa-navy">{role.label}</strong> tier.{' '}
              <Link href={`/journeys/roles/${role.slug}`} className="font-semibold text-apa-green underline">
                See full {role.label} eligibility & pathway →
              </Link>
            </p>
          </Section>

          <Section id="skills" num="07" title="Skills Developed">
            <div className="flex flex-wrap gap-2">
              {journey.skillsDeveloped.map((s) => (
                <span key={s} className="rounded-md bg-apa-navy px-3 py-1 text-xs font-semibold text-white">{s}</span>
              ))}
            </div>
          </Section>

          <Section id="modules" num="08" title="Learning Modules">
            <ol className="space-y-2">
              {journey.learningModules.map((m, i) => (
                <li key={m} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-apa-green text-xs font-bold text-white">{i + 1}</span>
                  <span>{m}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="timeline" num="09" title="Timeline & Itinerary">
            <div className="space-y-3">
              {journey.itinerary.map((d) => (
                <div key={d.day} className="apa-box p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold text-apa-navy">Day {d.day} — {d.title}</h3>
                    <span className="text-xs font-semibold text-apa-grey">Meals: {MEAL_LABEL(d.meals)}</span>
                  </div>
                  <p className="mt-1 text-sm text-apa-ink">{d.description}</p>
                  {d.accommodation && d.accommodation !== '—' ? (
                    <p className="mt-2 text-xs text-apa-grey">🏨 {d.accommodation}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </Section>

          <Section id="availability" num="10" title="Country Availability & Dates">
            <p className="text-sm">
              Delivered in <strong className="text-apa-navy">{journey.countryFlag} {journey.country}</strong> ({journey.cityRegion}) ·
              Format: <strong>{journey.deliveryFormat}</strong>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {journey.dates.map((d) => (
                <span key={d.id} className="rounded-md border border-apa-green px-3 py-1.5 text-xs font-semibold text-apa-green">
                  {fmtDate(d.startDate)} → {fmtDate(d.endDate)}
                </span>
              ))}
            </div>
          </Section>

          <Section id="facilitators" num="11" title="Facilitators">
            <div className="grid gap-4 sm:grid-cols-2">
              {journey.facilitators.map((f) => (
                <div key={f.id} className="rounded-apa-lg border border-apa-line p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full apa-gradient text-sm font-bold text-white">
                      {f.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-apa-navy">{f.name}</div>
                      <div className="text-xs text-apa-grey">{f.title}</div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-apa-ink">{f.bio}</p>
                  {f.yearsExperience ? <p className="mt-1 text-xs text-apa-grey">{f.yearsExperience}+ years experience</p> : null}
                </div>
              ))}
            </div>
          </Section>

          <Section id="ecosystem" num="12" title="Connected Ecosystem">
            <div className="grid gap-4 sm:grid-cols-2">
              <EcoBlock label="Related Solutions" items={journey.relatedSolutions} />
              <EcoBlock label="Related Frameworks (Pillars)" items={journey.relatedFrameworks.map((c) => `Pillar ${c}`)} />
              <EcoBlock label="Related Tools" items={journey.relatedTools.map((t) => `Tool #${t}`)} />
              <EcoBlock label="Certifications" items={journey.relatedCertifications} />
            </div>
          </Section>

          <Section id="included" num="13" title="What's Included">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-bold text-apa-green">Included</h3>
                <ul className="space-y-1 text-sm">
                  {journey.included.map((i) => <li key={i} className="flex gap-2"><span className="text-apa-green">✓</span>{i}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-bold text-apa-bronze">Not included</h3>
                <ul className="space-y-1 text-sm">
                  {journey.notIncluded.map((i) => <li key={i} className="flex gap-2"><span className="text-apa-bronze">✕</span>{i}</li>)}
                </ul>
              </div>
            </div>
          </Section>

          {journey.successStories.length ? (
            <Section id="stories" num="14" title="Success Stories">
              <div className="space-y-3">
                {journey.successStories.map((s) => (
                  <div key={s} className="apa-box apa-box-gold p-4 text-sm italic text-apa-ink">“{s}”</div>
                ))}
              </div>
            </Section>
          ) : null}

          {journey.testimonials.length ? (
            <Section id="testimonials" num="15" title="Testimonials">
              <div className="grid gap-4 sm:grid-cols-2">
                {journey.testimonials.map((t) => (
                  <figure key={t.name} className="rounded-apa-lg border border-apa-line p-4">
                    <blockquote className="text-sm italic text-apa-ink">“{t.quote}”</blockquote>
                    <figcaption className="mt-2 text-xs font-semibold text-apa-navy">{t.name} — {t.organization}</figcaption>
                  </figure>
                ))}
              </div>
            </Section>
          ) : null}

          <Section id="faq" num="16" title="FAQ">
            <div className="space-y-2">
              {journey.faq.map((f) => (
                <details key={f.question} className="rounded-apa border border-apa-line p-3">
                  <summary className="cursor-pointer text-sm font-semibold text-apa-navy">{f.question}</summary>
                  <p className="mt-2 text-sm text-apa-ink">{f.answer}</p>
                </details>
              ))}
            </div>
          </Section>

          {/* Apply flow */}
          <section id="apply" className="scroll-mt-24 border-t border-apa-line pt-8">
            <JourneyApplyFlow journey={journey} locale={locale} autoOpen={applyOpen} />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-apa-lg border border-apa-line p-5 shadow-sm">
            <div className="text-2xl font-bold text-apa-green">{money(journey.priceUSD)}</div>
            <p className="text-xs text-apa-grey">per participant · {journey.durationDays} days</p>
            <Link
              href={`/journeys/${journey.slug}?apply=1#apply`}
              className="mt-4 block rounded-md bg-apa-green px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-apa-green-mid"
            >
              Apply for this Journey
            </Link>
            <a
              href="#dates"
              className="mt-2 block rounded-md border border-apa-line px-4 py-2.5 text-center text-sm font-semibold text-apa-navy hover:border-apa-green"
            >
              View available dates
            </a>
            <dl className="mt-5 space-y-2 border-t border-apa-line pt-4 text-sm">
              <Row k="Role" v={role.label} />
              <Row k="Level" v={journey.difficulty} />
              <Row k="Format" v={journey.deliveryFormat} />
              <Row k="Location" v={`${journey.country}`} />
              <Row k="Cohort" v={`Max ${journey.maxCapacity}`} />
            </dl>
          </div>

          <div id="dates" className="rounded-apa-lg border border-apa-line p-5">
            <h3 className="text-sm font-bold text-apa-navy">Upcoming sessions</h3>
            <ul className="mt-3 space-y-2">
              {journey.dates.map((d) => (
                <li key={d.id} className="flex items-center justify-between rounded-apa bg-apa-soft px-3 py-2 text-xs font-semibold text-apa-ink">
                  <span>{fmtDate(d.startDate)}</span>
                  <span className="text-apa-grey">→ {fmtDate(d.endDate)}</span>
                </li>
              ))}
            </ul>
          </div>

          <JourneyAlerts defaultCountry={journey.country} defaultRole={journey.roleFilter} compact />
        </aside>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-apa-grey">{k}</dt>
      <dd className="font-semibold text-apa-navy">{v}</dd>
    </div>
  );
}

function EcoBlock({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="rounded-apa-lg border border-apa-line p-4">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-apa-grey">{label}</h3>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((i) => (
          <li key={i} className="rounded-full bg-apa-soft px-2.5 py-1 text-xs font-semibold text-apa-green">{i}</li>
        ))}
      </ul>
    </div>
  );
}
