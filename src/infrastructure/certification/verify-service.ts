/**
 * Public credential-integrity check for the /verify route.
 *
 * Replays the Ed25519 signature over the stored JSON-LD document. Pure and
 * offline — no network, no did:web fetch — so the page meets the < 150ms SLA
 * (Règle 03). The issuer public key is provided out-of-band via env; the DID
 * document at /.well-known/did.json should expose the same key for third parties.
 */

import { verifyCredential } from '@/infrastructure/crypto/ed25519-signer';
import { isRevoked } from '@/infrastructure/certification/status-list-service';
import type { SignedCredential } from '@/domain/certification/credential';

export type IntegrityState =
  | 'VALID' // signature verified — tamper-proof
  | 'INVALID' // signature mismatch — document altered or wrong key
  | 'UNAVAILABLE'; // no issuer key configured — cannot assert integrity

/** Final public verdict: signature validity layered with revocation status. */
export type CredentialVerdict = IntegrityState | 'REVOKED';

/**
 * Deterministic integrity verdict. `publicKeyPem` null → UNAVAILABLE (honest:
 * we render the credential but do not claim a verified signature).
 */
export function checkIntegrity(
  document: SignedCredential,
  publicKeyPem: string | null,
): IntegrityState {
  if (!publicKeyPem) return 'UNAVAILABLE';
  try {
    return verifyCredential(document, publicKeyPem) ? 'VALID' : 'INVALID';
  } catch {
    return 'INVALID';
  }
}

/** Issuer Ed25519 public key (PEM), or null when unconfigured. */
export function issuerPublicKeyPem(): string | null {
  const pem = process.env.APA_ISSUER_PUBLIC_KEY_PEM;
  return pem && pem.trim().length > 0 ? pem : null;
}

/**
 * Full public verdict for /verify. Signature is checked first (a tampered or
 * unverifiable document never reaches the revocation check); then, if the
 * credential carries a StatusList2021 entry, its bit is read from the resolved
 * `encodedList`. Revocation only downgrades a VALID signature to REVOKED — it
 * never upgrades an INVALID one.
 *
 * `resolveEncodedList` maps a statusListCredential URL → its `encodedList`
 * (or null when unresolved). Injected so the verdict stays testable offline.
 */
export async function resolveVerdict(
  document: SignedCredential,
  publicKeyPem: string | null,
  resolveEncodedList: (statusListCredential: string) => Promise<string | null>,
): Promise<CredentialVerdict> {
  const integrity = checkIntegrity(document, publicKeyPem);
  if (integrity !== 'VALID') return integrity;

  const status = document.credentialStatus;
  if (!status) return 'VALID';

  const encoded = await resolveEncodedList(status.statusListCredential);
  if (!encoded) return 'VALID'; // registry unresolved → do not falsely revoke

  const index = Number.parseInt(status.statusListIndex, 10);
  return isRevoked(encoded, index) ? 'REVOKED' : 'VALID';
}
