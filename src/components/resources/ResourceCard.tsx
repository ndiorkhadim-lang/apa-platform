import { Link } from '@/i18n/navigation';
import type { Resource } from '@/types/resource';
import { RESOURCE_TYPE_META } from '@/types/resource';
import { BookmarkButton } from './BookmarkButton';

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
const compact = (n: number) => Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

export function ResourceCard({ resource, priority }: { resource: Resource; priority?: boolean }) {
  const meta = RESOURCE_TYPE_META[resource.type];
  return (
    <article className="group flex flex-col overflow-hidden rounded-apa-lg border border-apa-line bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      {/* Cover */}
      <Link href={`/resources/${resource.slug}`} className="relative block h-36 w-full overflow-hidden">
        {resource.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={resource.coverImage} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="apa-gradient flex h-full w-full items-center justify-center text-4xl opacity-90">{meta.icon}</div>
        )}
        <span className={`absolute left-3 top-3 rounded px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${meta.badge}`}>
          {resource.type}
        </span>
        {resource.certificationBadge ? (
          <span className="absolute right-3 top-3 rounded bg-apa-gold-bright px-2 py-0.5 text-[10px] font-bold uppercase text-apa-ink">
            🎓 {resource.certificationBadge}
          </span>
        ) : resource.featured ? (
          <span className="absolute right-3 top-3 rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase text-apa-bronze">★ Editor’s Choice</span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-apa-grey">
          <span>{resource.language === 'French' ? '🇫🇷 FR' : resource.language === 'Portuguese' ? '🇵🇹 PT' : resource.language === 'Arabic' ? '🇸🇦 AR' : '🇬🇧 EN'}</span>
          <span>·</span>
          <span>{fmtDate(resource.publishedAt)}</span>
          <span>·</span>
          <span>{resource.readingMinutes} min</span>
        </div>

        <h3 className="mt-2 font-bold leading-snug text-apa-navy">
          <Link href={`/resources/${resource.slug}`} className="hover:text-apa-green">{resource.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-apa-grey">{resource.executiveSummary}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {resource.domains.slice(0, 2).map((d) => (
            <span key={d} className="rounded-full border border-apa-sage bg-apa-soft px-2 py-0.5 text-[10px] font-semibold text-apa-green">{d}</span>
          ))}
          {resource.countries[0] ? (
            <span className="rounded-full bg-apa-soft px-2 py-0.5 text-[10px] font-semibold text-apa-navy">{resource.countries[0]}</span>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-apa-line pt-3 text-[11px] text-apa-grey">
          <span className="truncate font-semibold text-apa-ink">{resource.author}</span>
          <span className="flex shrink-0 items-center gap-3">
            <span title="Views">👁 {compact(resource.views)}</span>
            {resource.hasPdf ? <span title="Downloads">⬇ {compact(resource.downloads)}</span> : null}
            <span title="Rating" className="text-apa-gold-bright">★ {resource.rating.toFixed(1)}</span>
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Link
            href={`/resources/${resource.slug}`}
            className="flex-1 rounded-md border border-apa-green px-3 py-2 text-center text-sm font-semibold text-apa-green transition-colors hover:bg-apa-green hover:text-white"
          >
            Read
          </Link>
          <BookmarkButton slug={resource.slug} />
        </div>
      </div>
    </article>
  );
}
