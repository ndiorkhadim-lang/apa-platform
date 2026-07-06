import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function NotFoundPage() {
  const t = await getTranslations('NotFound');

  return (
    <div className="apa-gradient flex min-h-[60vh] items-center justify-center px-4 py-20 text-white">
      <div className="text-center">
        <p className="text-7xl font-extrabold text-apa-gold-bright">{t('code')}</p>
        <h1 className="mt-4 text-2xl font-bold">{t('title')}</h1>
        <div className="apa-rule mx-auto my-6" />
        <p className="mx-auto max-w-md text-sm text-apa-mint">{t('body')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-md bg-apa-gold-bright px-5 py-2.5 text-sm font-semibold text-apa-ink transition-colors hover:bg-apa-gold"
          >
            {t('cta')}
          </Link>
          <Link
            href="/tools"
            className="rounded-md border border-apa-gold-bright px-5 py-2.5 text-sm font-semibold text-apa-gold-bright transition-colors hover:bg-apa-gold-bright hover:text-apa-ink"
          >
            {t('ctaTools')}
          </Link>
        </div>
      </div>
    </div>
  );
}
