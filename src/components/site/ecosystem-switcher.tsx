import { Link } from '@/i18n/navigation';

/**
 * The one intentional bridge between the two APA layers.
 *
 *   to="certification" → Layer 1 (Main) hands off into the Certification Platform.
 *   to="main"          → Layer 2 (Certification terminal) returns to the APA ecosystem.
 *
 * Styling adapts to the surface it sits on (light corporate header vs dark
 * terminal chrome). This is the only sanctioned cross-layer navigation, so the
 * user always understands they are crossing a boundary — never teleported.
 */
export function EcosystemSwitcher({ to }: { to: 'certification' | 'main' }) {
  if (to === 'main') {
    return (
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--t-line)] px-2.5 py-1.5 text-xs font-semibold t-faint transition-colors hover:border-[var(--t-line-strong)] hover:t-amber"
        aria-label="Back to the APA ecosystem"
      >
        <span aria-hidden>◂</span> APA Ecosystem
      </Link>
    );
  }
  return (
    <Link
      href="/certification"
      className="inline-flex items-center gap-1.5 rounded-md bg-apa-green px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
    >
      Certification <span aria-hidden>→</span>
    </Link>
  );
}
