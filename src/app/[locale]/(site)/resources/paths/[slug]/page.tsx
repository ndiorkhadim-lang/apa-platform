import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { LEARNING_PATHS, getLearningPathBySlug, getResourceBySlug } from '@/data/resources';
import { RESOURCE_TYPE_META } from '@/types/resource';

export function generateStaticParams() {
  return LEARNING_PATHS.map((p) => ({ slug: p.slug }));
}

const compact = (n: number) => Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

export default async function LearningPathPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const path = getLearningPathBySlug(slug);
  if (!path) notFound();

  const resources = path.resourceSlugs.map((s) => getResourceBySlug(s)).filter(Boolean) as NonNullable<ReturnType<typeof getResourceBySlug>>[];
  const totalMin = resources.reduce((sum, r) => sum + r.readingMinutes, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <nav className="mb-4 flex items-center gap-2 text-xs font-semibold text-apa-grey">
        <Link href="/resources" className="hover:text-apa-green">Knowledge Center</Link>
        <span>›</span>
        <span className="text-apa-navy">Learning Paths</span>
      </nav>

      {/* Hero */}
      <header className="overflow-hidden rounded-apa-lg border border-apa-line">
        <div className={`${path.accent} px-6 py-10 text-white sm:px-10`}>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{path.icon}</span>
            <span className="rounded-full bg-white/15 px-3 py-0.5 text-[11px] font-bold uppercase">{path.level} · {resources.length} resources · ~{Math.round(totalMin / 60 * 10) / 10} h</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{path.title}</h1>
          <p className="mt-2 max-w-2xl text-white/90">{path.description}</p>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
        {/* Steps */}
        <div>
          <div className="flex items-center gap-3">
            <span className="apa-secnum text-sm">✦</span>
            <h2 className="text-xl font-bold text-apa-navy">The pathway</h2>
          </div>
          <div className="apa-rule my-3" />
          <ol className="mt-4 space-y-4">
            {resources.map((r, i) => {
              const meta = RESOURCE_TYPE_META[r.type];
              const next = resources[i + 1];
              return (
                <li key={r.id} className="relative rounded-apa-lg border border-apa-line p-5">
                  <div className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-apa-green text-sm font-bold text-white">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${meta.badge}`}>{meta.icon} {r.type}</span>
                      <h3 className="mt-1 font-bold text-apa-navy">
                        <Link href={`/resources/${r.slug}`} className="hover:text-apa-green">{r.title}</Link>
                      </h3>
                      <p className="mt-1 text-sm text-apa-grey">{r.executiveSummary}</p>
                      <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-apa-grey">
                        <span>⏱ {r.readingMinutes} min</span>
                        <span>👁 {compact(r.views)}</span>
                        <span className="text-apa-gold-bright">★ {r.rating.toFixed(1)}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Link href={`/resources/${r.slug}`} className="rounded-md bg-apa-green px-3 py-1.5 text-xs font-bold text-white hover:bg-apa-green-mid">Open resource</Link>
                        {next ? <span className="rounded-md border border-apa-line px-3 py-1.5 text-xs font-semibold text-apa-grey">Next → {next.title.slice(0, 32)}…</span> : <span className="rounded-md bg-apa-gold-bright px-3 py-1.5 text-xs font-bold text-apa-ink">🎓 Path complete</span>}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Outcomes */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-apa-lg border border-apa-line p-5">
            <h3 className="text-sm font-bold text-apa-navy">What you’ll be able to do</h3>
            <div className="apa-rule my-3" />
            <ul className="space-y-2 text-sm text-apa-ink">
              {path.outcomes.map((o) => <li key={o} className="flex gap-2"><span className="text-apa-green">✓</span>{o}</li>)}
            </ul>
          </div>
          <Link href="/resources" className="block rounded-apa-lg border border-apa-line p-4 text-center text-sm font-semibold text-apa-navy hover:border-apa-green">
            ← All learning paths
          </Link>
        </aside>
      </div>
    </div>
  );
}
