import { describe, it, expect } from 'vitest';
import { generateKeyPairSync } from 'node:crypto';
import { assembleBadgeCredential } from '@/domain/scoring/badge-credential';
import { signDocument, verifyDocument } from '@/infrastructure/crypto/ed25519-signer';
import { BADGES } from '@/domain/scoring/scoring';

const { publicKey, privateKey } = generateKeyPairSync('ed25519');
const publicKeyPem = publicKey.export({ type: 'spki', format: 'pem' }).toString();
const DID = 'did:web:apa-platform-five.vercel.app';

function signedBadge(locale?: string) {
  const unsigned = assembleBadgeCredential({
    badge: BADGES.certified,
    subjectName: 'Demo Holder',
    subjectKey: 'user_1',
    issuerDid: DID,
    issuerName: 'African Public Administration Institute',
    validFrom: new Date('2026-08-02T00:00:00.000Z'),
    locale,
  });
  const proof = signDocument(unsigned as unknown as Record<string, unknown>, {
    privateKey,
    verificationMethod: `${DID}#key-1`,
    created: unsigned.validFrom,
  });
  return { ...unsigned, proof };
}

describe('assembleBadgeCredential', () => {
  it('is a W3C VC 2.0 / OpenBadgeCredential with the badge as achievement', () => {
    const c = assembleBadgeCredential({
      badge: BADGES.diagnostic, subjectName: 'X', subjectKey: 'u1',
      issuerDid: DID, issuerName: 'APA', validFrom: new Date(),
    });
    expect(c.type).toEqual(['VerifiableCredential', 'OpenBadgeCredential']);
    expect(c.id).toBe('urn:apa:badge:diagnostic:u1');
    expect(c.credentialSubject.achievement.name).toBe(BADGES.diagnostic.nameEn);
    expect(c.credentialSubject.achievement.criteria.narrative).toBeTruthy();
  });
  it('localizes to French', () => {
    const c = assembleBadgeCredential({
      badge: BADGES.certified, subjectName: 'X', subjectKey: 'u1',
      issuerDid: DID, issuerName: 'APA', validFrom: new Date(), locale: 'fr',
    });
    expect(c.credentialSubject.achievement.name).toBe(BADGES.certified.nameFr);
  });
});

describe('badge credential signing (Ed25519)', () => {
  it('verifies a freshly signed badge credential', () => {
    expect(verifyDocument(signedBadge() as unknown as Record<string, unknown>, publicKeyPem)).toBe(true);
  });
  it('fails verification when the badge is tampered', () => {
    const c = signedBadge();
    c.credentialSubject.achievement.name = 'Forged Achievement';
    expect(verifyDocument(c as unknown as Record<string, unknown>, publicKeyPem)).toBe(false);
  });
  it('fails against the wrong public key', () => {
    const other = generateKeyPairSync('ed25519').publicKey.export({ type: 'spki', format: 'pem' }).toString();
    expect(verifyDocument(signedBadge() as unknown as Record<string, unknown>, other)).toBe(false);
  });
  it('proof carries the Ed25519 multibase value', () => {
    expect(signedBadge().proof.proofValue.startsWith('z')).toBe(true);
    expect(signedBadge().proof.type).toBe('Ed25519Signature2020');
  });
});
