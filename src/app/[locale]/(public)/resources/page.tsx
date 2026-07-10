import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { RESOURCES, LEARNING_PATHS } from '@/data/resources';
import { ResourceExplorer } from '@/components/resources/ResourceExplorer';
import { ResourceAIAssistant } from '@/components/resources/ResourceAIAssistant';
import { ResourceRail } from '@/components/resources/ResourceRail';
import { LearningPathCard } from '@/components/resources/LearningPathCard';

export const metadata: Metadata = {
  title: 'APA Knowledge & Resource Center',
  description:
    'The official library of governance intelligence, accountability frameworks, certification resources and practical implementation guides to transform African institutions.',
};

const byViews = [...RESOURCES].sort((a, b) => b.views - a.views);
const byDownloads = [...RESOURCES].filter((r) => r.hasPdf).sort((a, b) => b.downloads - a.downloads);
const trending = [...RESOURCES].filter((r) => r.trending).sort((a, b) => b.views - a.views);
const recent = [...RESOURCES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
const editors = [...RESOURCES].filter((r) => r.featured).sort((a, b) => b.rating - a.rating);
const investigation = RESOURCES.find((r) => r.type === 'Investigation');
const mediaResources = RESOURCES.filter((r) => r.audioUrl || r.videoUrl || r.series).sort(
  (a, b) => b.publishedAt.localeCompare(a.publishedAt)
);

export default async function ResourcesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div>
      {/* Hero */}
      <section className="apa-gradient text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <span className="apa-badge border-white/40 text-white">Knowledge & Resource Center</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">APA Knowledge &amp; Resource Center</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-apa-mint">
            Access the official library of governance intelligence, accountability frameworks, certification resources
            and practical implementation guides designed to transform African institutions.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#browse" className="rounded-md bg-white px-6 py-3 text-sm font-bold text-apa-green transition-colors hover:bg-apa-soft">
              Browse Resources
            </a>
            <a href="#assistant" className="rounded-md border border-white/50 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10">
              Ask the APA AI Concierge
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-8 text-sm">
            <Stat n={`${RESOURCES.length}+`} label="Curated resources" />
            <Stat n="14" label="Resource types" />
            <Stat n="22" label="Priority nations" />
            <Stat n={`${LEARNING_PATHS.length}`} label="Learning paths" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Featured Investigation */}
        {investigation ? (
          <section aria-label="Featured investigation" className="mb-14">
            <Link
              href={`/resources/${investigation.slug}`}
              className="group block overflow-hidden rounded-apa-lg border border-apa-line shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div
                className="relative px-6 py-14 text-white sm:px-12 sm:py-20"
                style={{
                  backgroundImage: `linear-gradient(157deg, rgba(10,92,54,.93) 0%, rgba(11,92,78,.9) 48%, rgba(13,43,78,.95) 100%)${investigation.posterImage ? `, url(${investigation.posterImage})` : ''}`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <span className="rounded bg-apa-bronze px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white">
                  🔍 Featured Investigation
                </span>
                <h2 className="mt-5 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">{investigation.title}</h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-apa-mint">{investigation.executiveSummary}</p>
                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-apa-sage">
                  <span>⏱ {investigation.readingMinutes} min read</span>
                  <span>·</span>
                  <span>{investigation.author}</span>
                  <span>·</span>
                  <span className="text-apa-gold-bright">★ {investigation.rating.toFixed(1)}</span>
                </div>
                <span className="mt-7 inline-block rounded-md bg-white px-6 py-3 text-sm font-bold text-apa-green transition-colors group-hover:bg-apa-soft">
                  Read the investigation →
                </span>
              </div>
            </Link>
          </section>
        ) : null}

        {/* Podcasts & Films */}
        {mediaResources.length ? (
          <section aria-labelledby="media-h" className="mb-14">
            <span className="apa-secnum text-sm">✦</span>
            <h2 id="media-h" className="mt-3 text-2xl font-bold text-apa-navy">Podcasts &amp; Films</h2>
            <div className="apa-rule my-3" />
            <p className="max-w-2xl text-sm text-apa-grey">
              The Proof — APA’s flagship audio &amp; film series. Listen, watch, read the transcript, download the assets.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {mediaResources.map((m) => (
                <Link
                  key={m.id}
                  href={`/resources/${m.slug}`}
                  className="group overflow-hidden rounded-apa-lg border border-apa-line bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-40 overflow-hidden">
                    {m.posterImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.posterImage} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="apa-gradient h-full w-full" />
                    )}
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-lg text-apa-green shadow-lg transition-transform group-hover:scale-110">▶</span>
                    </span>
                    <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                      {m.type === 'Podcast' ? '🎙 Podcast' : '🎬 Film'}
                    </span>
                    {m.mediaDurationSec ? (
                      <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {Math.round(m.mediaDurationSec / 60)} min
                      </span>
                    ) : null}
                  </div>
                  <div className="p-4">
                    {m.series ? (
                      <div className="text-[10px] font-bold uppercase tracking-wide text-apa-gold-bright">
                        {m.series}{m.episode ? ` · Ep. ${m.episode}` : ''}
                      </div>
                    ) : null}
                    <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-apa-navy group-hover:text-apa-green">{m.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {/* Learning paths */}
        <section aria-labelledby="paths-h">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="apa-secnum text-sm">✦</span>
              <h2 id="paths-h" className="mt-3 text-2xl font-bold text-apa-navy">Learning Paths</h2>
              <div className="apa-rule my-3" />
              <p className="max-w-2xl text-sm text-apa-grey">Curated collections that sequence the library into a pathway — each resource sets up the next.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {LEARNING_PATHS.map((p) => <LearningPathCard key={p.slug} path={p} />)}
          </div>
        </section>

        {/* Analytics rails */}
        <section className="mt-14" aria-label="Library highlights">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <ResourceRail title="Most Read" icon="🔥" resources={byViews.slice(0, 5)} metric="views" />
            <ResourceRail title="Most Downloaded" icon="⬇️" resources={byDownloads.slice(0, 5)} metric="downloads" />
            <ResourceRail title="Trending" icon="📈" resources={trending.slice(0, 5)} metric="views" />
            <ResourceRail title="Editor’s Picks" icon="★" resources={editors.slice(0, 5)} metric="rating" />
          </div>
        </section>

        {/* Browse / search / filters */}
        <section id="browse" className="mt-14 scroll-mt-20" aria-labelledby="browse-h">
          <span className="apa-secnum text-sm">✦</span>
          <h2 id="browse-h" className="mt-3 text-2xl font-bold text-apa-navy">Browse the Library</h2>
          <div className="apa-rule my-3" />
          <p className="max-w-2xl text-sm text-apa-grey">Search and filter the full corpus — every resource is connected to solutions, frameworks, tools, journeys and certifications.</p>
          <div className="mt-6">
            <ResourceExplorer resources={RESOURCES} />
          </div>
        </section>

        {/* AI assistant + recently added */}
        <section id="assistant" className="mt-14 grid scroll-mt-20 gap-6 lg:grid-cols-[1fr_320px]" aria-labelledby="assistant-h">
          <div>
            <span className="apa-secnum text-sm">✦</span>
            <h2 id="assistant-h" className="mt-3 text-2xl font-bold text-apa-navy">Ask the APA Knowledge Assistant</h2>
            <div className="apa-rule my-3" />
            <p className="mb-6 max-w-2xl text-sm text-apa-grey">Get resource recommendations, framework explanations, tool and certification suggestions — answered with APA knowledge only.</p>
            <ResourceAIAssistant resources={RESOURCES} paths={LEARNING_PATHS} locale={locale} />
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ResourceRail title="Recently Added" icon="🆕" resources={recent.slice(0, 6)} metric="date" />
            <Link href="/resources/admin" className="mt-4 block rounded-apa-lg border border-apa-line p-4 text-center text-sm font-semibold text-apa-navy hover:border-apa-green">
              ⚙ Resource Management (Admin)
            </Link>
          </aside>
        </section>
      </div>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-apa-gold-bright">{n}</div>
      <div className="text-apa-sage">{label}</div>
    </div>
  );
}
