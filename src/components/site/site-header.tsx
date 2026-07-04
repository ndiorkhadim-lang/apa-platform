import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { LocaleSwitcher } from './locale-switcher';

const NAV_ITEMS = [
  { key: 'journeys', href: '/journeys' },
  { key: 'tools', href: '/tools' },
  { key: 'solutions', href: '/solutions' },
  { key: 'intelligence', href: '/intelligence' },
  { key: 'certification', href: '/certification' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
] as const;

export async function SiteHeader() {
  const t = await getTranslations('Nav');

  return (
    <header className="sticky top-0 z-50 border-b border-apa-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/apa-logo.png"
            alt="APA — Accountable Partners for Africa"
            width={120}
            height={36}
            priority
            className="h-9 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-apa-ink lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="transition-colors hover:text-apa-green"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <Link
            href="/sign-in"
            className="hidden text-sm font-medium text-apa-ink transition-colors hover:text-apa-green sm:block"
          >
            {t('signIn')}
          </Link>
          <Link
            href="/certification"
            className="rounded-md bg-apa-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-apa-green-mid"
          >
            {t('getCertified')}
          </Link>
        </div>
      </div>
    </header>
  );
}
