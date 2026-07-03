'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 rounded-md border border-apa-line p-0.5 text-xs font-semibold">
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={l === locale}
          onClick={() => router.replace(pathname, { locale: l })}
          className={
            l === locale
              ? 'rounded bg-apa-green px-2 py-1 text-white'
              : 'rounded px-2 py-1 text-apa-grey transition-colors hover:text-apa-green'
          }
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
