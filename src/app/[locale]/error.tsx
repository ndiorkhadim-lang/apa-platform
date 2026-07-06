'use client';

import { useTranslations } from 'next-intl';

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('ErrorPage');

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-20">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-2xl font-bold text-apa-green">{t('title')}</h1>
        <div className="apa-rule mx-auto my-6" />
        <p className="text-sm text-apa-grey">{t('body')}</p>
        {error.digest ? (
          <p className="mt-2 font-mono text-xs text-apa-grey">ref: {error.digest}</p>
        ) : null}
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-md bg-apa-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-apa-green-mid"
        >
          {t('retry')}
        </button>
      </div>
    </div>
  );
}
