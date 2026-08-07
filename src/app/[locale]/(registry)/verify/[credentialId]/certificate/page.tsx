/**
 * Official certificate deliverable — /verify/[credentialId]/certificate.
 *
 * A print-ready A4 sheet (browser print → PDF, no headless Chrome needed on
 * serverless). The document itself is human-facing; authenticity lives in the
 * QR, which encodes the public /verify URL for a cryptographic Ed25519 replay.
 * Reads the same Certificate record as the verify page — single source of truth.
 */

import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations, getFormatter } from 'next-intl/server';
import { prisma, dbAvailable } from '@/infrastructure/prisma/client';
import { toCertificateViewModel } from '@/domain/certification/certificate-view-model';
import { qrSvg } from '@/infrastructure/pdf/qr';
import { PrintButton } from '@/components/cspa/print-button';
import type { SignedCredential } from '@/domain/certification/credential';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; credentialId: string }>;
}): Promise<Metadata> {
  const { credentialId } = await params;
  return { title: `APA™ Certificate · ${credentialId}`, robots: { index: false } };
}

async function baseUrl(): Promise<string> {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (env) return env;
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'https';
  return host ? `${proto}://${host}` : '';
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ locale: string; credentialId: string }>;
}) {
  const { locale, credentialId } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';
  const t = await getTranslations('Certificate');
  const format = await getFormatter();

  const id = credentialId.trim();
  const record = dbAvailable
    ? await prisma.certificate.findFirst({
        where: { OR: [{ credentialUuid: id }, { publicNumber: id.toUpperCase() }] },
        select: { publicNumber: true, status: true, issuedAt: true, expiresAt: true, document: true },
      })
    : null;

  if (!record) notFound();

  const vm = toCertificateViewModel(record.document as unknown as SignedCredential);
  const verifyUrl = `${await baseUrl()}/${locale}/verify/${record.publicNumber}`;
  const qr = await qrSvg(verifyUrl, { dark: '#0B3D2E' });
  const revoked = record.status === 'REVOKED';

  const issued = record.issuedAt ?? new Date(vm.validFrom);
  const expires = record.expiresAt ?? new Date(vm.validUntil);

  return (
    <main className="min-h-screen bg-black py-10 text-neutral-100 print:bg-white print:py-0">
      {/* Toolbar — screen only */}
      <div className="mx-auto mb-6 flex max-w-[210mm] items-center justify-between px-4 print:hidden">
        <a href={`/${locale}/verify/${record.publicNumber}`} className="text-sm text-neutral-400 hover:text-white">
          ← {t('backToVerify')}
        </a>
        <PrintButton label={t('print')} />
      </div>

      {/* The A4 sheet */}
      <article className="mx-auto w-[210mm] max-w-full bg-white text-[#0B3D2E] shadow-2xl print:shadow-none">
        <div className="relative border-[6px] border-double border-[#C9A227] p-[14mm] print:min-h-[297mm]">
          {revoked && (
            <p className="mb-4 rounded border border-red-600 bg-red-50 px-3 py-1.5 text-center text-xs font-bold uppercase tracking-widest text-red-700 print:border-red-600">
              {t('revoked')}
            </p>
          )}

          {/* Masthead */}
          <header className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C9A227]">{vm.issuerName}</p>
            <h1 className="mt-3 font-serif text-3xl font-black tracking-tight">{t('title')}</h1>
            <div className="mx-auto mt-3 h-px w-24 bg-[#C9A227]" />
          </header>

          {/* Statement */}
          <section className="mt-10 text-center">
            <p className="text-sm uppercase tracking-widest text-neutral-500">{t('certifies')}</p>
            <p className="mt-4 font-serif text-4xl font-bold">{vm.holderName}</p>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-neutral-700">
              {t('hasEarned')}
            </p>
            <p className="mt-3 font-serif text-2xl font-bold text-[#C9A227]">{vm.achievementName}</p>
          </section>

          {/* Standing */}
          {(vm.composite !== null || vm.maturity) && (
            <section className="mx-auto mt-8 flex max-w-md items-stretch justify-center divide-x divide-[#C9A227]/40 rounded-lg border border-[#C9A227]/40 text-center">
              {vm.composite !== null && (
                <div className="flex-1 px-5 py-3">
                  <p className="font-mono text-2xl font-black text-[#0B3D2E]">{vm.composite}</p>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500">{t('composite')}</p>
                </div>
              )}
              {vm.maturity && (
                <div className="flex-1 px-5 py-3">
                  <p className="text-lg font-bold text-[#0B3D2E]">{vm.maturity}</p>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500">{t('maturity')}</p>
                </div>
              )}
            </section>
          )}

          {/* Alignments */}
          {vm.alignments.length > 0 && (
            <section className="mt-8 text-center">
              <p className="text-[10px] uppercase tracking-widest text-neutral-500">{t('aligned')}</p>
              <p className="mt-2 text-xs text-neutral-700">
                {vm.alignments.map((a) => a.name ?? a.code).join('  ·  ')}
              </p>
            </section>
          )}

          {/* Footer: dates + QR + signature */}
          <footer className="mt-12 flex items-end justify-between gap-6">
            <div className="text-left text-xs text-neutral-600">
              <p><b className="text-[#0B3D2E]">{t('issued')}:</b> {format.dateTime(issued, { dateStyle: 'long' })}</p>
              <p><b className="text-[#0B3D2E]">{t('expires')}:</b> {format.dateTime(expires, { dateStyle: 'long' })}</p>
              <p className="mt-2"><b className="text-[#0B3D2E]">{t('serial')}:</b> <span className="font-mono">{record.publicNumber}</span></p>
              <p className="mt-2 max-w-[64mm] break-all font-mono text-[9px] text-neutral-500">
                {vm.issuerDid} · {vm.proofValue.slice(0, 24)}…
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-[26mm] w-[26mm]" dangerouslySetInnerHTML={{ __html: qr }} />
              <p className="mt-1.5 text-[9px] uppercase tracking-widest text-neutral-500">{t('scanToVerify')}</p>
            </div>

            <div className="text-right text-xs text-neutral-600">
              <div className="ml-auto w-40 border-b border-[#0B3D2E] pb-8" />
              <p className="mt-1 font-semibold text-[#0B3D2E]">{t('registrar')}</p>
              <p className="text-[10px]">{vm.issuerName}</p>
            </div>
          </footer>

          {/* Sovereign sign-off (brand doctrine: once, at close) */}
          <p className="mt-10 border-t border-[#C9A227]/40 pt-4 text-center text-[10px] italic text-neutral-500">
            {fr
              ? 'Crédential vérifiable Ed25519 · réplique cryptographique hors-ligne via la clé publiée de l’émetteur (did:web).'
              : 'Ed25519 verifiable credential · offline cryptographic replay via the issuer’s published key (did:web).'}
            {'  '}“Ethics into Alpha. Trust as Currency.”
          </p>
        </div>
      </article>
    </main>
  );
}
