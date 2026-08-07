/**
 * Public credential verification — /verify/[credentialId] (Règle 03).
 *
 * Zero auth, zero cookie wall: a single indexed lookup + an in-process Ed25519
 * replay, rendered as a Server Component on the black Authenticity Premium™
 * canvas. No client JS. credentialId accepts the credential UUID (from the QR /
 * urn) or the human public number.
 */

import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { prisma, dbAvailable } from '@/infrastructure/prisma/client';
import { resolveVerdict, issuerPublicKeyPem } from '@/infrastructure/certification/verify-service';
import { getRevokedIndices } from '@/infrastructure/certification/prisma-issuance-repository';
import { buildEncodedStatusList } from '@/infrastructure/certification/status-list-service';
import { CredentialView } from '@/components/verify/credential-view';
import { SovereignHeader } from '@/components/verify/sovereign-header';
import type { SignedCredential } from '@/domain/certification/credential';

// Dynamic: revocation status must be reflected immediately. No cookies read.
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; credentialId: string }>;
}): Promise<Metadata> {
  const { locale, credentialId } = await params;
  const t = await getTranslations({ locale, namespace: 'VerifyCredential' });
  return {
    title: `${t('metaTitle')} · ${credentialId}`,
    robots: { index: false }, // credential pages are shared by link, not indexed
  };
}

export default async function VerifyCredentialPage({
  params,
}: {
  params: Promise<{ locale: string; credentialId: string }>;
}) {
  const { locale, credentialId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('VerifyCredential');

  const id = credentialId.trim();
  const record = dbAvailable
    ? await prisma.certificate.findFirst({
        where: { OR: [{ credentialUuid: id }, { publicNumber: id.toUpperCase() }] },
        select: {
          publicNumber: true,
          status: true,
          issuedAt: true,
          expiresAt: true,
          document: true,
        },
      })
    : null;

  return (
    <main className="min-h-screen bg-black text-neutral-100">
      <SovereignHeader locale={locale} credentialId={credentialId} />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        {record ? (
          <>
          <div className="mb-4 flex justify-end">
            <a
              href={`/${locale}/verify/${credentialId}/certificate`}
              className="inline-flex items-center gap-1.5 rounded-full border border-apa-gold-bright/40 bg-apa-gold-bright/5 px-4 py-2 text-xs font-semibold text-apa-gold-bright transition-colors hover:bg-apa-gold-bright/15"
            >
              📄 {t('downloadCertificate')} <span aria-hidden className="text-emerald-400">↓</span>
            </a>
          </div>
          <CredentialView
            document={record.document as unknown as SignedCredential}
            verdict={await resolveVerdict(
              record.document as unknown as SignedCredential,
              issuerPublicKeyPem(),
              async () => buildEncodedStatusList(await getRevokedIndices()),
            )}
            status={record.status}
            publicNumber={record.publicNumber}
            issuedAt={record.issuedAt}
            expiresAt={record.expiresAt}
            locale={locale}
          />
          </>
        ) : (
          <div className="rounded-2xl border border-[#262626] bg-neutral-950 p-8 text-center">
            <p className="text-4xl font-black text-neutral-700">✕</p>
            <h1 className="mt-4 text-lg font-bold text-white">{t('notFound.title')}</h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-neutral-400">
              {t('notFound.detail', { id })}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
