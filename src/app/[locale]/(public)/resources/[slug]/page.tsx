import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { RESOURCES, getResourceBySlug } from '@/data/resources';
import { RESOURCE_TYPE_META, SOLUTION_LABEL, PILLAR_LABEL } from '@/types/resource';
import type { Resource } from '@/types/resource';
import { ResourceActions } from '@/components/resources/ResourceActions';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { PodcastPlayer, VideoPlayer, InProductionCard } from '@/components/resources/MediaPlayer';

const compact = (n: number) => Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

export function generateStaticParams() {
  return RESOURCES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = getResourceBySlug(slug);
  if (!r) return {};
  return { title: `${r.title} — APA Knowledge Center`, description: r.executiveSummary };
}

function related(current: Resource): Resource[] {
  return RESOURCES.filter((r) => r.id !== current.id)
    .map((r) => {
      const shared =
        r.domains.filter((d) => current.domains.includes(d)).length * 2 +
        r.relatedFrameworks.filter((f) => current.relatedFrameworks.includes(f)).length * 2 +
        r.relatedSolutions.filter((s) => current.relatedSolutions.includes(s)).length +
        r.relatedTools.filter((t) => current.relatedTools.includes(t)).length;
      return { r, shared };
    })
    .filter((x) => x.shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, 3)
    .map((x) => x.r);
}

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

function Chips({ label, items, hrefBase }: { label: string; items: { key: string; text: string; href?: string }[]; hrefBase?: string }) {
  if (!items.length) return null;
  return (
    <div className="rounded-apa-lg border border-apa-line p-4">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-apa-grey">{label}</h3>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((i) =>
          i.href ? (
            <li key={i.key}>
              <Link href={i.href} className="inline-block rounded-full bg-apa-soft px-2.5 py-1 text-xs font-semibold text-apa-green hover:bg-apa-green hover:text-white">{i.text}</Link>
            </li>
          ) : (
            <li key={i.key} className="rounded-full bg-apa-soft px-2.5 py-1 text-xs font-semibold text-apa-green">{i.text}</li>
          )
        )}
      </ul>
    </div>
  );
}

export default async function ResourceDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const r = getResourceBySlug(slug);
  if (!r) notFound();

  const meta = RESOURCE_TYPE_META[r.type];
  const rel = related(r);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Breadcrumb */}
      <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-apa-grey">
        <Link href="/resources" className="hover:text-apa-green">Knowledge Center</Link>
        <span>›</span>
        <span className="text-apa-navy">{r.type}</span>
        <span>›</span>
        <span className="line-clamp-1 text-apa-navy">{r.title}</span>
      </nav>

      {/* Hero — investigations get a large banner over their poster */}
      <header className="overflow-hidden rounded-apa-lg border border-apa-line">
        <div
          className={`apa-gradient relative px-6 text-white sm:px-10 ${r.type === 'Investigation' ? 'py-16 sm:py-24' : 'py-10'}`}
          style={
            r.type === 'Investigation' && r.posterImage
              ? { backgroundImage: `linear-gradient(157deg, rgba(10,92,54,.92) 0%, rgba(11,92,78,.9) 48%, rgba(13,43,78,.94) 100%), url(${r.posterImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : undefined
          }
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${meta.badge}`}>{meta.icon} {r.type}</span>
            {r.certificationBadge ? <span className="rounded bg-apa-gold-bright px-2 py-0.5 text-[10px] font-bold uppercase text-apa-ink">🎓 {r.certificationBadge}</span> : null}
            {r.featured ? <span className="rounded bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase">★ Editor’s Choice</span> : null}
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">{r.title}</h1>
          <p className="mt-3 max-w-2xl text-apa-mint">{r.executiveSummary}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-apa-sage">
            <span>✍️ {r.author}</span>
            <span>🗓 {fmtDate(r.publishedAt)}</span>
            <span>⏱ {r.readingMinutes} min read</span>
            <span>👁 {compact(r.views)} views</span>
            {r.hasPdf ? <span>⬇ {compact(r.downloads)} downloads</span> : null}
            <span className="text-apa-gold-bright">★ {r.rating.toFixed(1)} ({r.ratingCount})</span>
          </div>
        </div>
      </header>

      {/* Media experience — podcast player / video player */}
      {r.videoUrl || r.audioUrl || r.series ? (
        <div className="mt-6">
          {r.videoUrl ? (
            <VideoPlayer src={r.videoUrl} poster={r.posterImage} title={r.title} />
          ) : r.audioUrl ? (
            <PodcastPlayer
              src={r.audioUrl}
              poster={r.posterImage}
              title={r.title}
              series={r.series}
              episode={r.episode}
              durationSec={r.mediaDurationSec}
            />
          ) : (
            <InProductionCard
              title={r.title}
              series={r.series}
              episode={r.episode}
              poster={r.posterImage}
              docUrl={r.downloadDocUrl}
              docLabel={r.downloadDocLabel}
            />
          )}
        </div>
      ) : null}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        {/* Main */}
        <div className="space-y-8">
          {/* AI summary highlight */}
          <div className="rounded-apa-lg border border-apa-gold bg-apa-gold/5 p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-apa-bronze">✦ AI Summary</div>
            <p className="mt-2 text-[15px] italic leading-relaxed text-apa-ink">{r.aiSummary}</p>
          </div>

          <div className="pt-0">
            <div className="flex items-center gap-3">
              <span className="apa-secnum text-sm">01</span>
              <h2 className="text-xl font-bold text-apa-navy">Executive Overview</h2>
            </div>
            <div className="apa-rule my-3" />
            <p className="mt-4 text-[15px] leading-relaxed text-apa-ink">{r.executiveOverview}</p>
          </div>

          <Section id="purpose" num="02" title="Purpose"><p>{r.purpose}</p></Section>
          <Section id="value" num="03" title="Business Value"><p>{r.businessValue}</p></Section>

          <Section id="insights" num="04" title="Key Insights">
            <ul className="space-y-2">
              {r.keyInsights.map((k) => (
                <li key={k} className="flex gap-2"><span className="text-apa-gold">◆</span><span>{k}</span></li>
              ))}
            </ul>
          </Section>

          {/* Investigation: the numbers (chart) */}
          {r.stats?.length ? (
            <Section id="numbers" num="§" title="The Numbers">
              <div className="space-y-4">
                {r.stats.map((s) => (
                  <div key={s.label}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-semibold">{s.label}</span>
                      <span className="text-lg font-bold text-apa-green">{s.value}</span>
                    </div>
                    <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-apa-soft">
                      <div className="apa-gradient h-full transition-all" style={{ width: `${s.pct}%` }} />
                    </div>
                    {s.note ? <div className="mt-1 text-xs text-apa-grey">{s.note}</div> : null}
                  </div>
                ))}
              </div>
            </Section>
          ) : null}

          {/* Investigation: interactive timeline */}
          {r.timeline?.length ? (
            <Section id="timeline" num="⧗" title="The Trail — Follow the Money">
              <ol className="relative ml-3 space-y-6 border-l-2 border-apa-gold pl-6">
                {r.timeline.map((t) => (
                  <li key={t.title} className="relative">
                    <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-apa-gold bg-white" />
                    <div className="text-[11px] font-bold uppercase tracking-wide text-apa-bronze">{t.label}</div>
                    <h3 className="mt-0.5 font-bold text-apa-navy">{t.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed">{t.text}</p>
                  </li>
                ))}
              </ol>
            </Section>
          ) : null}

          {/* Long-form body (Read Online) */}
          {r.fullContent?.length ? (
            <Section id="report" num="¶" title="The Full Report">
              <div className="space-y-6">
                {r.fullContent.map((sec) => (
                  <div key={sec.heading}>
                    <h3 className="font-bold text-apa-navy">{sec.heading}</h3>
                    <div className="mt-2 space-y-3">
                      {sec.paragraphs.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          ) : null}

          {/* Transcript (podcast / video) */}
          {r.transcript?.length ? (
            <Section id="transcript" num="TR" title={r.type === 'Podcast' ? 'Episode Transcript' : 'Transcript'}>
              <details open className="group">
                <summary className="cursor-pointer text-sm font-semibold text-apa-green">Toggle transcript</summary>
                <div className="mt-4 space-y-3 border-l-2 border-apa-line pl-4">
                  {r.transcript.map((t, i) => (
                    <p key={i} className="text-sm leading-relaxed">
                      {t.time ? <span className="mr-2 font-mono text-xs text-apa-grey">[{t.time}]</span> : null}
                      {t.speaker ? <strong className="text-apa-navy">{t.speaker} — </strong> : null}
                      {t.text}
                    </p>
                  ))}
                </div>
              </details>
            </Section>
          ) : null}

          <Section id="ecosystem" num="05" title="Connected in the APA Ecosystem">
            <div className="grid gap-4 sm:grid-cols-2">
              <Chips label="Related Solutions" items={r.relatedSolutions.map((s) => ({ key: s, text: SOLUTION_LABEL[s] ?? s, href: '/solutions' }))} />
              <Chips label="Related Frameworks" items={r.relatedFrameworks.map((f) => ({ key: f, text: PILLAR_LABEL[f] ?? `Pillar ${f}`, href: '/tools' }))} />
              <Chips label="Related Tools" items={r.relatedTools.map((t) => ({ key: String(t), text: `Tool #${t}`, href: '/tools' }))} />
              <Chips label="Related Journeys" items={r.relatedJourneys.map((j) => ({ key: j, text: j.replace(/-/g, ' '), href: `/journeys/${j}` }))} />
              <Chips label="Related Certifications" items={r.relatedCertifications.map((c) => ({ key: c, text: c, href: '/certification' }))} />
              <Chips label="Industries" items={r.industries.map((i) => ({ key: i, text: i }))} />
            </div>
          </Section>

          <Section id="actions" num="06" title="Downloads & Actions">
            <ResourceActions
              slug={r.slug}
              title={r.title}
              hasPdf={r.hasPdf}
              fileSizeKb={r.fileSizeKb}
              locale={locale}
              downloadDocUrl={r.downloadDocUrl ?? (r.audioUrl ? r.audioUrl : undefined)}
              downloadDocLabel={r.downloadDocLabel ?? (r.audioUrl ? 'Download audio (MP3)' : undefined)}
            />
          </Section>

          {rel.length ? (
            <Section id="related" num="07" title="Related Resources">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rel.map((x) => <ResourceCard key={x.id} resource={x} />)}
              </div>
            </Section>
          ) : null}
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-apa-lg border border-apa-line p-5 shadow-sm">
            <h3 className="text-sm font-bold text-apa-navy">Resource details</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <Row k="Type" v={`${meta.icon} ${r.type}`} />
              <Row k="Author" v={r.author} />
              <Row k="Published" v={fmtDate(r.publishedAt)} />
              <Row k="Updated" v={fmtDate(r.updatedAt)} />
              <Row k="Reading time" v={`${r.readingMinutes} min`} />
              <Row k="Language" v={[r.language, ...r.otherLanguages].join(', ')} />
              <Row k="Coverage" v={r.countries.join(', ')} />
              <Row k="Rating" v={`★ ${r.rating.toFixed(1)} (${r.ratingCount})`} />
            </dl>
          </div>

          {r.mediaUrl ? (
            <a href={r.mediaUrl} target="_blank" rel="noopener noreferrer" className="block rounded-apa-lg apa-gradient p-5 text-center text-sm font-bold text-white hover:opacity-95">
              ▶ Watch / Listen
            </a>
          ) : null}

          <div className="rounded-apa-lg border border-apa-line p-5">
            <h3 className="text-sm font-bold text-apa-navy">Governance domains</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {r.domains.map((d) => (
                <span key={d} className="rounded-full border border-apa-sage bg-apa-soft px-2.5 py-1 text-xs font-semibold text-apa-green">{d}</span>
              ))}
            </div>
          </div>

          <Link href="/resources#assistant" className="block rounded-apa-lg border border-apa-gold bg-apa-gold/5 p-4 text-center text-sm font-semibold text-apa-bronze hover:bg-apa-gold/10">
            ✦ Ask the AI about this resource
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="shrink-0 text-apa-grey">{k}</dt>
      <dd className="text-right font-semibold text-apa-navy">{v}</dd>
    </div>
  );
}
