import 'server-only';
import { getIssuerConfig } from '@/infrastructure/certification/issuer';
import { signDocument } from '@/infrastructure/crypto/ed25519-signer';
import { assembleBadgeCredential, type SignedBadgeCredential } from '@/domain/scoring/badge-credential';
import type { Badge } from '@/domain/scoring/scoring';

/**
 * Issue a signed Open Badges 3.0 credential for an earned badge, using the same
 * Ed25519 issuer key as the main certificate. Returns null when the issuer key
 * is not configured (the caller responds 503). Verifiable offline via
 * verifyDocument + the issuer public key.
 */
export function issueBadgeCredential(
  badge: Badge,
  subject: { name: string; key: string },
  locale?: string,
): SignedBadgeCredential | null {
  const issuer = getIssuerConfig();
  if (!issuer.privateKeyPem) return null;

  const unsigned = assembleBadgeCredential({
    badge,
    subjectName: subject.name,
    subjectKey: subject.key,
    issuerDid: issuer.did,
    issuerName: issuer.name,
    validFrom: new Date(),
    locale,
  });

  const proof = signDocument(unsigned as unknown as Record<string, unknown>, {
    privateKey: issuer.privateKeyPem,
    verificationMethod: issuer.verificationMethod,
    created: unsigned.validFrom,
  });

  return { ...unsigned, proof };
}
