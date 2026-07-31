import { describe, it, expect } from 'vitest';
import { generateKeyPairSync } from 'node:crypto';
import { checkIntegrity } from '@/infrastructure/certification/verify-service';
import { createEd25519Signer } from '@/infrastructure/crypto/ed25519-signer';
import { assembleUnsignedCredential } from '@/domain/certification/credential';
import type { SignedCredential } from '@/domain/certification/credential';
import { ALL_REQUIRED_TOOL_NUMBERS, type ToolEvidence } from '@/domain/certification/evidence';

const { publicKey, privateKey } = generateKeyPairSync('ed25519');
const publicKeyPem = publicKey.export({ type: 'spki', format: 'pem' }).toString();

function ev(n: number): ToolEvidence {
  return {
    toolNumber: n,
    toolSlug: `tool-${n}`,
    toolName: `Tool ${n}`,
    category: 'FORM',
    score: 80,
    reportId: `rpt_${n}`,
    completedAt: new Date('2026-07-01T00:00:00.000Z'),
  };
}

async function signedFixture(): Promise<SignedCredential> {
  const unsigned = assembleUnsignedCredential({
    credentialUrn: 'urn:uuid:8f310e42-9a3b-417d-8622-4401a7bdf821',
    issuerDid: 'did:web:apa-platform-five.vercel.app',
    issuerName: 'African Public Administration Institute',
    subjectName: 'Ministry of Finance',
    achievement: { id: 'urn:apa:achievement:cits', name: 'CITS', alignment: [{ targetCode: 'ISO-37000' }] },
    cspa: { composite: 87, maturity: 'CSV_LEADER' },
    evidence: ALL_REQUIRED_TOOL_NUMBERS.map(ev),
    validFrom: new Date('2026-07-29T12:00:00.000Z'),
    validUntil: new Date('2029-07-29T12:00:00.000Z'),
  });
  const signer = createEd25519Signer({ privateKey, verificationMethod: 'did:web:x#key-1' });
  return { ...unsigned, proof: await signer.sign(unsigned) };
}

describe('checkIntegrity', () => {
  it('returns VALID for an untouched signed credential', async () => {
    expect(checkIntegrity(await signedFixture(), publicKeyPem)).toBe('VALID');
  });

  it('returns INVALID when the document was tampered', async () => {
    const cred = await signedFixture();
    cred.credentialSubject.result[0].value = '99';
    expect(checkIntegrity(cred, publicKeyPem)).toBe('INVALID');
  });

  it('returns INVALID against the wrong public key', async () => {
    const other = generateKeyPairSync('ed25519').publicKey.export({ type: 'spki', format: 'pem' }).toString();
    expect(checkIntegrity(await signedFixture(), other)).toBe('INVALID');
  });

  it('returns UNAVAILABLE when no issuer key is configured', async () => {
    expect(checkIntegrity(await signedFixture(), null)).toBe('UNAVAILABLE');
  });

  it('returns INVALID (not throw) on a malformed proof', async () => {
    const cred = await signedFixture();
    cred.proof.proofValue = 'not-multibase';
    expect(checkIntegrity(cred, publicKeyPem)).toBe('INVALID');
  });
});
