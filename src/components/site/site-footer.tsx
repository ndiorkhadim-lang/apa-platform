import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

const FOOTER_GROUPS = [
  {
    titleKey: 'platform' as const,
    links: [
      { key: 'journeys', href: '/journeys' },
      { key: 'tools', href: '/tools' },
      { key: 'solutions', href: '/solutions' },
      { key: 'intelligence', href: '/intelligence' },
    ],
  },
  {
    titleKey: 'certification' as const,
    links: [
      { key: 'certification', href: '/certification' },
      { key: 'about', href: '/about' },
      { key: 'contact', href: '/contact' },
    ],
  },
];

export async function SiteFooter() {
  const [t, tNav, tFooterNav] = await Promise.all([
    getTranslations('Footer'),
    getTranslations('Nav'),
    getTranslations('FooterNav'),
  ]);

  return (
    <footer className="apa-gradient text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="text-lg italic text-apa-gold-bright">{t('mantra')}</p>
            <div className="apa-rule my-6" />
            <blockquote className="max-w-md text-sm text-apa-mint">
              {t('quote')}
              <footer className="mt-1 text-apa-sage">— {t('quoteSource')}</footer>
            </blockquote>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <nav key={group.titleKey} aria-label={tFooterNav(group.titleKey)}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-apa-gold-bright">
                {tFooterNav(group.titleKey)}
              </h2>
              <ul className="mt-4 space-y-2 text-sm">
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-apa-mint transition-colors hover:text-white"
                    >
                      {tNav(l.key)}
                    </Link>
                  </li>
                ))}
                {group.titleKey === 'certification' ? (
                  <li>
                    <Link
                      href="/verify"
                      className="text-apa-mint transition-colors hover:text-white"
                    >
                      /verify
                    </Link>
                  </li>
                ) : null}
              </ul>
            </nav>
          ))}
        </div>

        <p className="mt-10 border-t border-white/15 pt-6 text-xs text-apa-sage">
          {t('rights', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
