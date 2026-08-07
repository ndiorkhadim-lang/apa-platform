import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { GLOSSARY_TERMS } from '@/domain/glossary/terms';
import { GlossaryExplorer } from '@/components/terminal/glossary-explorer';

export const metadata: Metadata = {
  title: 'Glossaire Souverain · APA Terminal',
  robots: { index: false },
};

export default async function GlossaryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';

  return (
    <div className="space-y-8">
      {/* Hero */}
      <header className="t-glass rounded-2xl p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="t-chip t-chip-emerald text-[10px]">
            <span className="t-live-dot" /> {fr ? 'RÉFÉRENTIEL CANONIQUE' : 'CANONICAL REFERENCE'}
          </span>
          <span className="t-mono text-xs t-faint">{GLOSSARY_TERMS.length} {fr ? 'concepts' : 'concepts'}</span>
        </div>
        <h1 className="t-display mt-3 text-2xl font-extrabold tracking-tight">
          {fr ? 'Glossaire Souverain' : 'Sovereign Glossary'}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed t-muted">
          {fr
            ? 'Chaque concept fondamental de l’écosystème de certification APA, ancré dans le Master Memoire — recherchable et téléchargeable en PDF exécutif.'
            : 'Every core concept of the APA certification ecosystem, grounded in the Master Memoire — searchable and downloadable as an executive PDF.'}
        </p>
      </header>

      <GlossaryExplorer locale={locale} terms={GLOSSARY_TERMS} />

      {/* Next Step CTA */}
      <div className="t-glass flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5 print:hidden">
        <div>
          <p className="t-display text-sm font-bold">{fr ? 'Étape suivante' : 'Next step'}</p>
          <p className="mt-1 text-xs t-muted">
            {fr
              ? 'Lancez le diagnostic C-SPA pour convertir ces concepts en score de crédibilité.'
              : 'Run the C-SPA diagnostic to convert these concepts into a credibility score.'}
          </p>
        </div>
        <Link href="/certify-v2/cspa" className="t-btn text-sm">
          {fr ? 'Ouvrir le diagnostic C-SPA →' : 'Open the C-SPA diagnostic →'}
        </Link>
      </div>
    </div>
  );
}
