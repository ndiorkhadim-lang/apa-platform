import { describe, it, expect } from 'vitest';
import { toCertificateViewModel } from '@/domain/certification/certificate-view-model';
import type { SignedCredential } from '@/domain/certification/credential';

function credential(overrides: Partial<SignedCredential['credentialSubject']> = {}): SignedCredential {
  return {
    '@context': ['https://www.w3.org/ns/credentials/v2'] as unknown as SignedCredential['@context'],
    id: 'urn:uuid:abc-123',
    type: ['VerifiableCredential', 'OpenBadgeCredential'],
    issuer: { id: 'did:web:apa-platform-five.vercel.app', name: 'APA Institute' },
    validFrom: '2026-08-02T00:00:00.000Z',
    validUntil: '2029-08-02T00:00:00.000Z',
    credentialSubject: {
      type: ['AchievementSubject'],
      name: 'Amina Diallo',
      achievement: {
        id: 'urn:apa:achievement:cits',
        type: ['Achievement'],
        name: 'Certified (CITS)',
        alignment: [{ targetCode: 'AU-AGA', targetName: 'African Governance Architecture' }],
      },
      result: [
        { type: ['Result'], resultDescription: 'cspa-composite', value: '84', status: 'Completed' },
        { type: ['Result'], resultDescription: 'cspa-maturity', value: 'TRANSFORMATIONAL', status: 'Completed' },
      ],
      evidence: [],
      ...overrides,
    },
    proof: {
      type: 'Ed25519Signature2020',
      created: '2026-08-02T00:00:00.000Z',
      verificationMethod: 'did:web:apa-platform-five.vercel.app#key-1',
      proofPurpose: 'assertionMethod',
      proofValue: 'z4DVR3WnyDkj1t6ucxZwRf46abcdefghi',
    },
  } as unknown as SignedCredential;
}

describe('toCertificateViewModel', () => {
  it('projects holder, achievement, issuer, dates and proof', () => {
    const vm = toCertificateViewModel(credential());
    expect(vm.holderName).toBe('Amina Diallo');
    expect(vm.achievementName).toBe('Certified (CITS)');
    expect(vm.issuerName).toBe('APA Institute');
    expect(vm.issuerDid).toBe('did:web:apa-platform-five.vercel.app');
    expect(vm.credentialUrn).toBe('urn:uuid:abc-123');
    expect(vm.validFrom).toBe('2026-08-02T00:00:00.000Z');
    expect(vm.proofValue.startsWith('z')).toBe(true);
  });

  it('extracts the C-SPA composite and maturity from result[]', () => {
    const vm = toCertificateViewModel(credential());
    expect(vm.composite).toBe(84);
    expect(vm.maturity).toBe('TRANSFORMATIONAL');
  });

  it('maps alignments to code/name', () => {
    const vm = toCertificateViewModel(credential());
    expect(vm.alignments).toEqual([{ code: 'AU-AGA', name: 'African Governance Architecture' }]);
  });

  it('tolerates a missing composite (null, not NaN)', () => {
    const vm = toCertificateViewModel(credential({ result: [] }));
    expect(vm.composite).toBeNull();
    expect(vm.maturity).toBeNull();
  });
});
