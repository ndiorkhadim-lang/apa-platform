/**
 * did:web document assembly (W3C DID Core + Ed25519VerificationKey2020).
 *
 * Pure. The infrastructure layer derives `publicKeyMultibase` from the issuer
 * PEM (node:crypto) and passes it in; this module only shapes the JSON that
 * https://<domain>/.well-known/did.json must serve so that any W3C verifier can
 * resolve did:web:<domain> and check our credential signatures.
 */

export const DID_CONTEXT = [
  'https://www.w3.org/ns/did/v1',
  'https://w3id.org/security/suites/ed25519-2020/v1',
] as const;

export interface VerificationMethod {
  id: string;
  type: 'Ed25519VerificationKey2020';
  controller: string;
  publicKeyMultibase: string;
}

export interface DidDocument {
  '@context': typeof DID_CONTEXT;
  id: string;
  verificationMethod: VerificationMethod[];
  assertionMethod: string[];
  authentication: string[];
}

/** did:web:<domain> for a given host. */
export function didWebFor(domain: string): string {
  return `did:web:${domain}`;
}

/** Build the DID document exposing one Ed25519 assertion key (#key-1 by default). */
export function buildDidDocument(params: {
  did: string;
  publicKeyMultibase: string;
  keyFragment?: string;
}): DidDocument {
  const keyId = `${params.did}#${params.keyFragment ?? 'key-1'}`;
  return {
    '@context': DID_CONTEXT,
    id: params.did,
    verificationMethod: [
      {
        id: keyId,
        type: 'Ed25519VerificationKey2020',
        controller: params.did,
        publicKeyMultibase: params.publicKeyMultibase,
      },
    ],
    assertionMethod: [keyId],
    authentication: [keyId],
  };
}
