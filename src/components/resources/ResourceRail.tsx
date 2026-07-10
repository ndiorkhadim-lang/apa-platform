import { Link } from '@/i18n/navigation';
import type { Resource } from '@/types/resource';
import { RESOURCE_TYPE_META } from '@/types/resource';

const compact = (n: number) => Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

/** Compact ranked list — used for analytics rails (Most Read, Trending, …). */
export function ResourceRail({
  title,
  icon,
  resources,
  metric = 'views',
}: {
  title: string;
  icon: string;
  resources: Resource[];
  metric?: 'views' | 'downloads' | 'rating' | 'date';
}) {
  const value = (r: Resource) =>
    metric === 'downloads' ? `⬇ ${compact(r.downloads)}`
    : metric === 'rating' ? `★ ${r.rating.toFixed(1)}`
    : metric === 'date' ? new Date(r.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : `👁 ${compact(r.views)}`;

  return (
    <div className="rounded-apa-lg border border-apa-line bg-white p-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-apa-navy"><span aria-hidden>{icon}</span>{title}</h3>
      <div className="apa-rule my-3" />
      <ol className="space-y-1">
        {resources.map((r, i) => (
          <li key={r.id}>
            <Link href={`/resources/${r.slug}`} className="flex items-start gap-2 rounded-md px-1.5 py-1.5 hover:bg-apa-soft">
              <span className="mt-0.5 text-xs font-bold text-apa-gold">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="line-clamp-2 text-[13px] font-semibold leading-snug text-apa-ink">{r.title}</span>
                <span className="mt-0.5 flex items-center gap-2 text-[11px] text-apa-grey">
                  <span>{RESOURCE_TYPE_META[r.type].icon} {r.type}</span>
                  <span>·</span>
                  <span>{value(r)}</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
