import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { LocaleSwitcher } from './locale-switcher';
import { MobileNav, type MobileGroup } from './mobile-nav';
import { UserMenu } from './user-menu';

/**
 * Primary IA (aligned with theapaafrica.org):
 * HOME · ABOUT ▾ · JOURNEYS · FRAMEWORK ▾ · SOLUTIONS · AI CONCIERGE · USER MENU
 */
interface NavChild {
  key: 'about' | 'champions' | 'contact' | 'tools' | 'certification' | 'verify' | 'missionFounders';
  href: string;
}
interface NavItem {
  key: 'home' | 'about' | 'journeys' | 'framework' | 'solutions' | 'aiConcierge';
  href: string;
  children?: NavChild[];
}

const NAV: NavItem[] = [
  { key: 'home', href: '/' },
  {
    key: 'about',
    href: '/about',
    children: [
      { key: 'missionFounders', href: '/about' },
      { key: 'champions', href: '/champions' },
      { key: 'contact', href: '/contact' },
    ],
  },
  { key: 'journeys', href: '/journeys' },
  {
    key: 'framework',
    href: '/tools',
    children: [
      { key: 'tools', href: '/tools' },
      { key: 'certification', href: '/certification' },
      { key: 'verify', href: '/verify' },
    ],
  },
  { key: 'solutions', href: '/solutions' },
  { key: 'aiConcierge', href: '/intelligence' },
];

export async function SiteHeader() {
  const [t, session] = await Promise.all([getTranslations('Nav'), getSession()]);
  const user = session?.user as
    | { name: string; platformRole?: string }
    | undefined;
  const isAdmin = user?.platformRole === 'ADMIN_APA';

  const mobileGroups: MobileGroup[] = NAV.map((item) => ({
    label: t(item.key),
    href: item.href,
    children: item.children?.map((c) => ({ label: t(c.key), href: c.href })),
  }));

  return (
    <header className="sticky top-0 z-50 border-b border-apa-line bg-white/95 backdrop-blur">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label={t('home')}>
          <Image
            src="/apa-logo.png"
            alt="APA — Accountable Partners for Africa"
            width={120}
            height={36}
            priority
            className="h-9 w-auto"
          />
        </Link>

        {/* Desktop primary nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((item) =>
            item.children ? (
              <div key={item.key} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-[13px] font-semibold uppercase tracking-wide text-apa-ink transition-colors hover:text-apa-green"
                >
                  {t(item.key)}
                  <span aria-hidden className="text-[9px] text-apa-grey">▼</span>
                </Link>
                <div className="invisible absolute left-0 top-full z-50 w-64 rounded-apa-lg border border-apa-line bg-white py-1 opacity-0 shadow-xl transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  {item.children.map((c) => (
                    <Link
                      key={c.key}
                      href={c.href}
                      className="block px-4 py-2.5 text-sm text-apa-ink transition-colors hover:bg-apa-soft hover:text-apa-green"
                    >
                      {t(c.key)}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                className="rounded-md px-3 py-2 text-[13px] font-semibold uppercase tracking-wide text-apa-ink transition-colors hover:text-apa-green"
              >
                {t(item.key)}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2.5">
          <LocaleSwitcher />
          <Link
            href="/certification"
            className="hidden rounded-md bg-apa-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-apa-green-mid md:block"
          >
            {t('getCertified')}
          </Link>
          <UserMenu signedIn={Boolean(session)} name={user?.name} isAdmin={isAdmin} />
          <MobileNav groups={mobileGroups} ctaLabel={t('getCertified')} />
        </div>
      </div>
    </header>
  );
}
