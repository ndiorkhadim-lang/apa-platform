/**
 * Ports for credential issuance. The issue-credential use-case depends only on
 * these interfaces — never on Prisma or node:crypto directly — so it is fully
 * unit-testable with in-memory fakes and no live database.
 */

import type { ToolEvidence } from '@/domain/certification/evidence';
import type {
  UnsignedCredential,
  SignedCredential,
  CredentialStatusEntry,
  Proof,
} from '@/domain/certification/credential';

/** Everything the use-case needs to decide and build, loaded in one shot. */
export interface IssuanceContext {
  /** Frozen tool completions (from ToolReport rows) → gate + evidence[]. */
  evidence: ToolEvidence[];
  /** Latest completed C-SPA snapshot for the holder, or null if none. */
  cspa: { composite: number; maturity: string } | null;
  /** Display name of the credential holder (organization or user). */
  subjectName: string;
  /** True if this journey already has a certificate — blocks re-issuance. */
  alreadyIssued: boolean;
  /**
   * Capstone gate: true = approved, false = exists but not approved (blocks
   * issuance), undefined = no capstone required for this journey.
   */
  capstoneApproved?: boolean;
}

/** A reserved slot in the StatusList2021 revocation registry. */
export interface RevocationSlot {
  index: number;
  statusListCredential: string;
}

/** Atomic-persistence payload — Certificate row + AuditLog in one transaction. */
export interface PersistIssuedCredentialInput {
  journeyId: string;
  credentialUuid: string; // bare uuid (the credential id is urn:uuid:<this>)
  issuerDid: string;
  evidenceVersion: string;
  cspaComposite: number;
  cspaMaturity: string;
  document: SignedCredential;
  proofValue: string;
  revocationIndex: number; // StatusList2021 slot — powers the registry bitstring
  issuedAt: Date;
  expiresAt: Date;
  actorId: string; // who triggered issuance — recorded in the audit trail
}

export interface IssuanceRepository {
  /** Load the full issuance context, or null if the journey does not exist. */
  loadContext(userId: string, journeyId: string): Promise<IssuanceContext | null>;
  /** Reserve the next revocation registry slot (does not sign or persist). */
  allocateRevocationSlot(issuerDid: string, year: number): Promise<RevocationSlot>;
  /**
   * Supersede the journey's existing certificate on re-issuance: revoke it in
   * the registry and free the unique journey slot, recording the supersession
   * in the audit trail. Called only when reissuing.
   */
  clearExistingCertificate(journeyId: string, actorId: string): Promise<void>;
  /**
   * Persist the signed credential and its audit log atomically, minting the
   * public number (e.g. APA-2026-SN-000123) inside the same transaction.
   * MUST be all-or-nothing.
   */
  persist(input: PersistIssuedCredentialInput): Promise<{ credentialId: string; publicNumber: string }>;
}

export interface CredentialSigner {
  /** Sign the unsigned credential's canonical bytes → a W3C proof block. */
  sign(unsigned: UnsignedCredential): Promise<Proof>;
}

/** Injectable clock — deterministic issuance timestamps in tests. */
export interface Clock {
  now(): Date;
}

/** Injectable id source — deterministic uuids in tests. */
export interface IdGenerator {
  uuid(): string;
}

export type { CredentialStatusEntry };
