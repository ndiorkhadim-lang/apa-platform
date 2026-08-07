import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

/**
 * Sovereign Credential Registry header — the trust navigation for /verify.
 * Full pitch-black, gold/emerald authority accents. Built for external auditors,
 * ministries, and multilateral institutions (AU, AfDB, WB). Server-rendered;
 * locale switch is explicit per-locale hrefs on the same credential.
 */
const LINE = 'border-[#262626]';

export async function SovereignHeader({
  locale,
  credentialId,
}: {
  locale: string;
  credentialId?: string;
}) {
  const t = await getTranslations('VerifyCredential');
  // On the registry index there is no credential context: the FR|EN switcher
  // and Audit Trail anchor fall back to the registry home.
  const localeHref = (lng: string) => (credentialId ? `/${lng}/verify/${encodeURIComponent(credentialId)}` : `/${lng}/verify`);
  const auditHref = credentialId ? '#audit-trail' : `/${locale}/verify/specs`;

  const nav: { label: string; href: string; external?: boolean }[] = [
    { label: t('registry.nav.publicRegistry'), href: `/${locale}/verify` },
    { label: t('registry.nav.vcSpec'), href: 'https://www.w3.org/TR/vc-data-model-2.0/', external: true },
    { label: t('registry.nav.statusList'), href: '/api/v1/credentials/status-list', external: true },
    { label: t('registry.nav.didSpec'), href: '/.well-known/did.json', external: true },
  ];

  return (
    <header className={`sticky top-0 z-50 border-b ${LINE} bg-black/90 backdrop-blur`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        {/* Left — official logo + sovereign badge */}
        <div className="flex shrink-0 items-center gap-3">
          <Image
            src="/apa-logo.png"
            alt="APA — Accountable Partners for Africa"
            width={110}
            height={33}
            priority
            className="h-8 w-auto brightness-0 invert"
          />
          <span className="hidden items-center gap-1.5 rounded-full border border-apa-gold-bright/40 bg-apa-gold-bright/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-apa-gold-bright sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
            {t('registry.badge')}
          </span>
        </div>

        {/* Center — verification & audit navigation */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Registry">
          {nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="rounded-md px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-neutral-400 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right — FR | EN switcher + Audit Trail */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center rounded-md border ${LINE} text-[11px] font-bold`}>
            {(['fr', 'en'] as const).map((lng, i) => (
              <a
                key={lng}
                href={localeHref(lng)}
                className={`px-2.5 py-1 uppercase transition-colors ${
                  locale === lng ? 'bg-apa-gold-bright text-black' : 'text-neutral-400 hover:text-white'
                } ${i === 0 ? 'rounded-l-md' : 'rounded-r-md'}`}
              >
                {lng}
              </a>
            ))}
          </div>
          <a
            href={auditHref}
            className="rounded-md border border-apa-gold-bright/50 px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wide text-apa-gold-bright transition-colors hover:bg-apa-gold-bright hover:text-black"
          >
            {t('registry.auditTrail')}
          </a>
        </div>
      </div>
    </header>
  );
}
