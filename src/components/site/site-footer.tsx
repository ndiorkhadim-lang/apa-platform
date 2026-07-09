import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { APA_CONTACT, APA_OFFICES, APA_SOCIALS } from '@/domain/site/contact';

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
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1.3fr]">
          {/* Brand + mantra */}
          <div>
            <p className="text-lg italic text-apa-gold-bright">{t('mantra')}</p>
            <div className="apa-rule my-6" />
            <blockquote className="max-w-md text-sm text-apa-mint">
              {t('quote')}
              <footer className="mt-1 text-apa-sage">— {t('quoteSource')}</footer>
            </blockquote>
          </div>

          {/* Platform + Certification nav */}
          {FOOTER_GROUPS.map((group) => (
            <nav key={group.titleKey} aria-label={tFooterNav(group.titleKey)}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-apa-gold-bright">
                {tFooterNav(group.titleKey)}
              </h2>
              <ul className="mt-4 space-y-2 text-sm">
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-apa-mint transition-colors hover:text-white">
                      {tNav(l.key)}
                    </Link>
                  </li>
                ))}
                {group.titleKey === 'certification' ? (
                  <li>
                    <Link href="/verify" className="text-apa-mint transition-colors hover:text-white">
                      /verify
                    </Link>
                  </li>
                ) : null}
              </ul>
            </nav>
          ))}

          {/* Contact us — reach + socials */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-apa-gold-bright">
              {tFooterNav('contactUs')}
            </h2>
            <div className="mt-4 space-y-1.5 text-sm text-apa-mint">
              <p className="font-semibold text-white">{APA_CONTACT.entity}</p>
              <p>
                <a href={`mailto:${APA_CONTACT.email}`} className="transition-colors hover:text-white">
                  {APA_CONTACT.email}
                </a>
              </p>
              <p>
                <a href={`tel:${APA_CONTACT.phoneHref}`} className="transition-colors hover:text-white">
                  {APA_CONTACT.phone}
                </a>
              </p>
              <p>
                <a href={APA_CONTACT.website} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                  theapaafrica.org
                </a>
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              {APA_SOCIALS.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-sm font-bold text-apa-gold-bright transition-colors hover:bg-apa-gold-bright hover:text-apa-ink"
                >
                  {s.glyph}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Our offices — the 3 official addresses */}
        <div className="mt-10 border-t border-white/15 pt-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-apa-gold-bright">
            {tFooterNav('offices')}
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            {APA_OFFICES.map((o) => (
              <address key={o.country} className="text-sm not-italic text-apa-mint">
                <p className="font-semibold text-white">
                  {o.flag} {o.country}
                  {o.isHQ ? <span className="ml-2 rounded bg-apa-gold-bright px-1.5 py-0.5 text-[9px] font-bold uppercase text-apa-ink">HQ</span> : null}
                </p>
                {o.lines.map((line) => (
                  <p key={line} className="text-apa-sage">{line}</p>
                ))}
              </address>
            ))}
          </div>
        </div>

        <p className="mt-8 border-t border-white/15 pt-6 text-xs text-apa-sage">
          {t('rights', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
