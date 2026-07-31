/**
 * W3C Verifiable Credential 2.0 / Open Badges 3.0 document assembly.
 *
 * Pure. Builds the *unsigned* credential from an issuance context and exposes
 * the deterministic canonicalization used for the Ed25519 signature. The
 * signer (infrastructure) turns an UnsignedCredential into a SignedCredential
 * by appending `proof`.
 *
 * Canonicalization note: we use JCS-style canonical JSON (RFC 8785 — recursive
 * key sorting), the scheme of the `eddsa-jcs-2022` Data Integrity cryptosuite.
 * The PDF spec labels the proof `Ed25519Signature2020`; that suite formally
 * mandates URDNA2015 RDF canonicalization. We keep the spec's proof.type label
 * for ecosystem continuity but sign over JCS bytes — deterministic, dependency-
 * free, and verifiable offline. Swapping in URDNA2015 is a drop-in at the
 * signer boundary and changes nothing in this module's contract.
 */

import {
  buildEvidenceItems,
  buildResultItems,
  type ToolEvidence,
  type CredentialEvidenceItem,
  type CredentialResultItem,
} from './evidence';

export const VC_CONTEXT = [
  'https://www.w3.org/ns/credentials/v2',
  'https://purl.imsglobal.org/spec/ob/v3p0/context.json',
  { apa: 'https://theapaafrica.org/credentials/vocab#' },
] as const;

export interface AchievementSpec {
  id: string;
  name: string;
  alignment: { targetCode: string; targetName?: string }[];
}

export interface CredentialStatusEntry {
  id: string;
  type: 'BitstringStatusListEntry';
  statusPurpose: 'revocation';
  statusListIndex: string;
  statusListCredential: string;
}

export interface Proof {
  type: 'Ed25519Signature2020';
  created: string; // ISO 8601
  verificationMethod: string; // did:web:...#key-1
  proofPurpose: 'assertionMethod';
  proofValue: string; // multibase base58btc, 'z'-prefixed
}

export interface UnsignedCredential {
  '@context': typeof VC_CONTEXT;
  id: string; // urn:uuid:...
  type: ['VerifiableCredential', 'OpenBadgeCredential'];
  issuer: { id: string; name: string };
  validFrom: string; // ISO 8601
  validUntil: string; // ISO 8601
  credentialStatus?: CredentialStatusEntry;
  credentialSubject: {
    type: ['AchievementSubject'];
    name: string;
    achievement: {
      id: string;
      type: ['Achievement'];
      name: string;
      alignment: { targetCode: string; targetName?: string }[];
    };
    result: CredentialResultItem[];
    evidence: CredentialEvidenceItem[];
  };
}

export interface SignedCredential extends UnsignedCredential {
  proof: Proof;
}

export interface AssembleParams {
  credentialUrn: string; // urn:uuid:...
  issuerDid: string;
  issuerName: string;
  subjectName: string;
  achievement: AchievementSpec;
  cspa: { composite: number; maturity: string };
  evidence: ToolEvidence[];
  validFrom: Date;
  validUntil: Date;
  credentialStatus?: CredentialStatusEntry;
}

/** Assemble the unsigned credential. Deterministic given identical params. */
export function assembleUnsignedCredential(p: AssembleParams): UnsignedCredential {
  return {
    '@context': VC_CONTEXT,
    id: p.credentialUrn,
    type: ['VerifiableCredential', 'OpenBadgeCredential'],
    issuer: { id: p.issuerDid, name: p.issuerName },
    validFrom: p.validFrom.toISOString(),
    validUntil: p.validUntil.toISOString(),
    ...(p.credentialStatus ? { credentialStatus: p.credentialStatus } : {}),
    credentialSubject: {
      type: ['AchievementSubject'],
      name: p.subjectName,
      achievement: {
        id: p.achievement.id,
        type: ['Achievement'],
        name: p.achievement.name,
        alignment: p.achievement.alignment,
      },
      result: buildResultItems(p.cspa.composite, p.cspa.maturity),
      evidence: buildEvidenceItems(p.evidence, p.credentialUrn),
    },
  };
}

/**
 * RFC 8785-style canonical JSON: recursively sorts object keys, preserves array
 * order, and serializes with no insignificant whitespace. Deterministic — the
 * exact byte string the signature commits to.
 */
export function canonicalize(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  const entries = Object.keys(value as Record<string, unknown>)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${canonicalize((value as Record<string, unknown>)[k])}`);
  return `{${entries.join(',')}}`;
}

/** The exact UTF-8 bytes the signer signs (canonical form of the unsigned VC). */
export function signingPayload(unsigned: UnsignedCredential): Uint8Array {
  return new TextEncoder().encode(canonicalize(unsigned));
}
