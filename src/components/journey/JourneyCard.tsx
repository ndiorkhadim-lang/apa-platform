import { Link } from '@/i18n/navigation';
import type { Journey, JourneyUserType } from '@/types/journey';
import { ROLE_META } from '@/types/journey';

const DIFFICULTY_BADGE: Record<string, string> = {
  Pioneer: 'bg-apa-green text-white',
  Explorer: 'bg-apa-gold text-apa-ink',
  Advanced: 'bg-apa-bronze text-white',
};

const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export function JourneyCard({
  journey,
  role,
  isOwner,
}: {
  journey: Journey;
  role: JourneyUserType;
  isOwner?: boolean;
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-apa-lg border border-apa-line bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      {/* Cover (image or brand gradient fallback) */}
      <div className="relative h-40 w-full">
        {journey.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={journey.coverImage} alt={journey.title} className="h-full w-full object-cover" />
        ) : (
          <div className="apa-gradient h-full w-full" />
        )}
        <span
          className={`absolute left-3 top-3 rounded px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${ROLE_META[journey.roleFilter].badge}`}
        >
          {ROLE_META[journey.roleFilter].label}
        </span>
        <span
          className={`absolute right-3 top-3 rounded px-2 py-0.5 text-[10px] font-bold uppercase ${DIFFICULTY_BADGE[journey.difficulty]}`}
        >
          {journey.difficulty}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-bold leading-snug text-apa-navy">{journey.title}</h3>
        <p className="mt-1 text-sm text-apa-grey">
          {journey.countryFlag} {journey.country} · {journey.cityRegion}
        </p>

        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <span className="font-semibold text-apa-ink">🗓 {journey.durationDays} Days</span>
          <span className="font-bold text-apa-green">{money(journey.priceUSD)}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {journey.themes.map((th) => (
            <span key={th} className="rounded-full border border-apa-sage bg-apa-soft px-2 py-0.5 text-[10px] font-semibold text-apa-green">
              {th}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          <Link
            href={`/journeys/${journey.slug}`}
            className="flex-1 rounded-md border border-apa-green px-3 py-2 text-center text-sm font-semibold text-apa-green transition-colors hover:bg-apa-green hover:text-white"
          >
            View Details
          </Link>
          {role === 'explorer' ? (
            <Link
              href={`/journeys/${journey.slug}?apply=1`}
              className="flex-1 rounded-md bg-apa-green px-3 py-2 text-center text-sm font-bold text-white transition-colors hover:bg-apa-green-mid"
            >
              Apply
            </Link>
          ) : null}
          {role === 'partner_business' && isOwner ? (
            <Link
              href={`/journeys?tab=submit&edit=${journey.slug}`}
              className="flex-1 rounded-md bg-apa-gold px-3 py-2 text-center text-sm font-bold text-apa-ink transition-colors hover:bg-apa-gold-bright"
            >
              Edit
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
