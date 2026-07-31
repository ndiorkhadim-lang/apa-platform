/**
 * Prisma-backed IssuanceRepository. The only DB-coupled part of issuance;
 * the use-case never sees it. `persist` is atomic: the Certificate row and its
 * AuditLog entry are written in a single transaction — all-or-nothing.
 */

import { prisma } from '@/infrastructure/prisma/client';
import type { Prisma } from '@/generated/prisma/client';
import { MATURITY_LEVELS } from '@/domain/cspa/engine';
import type { ToolEvidence } from '@/domain/certification/evidence';
import type {
  IssuanceRepository,
  IssuanceContext,
  RevocationSlot,
  PersistIssuedCredentialInput,
} from '@/application/ports/credential-ports';

/** Domain year is the C-SPA composite's maturity band label. */
function maturityFor(composite: number): string {
  return (MATURITY_LEVELS.find((m) => composite >= m.min) ?? MATURITY_LEVELS[MATURITY_LEVELS.length - 1]).level;
}

/** Best-effort numeric score from a frozen ToolReport payload, else undefined. */
function extractScore(content: unknown): number | undefined {
  if (content && typeof content === 'object' && 'score' in content) {
    const s = (content as { score: unknown }).score;
    if (typeof s === 'number') return s;
  }
  return undefined;
}

export const prismaIssuanceRepository: IssuanceRepository = {
  async loadContext(userId: string, journeyId: string): Promise<IssuanceContext | null> {
    const journey = await prisma.certificationJourney.findUnique({
      where: { id: journeyId },
      include: { org: true, certificate: true, capstone: { select: { status: true } } },
    });
    if (!journey) return null;

    // Frozen tool completions for this user → evidence.
    const reports = await prisma.toolReport.findMany({
      where: { session: { userId } },
      include: { session: { include: { tool: true } } },
      orderBy: { createdAt: 'desc' },
    });

    // One evidence entry per tool (latest report wins).
    const seen = new Set<number>();
    const evidence: ToolEvidence[] = [];
    for (const r of reports) {
      const tool = r.session.tool;
      if (seen.has(tool.number)) continue;
      seen.add(tool.number);
      evidence.push({
        toolNumber: tool.number,
        toolSlug: tool.slug,
        toolName: tool.nameEn,
        category: tool.category,
        score: extractScore(r.content),
        reportId: r.id,
        completedAt: r.createdAt,
      });
    }

    // Latest passed C-SPA assessment for this journey → composite + maturity.
    const assessment = await prisma.cspaAssessment.findFirst({
      where: { journeyId, passed: true },
      orderBy: { submittedAt: 'desc' },
    });

    return {
      evidence,
      cspa: assessment ? { composite: assessment.score, maturity: maturityFor(assessment.score) } : null,
      subjectName: journey.org.name,
      alreadyIssued: journey.certificate !== null,
      capstoneApproved: journey.capstone ? journey.capstone.status === 'APPROVED' : undefined,
    };
  },

  async allocateRevocationSlot(issuerDid: string, year: number): Promise<RevocationSlot> {
    // Monotonic per-year slot. Uniqueness is what StatusList2021 requires.
    const count = await prisma.certificate.count({
      where: { issuedAt: { gte: new Date(Date.UTC(year, 0, 1)), lt: new Date(Date.UTC(year + 1, 0, 1)) } },
    });
    const domain = issuerDid.replace(/^did:web:/, '');
    return { index: count, statusListCredential: `https://${domain}/api/v1/credentials/status-list` };
  },

  async clearExistingCertificate(journeyId: string, actorId: string): Promise<void> {
    const cert = await prisma.certificate.findUnique({ where: { journeyId } });
    if (!cert) return;
    // Supersession: the schema allows one certificate per journey, so the prior
    // row is removed (its audit trail is retained) to free the slot for the
    // re-issued credential. Atomic: audit + delete succeed together.
    await prisma.$transaction([
      prisma.auditLog.create({
        data: {
          actorId,
          action: 'certificate.supersede',
          entityType: 'Certificate',
          entityId: cert.credentialUuid,
          diff: { publicNumber: cert.publicNumber, revocationIndex: cert.revocationIndex },
        },
      }),
      prisma.certificate.delete({ where: { id: cert.id } }),
    ]);
  },

  async persist(input: PersistIssuedCredentialInput): Promise<{ credentialId: string; publicNumber: string }> {
    const year = input.issuedAt.getUTCFullYear();

    // Mint the human public number: APA-<year>-<nation?>-<seq>.
    const journey = await prisma.certificationJourney.findUnique({
      where: { id: input.journeyId },
      include: { org: { include: { nation: true } } },
    });
    const nation = journey?.org.nation?.code ?? 'XX';
    const yearCount = await prisma.certificate.count({
      where: { issuedAt: { gte: new Date(Date.UTC(year, 0, 1)), lt: new Date(Date.UTC(year + 1, 0, 1)) } },
    });
    const publicNumber = `APA-${year}-${nation}-${String(yearCount + 1).padStart(6, '0')}`;

    // Atomic: certificate + audit log succeed or fail together.
    const [certificate] = await prisma.$transaction([
      prisma.certificate.create({
        data: {
          journeyId: input.journeyId,
          publicNumber,
          credentialUuid: input.credentialUuid,
          issuerDid: input.issuerDid,
          evidenceVersion: input.evidenceVersion,
          cspaComposite: input.cspaComposite,
          cspaMaturity: input.cspaMaturity,
          proofValue: input.proofValue,
          revocationIndex: input.revocationIndex,
          document: input.document as unknown as Prisma.InputJsonValue,
          issuedAt: input.issuedAt,
          expiresAt: input.expiresAt,
        },
      }),
      prisma.auditLog.create({
        data: {
          actorId: input.actorId,
          action: 'certificate.issue',
          entityType: 'Certificate',
          entityId: input.credentialUuid,
          diff: {
            publicNumber,
            issuerDid: input.issuerDid,
            evidenceVersion: input.evidenceVersion,
            cspaComposite: input.cspaComposite,
          },
        },
      }),
    ]);

    return { credentialId: certificate.id, publicNumber };
  },
};

/** Revocation-registry read side: indices of all revoked credentials. */
export async function getRevokedIndices(): Promise<number[]> {
  const rows = await prisma.certificate.findMany({
    where: { status: 'REVOKED', revocationIndex: { not: null } },
    select: { revocationIndex: true },
  });
  return rows.map((r) => r.revocationIndex).filter((n): n is number => n !== null);
}

/** Revoke a credential atomically (status → REVOKED + audit). Returns false if unknown. */
export async function revokeCertificate(
  publicNumber: string,
  reason: string,
  actorId: string,
): Promise<boolean> {
  const cert = await prisma.certificate.findUnique({ where: { publicNumber } });
  if (!cert) return false;
  await prisma.$transaction([
    prisma.certificate.update({
      where: { id: cert.id },
      data: { status: 'REVOKED', revokedAt: new Date(), revokedFor: reason },
    }),
    prisma.auditLog.create({
      data: {
        actorId,
        action: 'certificate.revoke',
        entityType: 'Certificate',
        entityId: cert.credentialUuid,
        diff: { publicNumber, reason, revocationIndex: cert.revocationIndex },
      },
    }),
  ]);
  return true;
}
