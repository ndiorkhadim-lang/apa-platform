import { Link } from '@/i18n/navigation';
import { CIRCUIT_STEPS } from './steps';

/** Server component — the step banner + prev/next circuit navigation. */
export function StepHeader({ n, fr }: { n: number; fr: boolean }) {
  const step = CIRCUIT_STEPS.find((s) => s.n === n)!;
  const prev = CIRCUIT_STEPS.find((s) => s.n === n - 1);
  const next = CIRCUIT_STEPS.find((s) => s.n === n + 1);

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="t-mono t-chip t-chip-amber">STEP 0{n} / 05</span>
        <div className="ml-auto flex gap-2">
          {prev ? (
            <Link href={`/certify-v2/${prev.slug}`} className="t-btn t-btn-ghost text-xs">← 0{prev.n}</Link>
          ) : (
            <Link href="/certify-v2" className="t-btn t-btn-ghost text-xs">← {fr ? 'Aperçu' : 'Overview'}</Link>
          )}
          {next && <Link href={`/certify-v2/${next.slug}`} className="t-btn t-btn-ghost text-xs">0{next.n} →</Link>}
        </div>
      </div>
      <h1 className="t-display mt-4 flex items-center gap-3 text-3xl font-extrabold sm:text-4xl">
        <span className="t-amber">{step.glyph}</span>
        {fr ? step.titleFr : step.titleEn}
      </h1>
      <p className="mt-1 text-sm t-muted">{fr ? step.taglineFr : step.taglineEn}</p>
    </div>
  );
}
