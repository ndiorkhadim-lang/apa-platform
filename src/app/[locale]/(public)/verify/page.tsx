export const dynamic = 'force-dynamic';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader } from '@/components/site/section-header';
import { dbAvailable } from '@/infrastructure/prisma/client';
import { DBNotReady } from '@/components/site/db-not-ready';
import { prisma } from '@/infrastructure/prisma/client';
import type { CertificateStatus } from '@/generated/prisma/client';

const STATUS_STYLE: Record<CertificateStatus, string> = {
  ACTIVE: 'bg-apa-green text-white',
  EXPIRED: 'bg-apa-gold text-apa-ink',
  REVOKED: 'bg-red-700 text-white',
};

export default async function VerifyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!dbAvailable) return <DBNotReady locale={locale} />;
  const sp = await searchParams;
  const t = await getTranslations('Verify');
  const format = await getFormatter();

  const number = typeof sp.n === 'string' ? sp.n.trim().toUpperCase() : '';

  const certificate = number
    ? await prisma.certificate.findUnique({
        where: { publicNumber: number },
        include: { journey: { include: { org: true } } },
      })
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SectionHeader num="✓" title={t('title')} subtitle={t('subtitle')} />

      {/* Public lookup — the "trust as currency" endpoint */}
      <form method="GET" className="mt-8 flex flex-wrap gap-3">
        <input
          type="text"
          name="n"
          defaultValue={number}
          placeholder={t('placeholder')}
          className="min-w-64 flex-1 rounded-md border border-apa-line bg-white px-4 py-3 font-mono text-sm uppercase tracking-wide text-apa-ink"
        />
        <button
          type="submit"
          className="rounded-md bg-apa-green px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-apa-green-mid"
        >
          {t('button')}
        </button>
      </form>

      {number && !certificate ? (
        <div className="apa-box apa-box-gold mt-8 p-5 text-sm text-apa-ink">
          {t('notFound', { number })}
        </div>
      ) : null}

      {certificate ? (
        <div className="mt-8 overflow-hidden rounded-apa-lg border border-apa-line">
          <div className="apa-gradient flex items-center justify-between gap-4 p-5">
            <span className="font-mono text-lg font-bold text-white">
              {certificate.publicNumber}
            </span>
            <span
              className={`rounded px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${STATUS_STYLE[certificate.status]}`}
            >
              {t(`statuses.${certificate.status}`)}
            </span>
          </div>
          <dl className="grid gap-4 bg-white p-5 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs font-bold uppercase text-apa-grey">{t('org')}</dt>
              <dd className="mt-1 font-semibold text-apa-navy">
                {certificate.journey.org.name}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-apa-grey">{t('issued')}</dt>
              <dd className="mt-1">{format.dateTime(certificate.issuedAt, { dateStyle: 'long' })}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-apa-grey">{t('expires')}</dt>
              <dd className="mt-1">{format.dateTime(certificate.expiresAt, { dateStyle: 'long' })}</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </div>
  );
}
