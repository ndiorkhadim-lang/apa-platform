import { Link } from '@/i18n/navigation';
import type { LearningPath } from '@/types/resource';

const LEVEL_BADGE: Record<LearningPath['level'], string> = {
  Foundation: 'bg-apa-green/10 text-apa-green',
  Intermediate: 'bg-apa-gold/20 text-apa-bronze',
  Advanced: 'bg-apa-navy text-white',
};

export function LearningPathCard({ path }: { path: LearningPath }) {
  return (
    <Link
      href={`/resources/paths/${path.slug}`}
      className="group flex flex-col overflow-hidden rounded-apa-lg border border-apa-line bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className={`${path.accent} flex h-24 items-center justify-between px-5 text-white`}>
        <span className="text-3xl">{path.icon}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${LEVEL_BADGE[path.level]}`}>{path.level}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-bold text-apa-navy group-hover:text-apa-green">{path.title}</h3>
        <p className="mt-1 text-sm text-apa-grey">{path.tagline}</p>
        <div className="mt-4 flex items-center justify-between text-[11px] font-semibold text-apa-grey">
          <span>{path.resourceSlugs.length} resources</span>
          <span className="text-apa-green group-hover:underline">Start path →</span>
        </div>
      </div>
    </Link>
  );
}
