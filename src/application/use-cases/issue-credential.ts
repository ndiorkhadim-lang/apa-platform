/**
 * Use-case: issue a W3C Verifiable Credential 2.0 for a certification journey.
 *
 * Order of operations is a Matrix priority-1 decision (proof integrity first):
 *   1. Load context.                          → CONTEXT_NOT_FOUND
 *   2. Refuse if already issued.              → ALREADY_ISSUED
 *   3. REQUIRED EVIDENCE GATE — strict.       → EVIDENCE_GATE_BLOCKED
 *      No signing, no persistence, no side effects when the gate fails.
 *   4. Require a C-SPA snapshot for result[]. → CSPA_MISSING
 *   5. Assemble → sign (Ed25519) → persist atomically (Certificate + AuditLog).
 *
 * The use-case touches neither Prisma nor node:crypto — only the injected ports.
 */

import { computeGate, type EvidenceGate } from '@/domain/certification/evidence';
import {
  assembleUnsignedCredential,
  type SignedCredential,
  type AchievementSpec,
} from '@/domain/certification/credential';
import type {
  IssuanceRepository,
  CredentialSigner,
  Clock,
  IdGenerator,
} from '@/application/ports/credential-ports';

export interface IssueCredentialInput {
  userId: string;
  journeyId: string;
  achievement: AchievementSpec;
  issuerDid: string;
  issuerName: string;
  actorId: string;
  /** Credential validity window; defaults to 36 months. */
  validityMonths?: number;
  /** When true, supersede an existing certificate instead of refusing. */
  reissue?: boolean;
}

export interface IssueCredentialDeps {
  repo: IssuanceRepository;
  signer: CredentialSigner;
  clock: Clock;
  ids: IdGenerator;
}

export type IssueCredentialResult =
  | { ok: true; credentialId: string; publicNumber: string; credential: SignedCredential }
  | { ok: false; reason: 'CONTEXT_NOT_FOUND' }
  | { ok: false; reason: 'ALREADY_ISSUED' }
  | { ok: false; reason: 'EVIDENCE_GATE_BLOCKED'; gate: EvidenceGate }
  | { ok: false; reason: 'CSPA_MISSING' }
  | { ok: false; reason: 'CAPSTONE_NOT_APPROVED' };

const DEFAULT_VALIDITY_MONTHS = 36;

function addMonths(from: Date, months: number): Date {
  const d = new Date(from.getTime());
  d.setUTCMonth(d.getUTCMonth() + months);
  return d;
}

export async function issueCredential(
  input: IssueCredentialInput,
  deps: IssueCredentialDeps,
): Promise<IssueCredentialResult> {
  const { repo, signer, clock, ids } = deps;

  const ctx = await repo.loadContext(input.userId, input.journeyId);
  if (!ctx) return { ok: false, reason: 'CONTEXT_NOT_FOUND' };
  if (ctx.alreadyIssued && !input.reissue) return { ok: false, reason: 'ALREADY_ISSUED' };

  // ── Required Evidence Gate — priority 1. Hard stop, zero side effects. ──
  const gate = computeGate(ctx.evidence);
  if (!gate.passed) return { ok: false, reason: 'EVIDENCE_GATE_BLOCKED', gate };

  if (!ctx.cspa) return { ok: false, reason: 'CSPA_MISSING' };

  // Capstone gate: if a capstone exists it must be approved by an APA evaluator.
  if (ctx.capstoneApproved === false) return { ok: false, reason: 'CAPSTONE_NOT_APPROVED' };

  // Reissue: supersede the prior certificate only after the gate has passed,
  // so a blocked re-issuance never destroys the existing valid credential.
  if (ctx.alreadyIssued && input.reissue) {
    await repo.clearExistingCertificate(input.journeyId, input.actorId);
  }

  const now = clock.now();
  const validUntil = addMonths(now, input.validityMonths ?? DEFAULT_VALIDITY_MONTHS);
  const uuid = ids.uuid();
  const credentialUrn = `urn:uuid:${uuid}`;

  const slot = await repo.allocateRevocationSlot(input.issuerDid, now.getUTCFullYear());

  const unsigned = assembleUnsignedCredential({
    credentialUrn,
    issuerDid: input.issuerDid,
    issuerName: input.issuerName,
    subjectName: ctx.subjectName,
    achievement: input.achievement,
    cspa: ctx.cspa,
    evidence: ctx.evidence,
    validFrom: now,
    validUntil,
    credentialStatus: {
      id: `${slot.statusListCredential}#${slot.index}`,
      type: 'BitstringStatusListEntry',
      statusPurpose: 'revocation',
      statusListIndex: String(slot.index),
      statusListCredential: slot.statusListCredential,
    },
  });

  const proof = await signer.sign(unsigned);
  const credential: SignedCredential = { ...unsigned, proof };

  const { credentialId, publicNumber } = await repo.persist({
    journeyId: input.journeyId,
    credentialUuid: uuid,
    issuerDid: input.issuerDid,
    evidenceVersion: gate.version,
    cspaComposite: ctx.cspa.composite,
    cspaMaturity: ctx.cspa.maturity,
    document: credential,
    proofValue: proof.proofValue,
    revocationIndex: slot.index,
    issuedAt: now,
    expiresAt: validUntil,
    actorId: input.actorId,
  });

  return { ok: true, credentialId, publicNumber, credential };
}
