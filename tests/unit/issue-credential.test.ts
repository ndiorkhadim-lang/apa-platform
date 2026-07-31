import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateKeyPairSync } from 'node:crypto';
import { issueCredential, type IssueCredentialDeps, type IssueCredentialInput } from '@/application/use-cases/issue-credential';
import { ALL_REQUIRED_TOOL_NUMBERS, type ToolEvidence } from '@/domain/certification/evidence';
import type { IssuanceContext, PersistIssuedCredentialInput } from '@/application/ports/credential-ports';
import { createEd25519Signer, verifyCredential } from '@/infrastructure/crypto/ed25519-signer';

// ─────────────────────────────────────────────
// Fixtures & fakes
// ─────────────────────────────────────────────

const NOW = new Date('2026-07-29T12:00:00.000Z');
const AT = new Date('2026-07-01T00:00:00.000Z');

function ev(toolNumber: number, over: Partial<ToolEvidence> = {}): ToolEvidence {
  return {
    toolNumber,
    toolSlug: `tool-${toolNumber}`,
    toolName: `Tool ${toolNumber}`,
    category: 'FORM',
    score: 80,
    reportId: `rpt_${toolNumber}`,
    completedAt: AT,
    ...over,
  };
}

const fullEvidence = () => ALL_REQUIRED_TOOL_NUMBERS.map((n) => ev(n));

const { publicKey, privateKey } = generateKeyPairSync('ed25519');

const INPUT: IssueCredentialInput = {
  userId: 'user_1',
  journeyId: 'journey_1',
  achievement: {
    id: 'urn:apa:achievement:cits',
    name: 'Certified Institutional Transformation Strategist (CITS)',
    alignment: [{ targetCode: 'ISO-37000', targetName: 'ISO 37000:2021' }],
  },
  issuerDid: 'did:web:apa-platform-five.vercel.app',
  issuerName: 'African Public Administration Institute',
  actorId: 'admin_1',
};

/** Build deps with an overridable context; spies on signer.sign & repo.persist. */
function makeDeps(ctx: IssuanceContext | null) {
  const persist = vi.fn(async (i: PersistIssuedCredentialInput) => ({
    credentialId: 'cert_1',
    publicNumber: 'APA-2026-SN-000123',
  }));
  const allocateRevocationSlot = vi.fn(async () => ({
    index: 7,
    statusListCredential: 'https://apa-platform-five.vercel.app/api/v1/status/2026',
  }));
  const realSigner = createEd25519Signer({
    privateKey,
    verificationMethod: `${INPUT.issuerDid}#key-1`,
  });
  const sign = vi.fn(realSigner.sign);
  const clearExistingCertificate = vi.fn(async () => {});

  const deps: IssueCredentialDeps = {
    repo: {
      loadContext: vi.fn(async () => ctx),
      allocateRevocationSlot,
      clearExistingCertificate,
      persist,
    },
    signer: { sign },
    clock: { now: () => NOW },
    ids: { uuid: () => '8f310e42-9a3b-417d-8622-4401a7bdf821' },
  };
  return { deps, persist, sign, allocateRevocationSlot, clearExistingCertificate };
}

// ─────────────────────────────────────────────
// Refusals — the contract must block ineligible issuance
// ─────────────────────────────────────────────

describe('issueCredential — refusals (no side effects)', () => {
  it('refuses when the issuance context is not found', async () => {
    const { deps, persist, sign } = makeDeps(null);
    const res = await issueCredential(INPUT, deps);
    expect(res).toEqual({ ok: false, reason: 'CONTEXT_NOT_FOUND' });
    expect(sign).not.toHaveBeenCalled();
    expect(persist).not.toHaveBeenCalled();
  });

  it('refuses when a certificate was already issued for the journey', async () => {
    const { deps, persist, sign } = makeDeps({
      evidence: fullEvidence(),
      cspa: { composite: 87, maturity: 'CSV_LEADER' },
      subjectName: 'Ministry of Finance',
      alreadyIssued: true,
    });
    const res = await issueCredential(INPUT, deps);
    expect(res).toEqual({ ok: false, reason: 'ALREADY_ISSUED' });
    expect(sign).not.toHaveBeenCalled();
    expect(persist).not.toHaveBeenCalled();
  });

  it('BLOCKS at the evidence gate — no signing, no persistence — when required tools are missing', async () => {
    const { deps, persist, sign, allocateRevocationSlot } = makeDeps({
      evidence: [ev(3), ev(7)], // only S1 covered
      cspa: { composite: 87, maturity: 'CSV_LEADER' },
      subjectName: 'Ministry of Finance',
      alreadyIssued: false,
    });
    const res = await issueCredential(INPUT, deps);
    expect(res.ok).toBe(false);
    if (res.ok) throw new Error('expected refusal');
    expect(res.reason).toBe('EVIDENCE_GATE_BLOCKED');
    if (res.reason !== 'EVIDENCE_GATE_BLOCKED') throw new Error('narrowing');
    expect(res.gate.passed).toBe(false);
    expect(res.gate.missing.length).toBeGreaterThan(0);
    // Priority-1 invariant: a blocked credential never touches crypto or the DB.
    expect(sign).not.toHaveBeenCalled();
    expect(allocateRevocationSlot).not.toHaveBeenCalled();
    expect(persist).not.toHaveBeenCalled();
  });

  it('refuses when a capstone exists but is not yet approved', async () => {
    const { deps, sign, persist } = makeDeps({
      evidence: fullEvidence(),
      cspa: { composite: 87, maturity: 'CSV_LEADER' },
      subjectName: 'Ministry of Finance',
      alreadyIssued: false,
      capstoneApproved: false,
    });
    const res = await issueCredential(INPUT, deps);
    expect(res).toEqual({ ok: false, reason: 'CAPSTONE_NOT_APPROVED' });
    expect(sign).not.toHaveBeenCalled();
    expect(persist).not.toHaveBeenCalled();
  });

  it('refuses when the gate passes but no C-SPA snapshot exists', async () => {
    const { deps, persist, sign } = makeDeps({
      evidence: fullEvidence(),
      cspa: null,
      subjectName: 'Ministry of Finance',
      alreadyIssued: false,
    });
    const res = await issueCredential(INPUT, deps);
    expect(res).toEqual({ ok: false, reason: 'CSPA_MISSING' });
    expect(sign).not.toHaveBeenCalled();
    expect(persist).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────
// Reissue — supersede the prior certificate
// ─────────────────────────────────────────────

describe('issueCredential — reissue', () => {
  const issuedCtx = {
    evidence: fullEvidence(),
    cspa: { composite: 87, maturity: 'CSV_LEADER' },
    subjectName: 'Ministry of Finance',
    alreadyIssued: true,
  };

  it('refuses without reissue when a certificate already exists', async () => {
    const { deps, clearExistingCertificate, persist } = makeDeps(issuedCtx);
    const res = await issueCredential(INPUT, deps);
    expect(res).toEqual({ ok: false, reason: 'ALREADY_ISSUED' });
    expect(clearExistingCertificate).not.toHaveBeenCalled();
    expect(persist).not.toHaveBeenCalled();
  });

  it('supersedes then re-issues when reissue is set and the gate passes', async () => {
    const { deps, clearExistingCertificate, persist } = makeDeps(issuedCtx);
    const res = await issueCredential({ ...INPUT, reissue: true }, deps);
    expect(res.ok).toBe(true);
    expect(clearExistingCertificate).toHaveBeenCalledOnce();
    expect(persist).toHaveBeenCalledOnce();
  });

  it('never destroys the existing credential when a reissue is gate-blocked', async () => {
    const { deps, clearExistingCertificate, persist } = makeDeps({
      ...issuedCtx,
      evidence: [ev(3), ev(7)], // incomplete → gate blocks
    });
    const res = await issueCredential({ ...INPUT, reissue: true }, deps);
    expect(res.ok).toBe(false);
    expect(clearExistingCertificate).not.toHaveBeenCalled();
    expect(persist).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────
// Success — full issuance path
// ─────────────────────────────────────────────

describe('issueCredential — success', () => {
  let ctx: IssuanceContext;
  beforeEach(() => {
    ctx = {
      evidence: fullEvidence(),
      cspa: { composite: 87, maturity: 'CSV_LEADER' },
      subjectName: 'Ministry of Finance',
      alreadyIssued: false,
    };
  });

  it('signs and persists, returning a verifiable credential', async () => {
    const { deps, persist, sign } = makeDeps(ctx);
    const res = await issueCredential(INPUT, deps);
    expect(res.ok).toBe(true);
    if (!res.ok) throw new Error('expected success');

    expect(sign).toHaveBeenCalledOnce();
    expect(persist).toHaveBeenCalledOnce();
    expect(res.credentialId).toBe('cert_1');
    expect(res.publicNumber).toBe('APA-2026-SN-000123');

    // Credential shape follows the PDF schema.
    expect(res.credential.id).toBe('urn:uuid:8f310e42-9a3b-417d-8622-4401a7bdf821');
    expect(res.credential.issuer.id).toBe(INPUT.issuerDid);
    expect(res.credential.proof.type).toBe('Ed25519Signature2020');
    expect(res.credential.proof.proofValue.startsWith('z')).toBe(true);
    expect(res.credential.credentialSubject.evidence).toHaveLength(ALL_REQUIRED_TOOL_NUMBERS.length);
    expect(res.credential.credentialSubject.result).toEqual([
      { type: ['Result'], resultDescription: 'cspa-composite', value: '87', status: 'Completed' },
      { type: ['Result'], resultDescription: 'cspa-maturity', value: 'CSV_LEADER', status: 'Completed' },
    ]);
  });

  it('produces a cryptographically valid Ed25519 proof (offline verify)', async () => {
    const { deps } = makeDeps(ctx);
    const res = await issueCredential(INPUT, deps);
    if (!res.ok) throw new Error('expected success');
    expect(verifyCredential(res.credential, publicKey)).toBe(true);
  });

  it('detects tampering — any change to the signed payload fails verification', async () => {
    const { deps } = makeDeps(ctx);
    const res = await issueCredential(INPUT, deps);
    if (!res.ok) throw new Error('expected success');
    const tampered = structuredClone(res.credential);
    tampered.credentialSubject.result[0].value = '99'; // forge the C-SPA score
    expect(verifyCredential(tampered, publicKey)).toBe(false);
  });

  it('persists the exact signed document, audit actor, and gate version', async () => {
    const { deps, persist } = makeDeps(ctx);
    const res = await issueCredential(INPUT, deps);
    if (!res.ok) throw new Error('expected success');
    const persisted = persist.mock.calls[0][0];
    expect(persisted.actorId).toBe('admin_1');
    expect(persisted.credentialUuid).toBe('8f310e42-9a3b-417d-8622-4401a7bdf821');
    expect(persisted.cspaComposite).toBe(87);
    expect(persisted.evidenceVersion).toBe('evidence-v1');
    expect(persisted.document).toBe(res.credential);
    expect(persisted.proofValue).toBe(res.credential.proof.proofValue);
    expect(persisted.issuedAt).toEqual(NOW);
  });

  it('embeds the revocation status entry from the allocated slot', async () => {
    const { deps } = makeDeps(ctx);
    const res = await issueCredential(INPUT, deps);
    if (!res.ok) throw new Error('expected success');
    expect(res.credential.credentialStatus).toEqual({
      id: 'https://apa-platform-five.vercel.app/api/v1/status/2026#7',
      type: 'BitstringStatusListEntry',
      statusPurpose: 'revocation',
      statusListIndex: '7',
      statusListCredential: 'https://apa-platform-five.vercel.app/api/v1/status/2026',
    });
  });

  it('sets a 36-month validity window by default', async () => {
    const { deps } = makeDeps(ctx);
    const res = await issueCredential(INPUT, deps);
    if (!res.ok) throw new Error('expected success');
    expect(res.credential.validFrom).toBe('2026-07-29T12:00:00.000Z');
    expect(res.credential.validUntil).toBe('2029-07-29T12:00:00.000Z');
  });
});
