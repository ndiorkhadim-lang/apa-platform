/**
 * Certificate view-model — pure projection of a signed credential into the
 * fields an official, print-ready certificate deliverable displays. No I/O, no
 * formatting locale beyond picking values: deterministic and testable. The
 * credential document remains the single source of truth (the QR points back to
 * /verify for cryptographic proof; this is only the human-facing rendering).
 */

import type { SignedCredential } from '@/domain/certification/credential';

export interface CertificateViewModel {
  holderName: string;
  achievementName: string;
  /** Governance standards the achievement aligns to (e.g. AU, OECD codes). */
  alignments: { code: string; name?: string }[];
  issuerName: string;
  issuerDid: string;
  credentialUrn: string;
  validFrom: string; // ISO 8601
  validUntil: string; // ISO 8601
  /** C-SPA composite (0–100) if present in result[]. */
  composite: number | null;
  /** C-SPA maturity tier label if present in result[]. */
  maturity: string | null;
  /** Ed25519 signature value (multibase) — shown as a tamper-evident fingerprint. */
  proofValue: string;
}

export function toCertificateViewModel(doc: SignedCredential): CertificateViewModel {
  const subject = doc.credentialSubject;
  const results = subject.result ?? [];
  const compositeRaw = results.find((r) => r.resultDescription === 'cspa-composite')?.value;
  const composite = compositeRaw !== undefined && compositeRaw !== '' ? Number(compositeRaw) : null;
  const maturity = results.find((r) => r.resultDescription === 'cspa-maturity')?.value ?? null;

  return {
    holderName: subject.name,
    achievementName: subject.achievement.name,
    alignments: (subject.achievement.alignment ?? []).map((a) => ({
      code: a.targetCode,
      name: a.targetName,
    })),
    issuerName: doc.issuer.name,
    issuerDid: doc.issuer.id,
    credentialUrn: doc.id,
    validFrom: doc.validFrom,
    validUntil: doc.validUntil,
    composite: composite !== null && Number.isFinite(composite) ? composite : null,
    maturity,
    proofValue: doc.proof.proofValue,
  };
}
