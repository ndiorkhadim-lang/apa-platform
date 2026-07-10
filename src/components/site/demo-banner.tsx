import { Link } from '@/i18n/navigation';

/**
 * Demo Mode ribbon — shown at the top of protected pages when they are
 * being previewed without a session. Makes the access mode unambiguous:
 * everything is viewable, nothing is persisted.
 */
export function DemoBanner({
  locale,
  note,
}: {
  locale: string;
  note?: string;
}) {
  const fr = locale !== 'en';
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-apa-lg border border-apa-gold bg-apa-gold/10 px-4 py-3">
      <p className="text-sm text-apa-ink">
        <span className="mr-2 rounded bg-apa-gold px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-apa-ink">
          🎭 {fr ? 'Mode Démo' : 'Demo Mode'}
        </span>
        <span className="font-semibold">
          {note ?? (fr
            ? 'Aperçu en lecture seule — les soumissions, enregistrements et paiements sont désactivés.'
            : 'Read-only preview — submissions, saving and payments are disabled.')}
        </span>
      </p>
      <Link
        href="/sign-up"
        className="shrink-0 rounded-md bg-apa-green px-3 py-1.5 text-xs font-bold text-white hover:bg-apa-green-mid"
      >
        {fr ? 'Créer un compte pour l’expérience complète' : 'Create an account for the full experience'}
      </Link>
    </div>
  );
}
