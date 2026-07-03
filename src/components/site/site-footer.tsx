import { getTranslations } from 'next-intl/server';

export async function SiteFooter() {
  const t = await getTranslations('Footer');

  return (
    <footer className="apa-gradient text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-lg italic text-apa-gold-bright">{t('mantra')}</p>
        <div className="apa-rule my-6" />
        <blockquote className="max-w-2xl text-sm text-apa-mint">
          {t('quote')}
          <footer className="mt-1 text-apa-sage">— {t('quoteSource')}</footer>
        </blockquote>
        <p className="mt-8 text-xs text-apa-sage">
          {t('rights', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
