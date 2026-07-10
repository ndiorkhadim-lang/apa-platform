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
