import { describe, it, expect } from 'vitest';
import { generateKeyPairSync } from 'node:crypto';
import {
  createEd25519Signer,
  publicKeyMultibase,
  publicKeyFromMultibase,
} from '@/infrastructure/crypto/ed25519-signer';
import { buildDidDocument } from '@/domain/certification/did';
import { assembleUnsignedCredential, type SignedCredential } from '@/domain/certification/credential';
import { checkIntegrity } from '@/infrastructure/certification/verify-service';
import { ALL_REQUIRED_TOOL_NUMBERS, type ToolEvidence } from '@/domain/certification/evidence';

const DID = 'did:web:apa-platform-five.vercel.app';

function ev(n: number): ToolEvidence {
  return {
    toolNumber: n, toolSlug: `tool-${n}`, toolName: `Tool ${n}`,
    category: 'FORM', score: 80, reportId: `rpt_${n}`, completedAt: new Date('2026-07-01T00:00:00Z'),
  };
}

describe('multibase key round-trip', () => {
  it('encodes and resolves an Ed25519 public key losslessly', () => {
    const { publicKey } = generateKeyPairSync('ed25519');
    const mb = publicKeyMultibase(publicKey);
    expect(mb.startsWith('z6Mk')).toBe(true); // ed25519-pub multicodec signature
    const resolved = publicKeyFromMultibase(mb);
    const a = publicKey.export({ type: 'spki', format: 'der' });
    const b = resolved.export({ type: 'spki', format: 'der' });
    expect(Buffer.compare(a, b)).toBe(0);
  });

  it('rejects a non-Ed25519 multicodec', () => {
    expect(() => publicKeyFromMultibase('z' + 'X'.repeat(10))).toThrow();
  });
});

describe('end-to-end: issue → publish DID → resolve → verify VALID', () => {
  it('a verifier resolving did:web confirms the signature', async () => {
    // 1. Issuer keypair.
    const { publicKey, privateKey } = generateKeyPairSync('ed25519');

    // 2. Publish the DID document (what /.well-known/did.json serves).
    const didDoc = buildDidDocument({ did: DID, publicKeyMultibase: publicKeyMultibase(publicKey) });
    expect(didDoc.assertionMethod).toContain(`${DID}#key-1`);

    // 3. Issue & sign a credential.
    const unsigned = assembleUnsignedCredential({
      credentialUrn: 'urn:uuid:8f310e42-9a3b-417d-8622-4401a7bdf821',
      issuerDid: DID,
      issuerName: 'African Public Administration Institute',
      subjectName: 'Ministry of Finance',
      achievement: { id: 'urn:apa:achievement:cits', name: 'CITS', alignment: [{ targetCode: 'ISO-37000' }] },
      cspa: { composite: 87, maturity: 'CSV_LEADER' },
      evidence: ALL_REQUIRED_TOOL_NUMBERS.map(ev),
      validFrom: new Date('2026-07-29T12:00:00Z'),
      validUntil: new Date('2029-07-29T12:00:00Z'),
    });
    const signer = createEd25519Signer({ privateKey, verificationMethod: `${DID}#key-1` });
    const credential: SignedCredential = { ...unsigned, proof: await signer.sign(unsigned) };

    // 4. Third-party verifier: resolve the key FROM the DID doc, then verify.
    const resolvedKey = publicKeyFromMultibase(didDoc.verificationMethod[0].publicKeyMultibase);
    const pem = resolvedKey.export({ type: 'spki', format: 'pem' }).toString();
    expect(checkIntegrity(credential, pem)).toBe('VALID');

    // 5. Tamper → resolution-based verify fails.
    const forged = structuredClone(credential);
    forged.credentialSubject.result[0].value = '99';
    expect(checkIntegrity(forged, pem)).toBe('INVALID');
  });
});
