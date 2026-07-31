import { describe, it, expect } from 'vitest';
import { generateKeyPairSync } from 'node:crypto';
import {
  buildBitstring,
  getBit,
  STATUS_LIST_MIN_BITS,
} from '@/domain/certification/status-list';
import {
  buildEncodedStatusList,
  decodeBitstring,
  encodeBitstring,
  isRevoked,
} from '@/infrastructure/certification/status-list-service';
import { resolveVerdict } from '@/infrastructure/certification/verify-service';
import { createEd25519Signer } from '@/infrastructure/crypto/ed25519-signer';
import { assembleUnsignedCredential, type SignedCredential } from '@/domain/certification/credential';
import { ALL_REQUIRED_TOOL_NUMBERS, type ToolEvidence } from '@/domain/certification/evidence';

const { publicKey, privateKey } = generateKeyPairSync('ed25519');
const publicKeyPem = publicKey.export({ type: 'spki', format: 'pem' }).toString();
const STATUS_URL = 'https://apa-platform-five.vercel.app/api/v1/credentials/status-list';

// ─────────────────────────────────────────────
// Bitstring + GZIP/base64url envelope
// ─────────────────────────────────────────────

describe('StatusList2021 bitstring', () => {
  it('sets only the revoked indices (MSB-first), leaving others active', () => {
    const bits = buildBitstring([0, 7, 42]);
    expect(getBit(bits, 0)).toBe(true);
    expect(getBit(bits, 7)).toBe(true);
    expect(getBit(bits, 42)).toBe(true);
    expect(getBit(bits, 1)).toBe(false);
    expect(getBit(bits, 41)).toBe(false);
  });

  it('allocates at least the spec-mandated 16KB (131,072 entries)', () => {
    expect(buildBitstring([]).length * 8).toBe(STATUS_LIST_MIN_BITS);
  });

  it('round-trips through GZIP + base64url losslessly', () => {
    const bits = buildBitstring([3, 100, 5000]);
    const restored = decodeBitstring(encodeBitstring(bits));
    expect(Buffer.from(restored)).toEqual(Buffer.from(bits));
  });

  it('reads a single credential bit from the encoded list', () => {
    const encoded = buildEncodedStatusList([9]);
    expect(isRevoked(encoded, 9)).toBe(true);
    expect(isRevoked(encoded, 8)).toBe(false);
    expect(isRevoked(encoded, -1)).toBe(false);
  });

  it('compresses the empty list to a tiny payload', () => {
    // 16KB of zeros gzips to well under 200 bytes.
    expect(buildEncodedStatusList([]).length).toBeLessThan(200);
  });
});

// ─────────────────────────────────────────────
// /verify verdict: VALID → REVOKED flip
// ─────────────────────────────────────────────

const REVOKE_INDEX = 7;

async function signedFixtureAtIndex(index: number): Promise<SignedCredential> {
  function ev(n: number): ToolEvidence {
    return {
      toolNumber: n, toolSlug: `tool-${n}`, toolName: `Tool ${n}`,
      category: 'FORM', score: 80, reportId: `rpt_${n}`, completedAt: new Date('2026-07-01T00:00:00Z'),
    };
  }
  const unsigned = assembleUnsignedCredential({
    credentialUrn: 'urn:uuid:8f310e42-9a3b-417d-8622-4401a7bdf821',
    issuerDid: 'did:web:apa-platform-five.vercel.app',
    issuerName: 'African Public Administration Institute',
    subjectName: 'Ministry of Finance',
    achievement: { id: 'urn:apa:achievement:cits', name: 'CITS', alignment: [{ targetCode: 'ISO-37000' }] },
    cspa: { composite: 87, maturity: 'CSV_LEADER' },
    evidence: ALL_REQUIRED_TOOL_NUMBERS.map(ev),
    validFrom: new Date('2026-07-29T12:00:00Z'),
    validUntil: new Date('2029-07-29T12:00:00Z'),
    credentialStatus: {
      id: `${STATUS_URL}#${index}`,
      type: 'BitstringStatusListEntry',
      statusPurpose: 'revocation',
      statusListIndex: String(index),
      statusListCredential: STATUS_URL,
    },
  });
  const signer = createEd25519Signer({ privateKey, verificationMethod: 'did:web:x#key-1' });
  return { ...unsigned, proof: await signer.sign(unsigned) };
}

describe('resolveVerdict — revocation flips the badge', () => {
  it('is VALID while the registry has no revoked bit for the index', async () => {
    const cred = await signedFixtureAtIndex(REVOKE_INDEX);
    const registry = async () => buildEncodedStatusList([]); // nothing revoked
    expect(await resolveVerdict(cred, publicKeyPem, registry)).toBe('VALID');
  });

  it('flips to REVOKED once the registry sets that credential’s bit', async () => {
    const cred = await signedFixtureAtIndex(REVOKE_INDEX);
    const registry = async () => buildEncodedStatusList([REVOKE_INDEX]); // now revoked
    expect(await resolveVerdict(cred, publicKeyPem, registry)).toBe('REVOKED');
  });

  it('does not revoke a different credential sharing the registry', async () => {
    const other = await signedFixtureAtIndex(8);
    const registry = async () => buildEncodedStatusList([REVOKE_INDEX]); // index 7 revoked, not 8
    expect(await resolveVerdict(other, publicKeyPem, registry)).toBe('VALID');
  });

  it('never lets revocation upgrade a tampered (INVALID) credential', async () => {
    const cred = await signedFixtureAtIndex(REVOKE_INDEX);
    cred.credentialSubject.result[0].value = '99'; // tamper
    const registry = async () => buildEncodedStatusList([]);
    expect(await resolveVerdict(cred, publicKeyPem, registry)).toBe('INVALID');
  });

  it('stays VALID (never falsely revokes) when the registry cannot be resolved', async () => {
    const cred = await signedFixtureAtIndex(REVOKE_INDEX);
    const registry = async () => null;
    expect(await resolveVerdict(cred, publicKeyPem, registry)).toBe('VALID');
  });
});
