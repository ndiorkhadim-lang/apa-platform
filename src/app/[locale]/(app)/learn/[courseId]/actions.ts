'use server';

import { revalidatePath } from 'next/cache';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { prisma } from '@/infrastructure/prisma/client';
import { getSession } from '@/lib/session';
import { issueCredential } from '@/application/use-cases/issue-credential';
import { prismaIssuanceRepository } from '@/infrastructure/certification/prisma-issuance-repository';
import { createEd25519Signer } from '@/infrastructure/crypto/ed25519-signer';
import { getIssuerConfig } from '@/infrastructure/certification/issuer';
import { resolveLearnerJourneyId } from '@/infrastructure/certification/learner-journey';

async function requireUser() {
  const session = await getSession();
  if (!session) throw new Error('UNAUTHENTICATED');
  return session.user.id;
}

/** Dev-only learner identity so the completion loop works without a session. */
async function resolveLearner(): Promise<string | null> {
  const session = await getSession();
  if (session) return session.user.id;
  if (process.env.NODE_ENV === 'production') return null;
  const demo = await prisma.user.findUnique({ where: { email: 'demo-holder@apa.test' }, select: { id: true } });
  return demo?.id ?? null;
}

const CITS_ACHIEVEMENT = {
  id: 'urn:apa:achievement:cits',
  name: 'Certified Institutional Transformation Strategist (CITS)',
  alignment: [{ targetCode: 'ISO-37000', targetName: 'ISO 37000:2021 Governance of organizations' }],
};

export type FinalizeResult =
  | { ok: true; publicNumber: string; verifyUrl: string }
  | { ok: false; reason: 'NO_LEARNER' | 'NO_JOURNEY' | 'ISSUER_KEY_UNCONFIGURED' | 'CONTEXT_NOT_FOUND' | 'CSPA_MISSING' | 'ALREADY_ISSUED' | 'CAPSTONE_NOT_APPROVED' }
  | { ok: false; reason: 'EVIDENCE_GATE_BLOCKED'; pendingTools: number[] };

/**
 * Close the loop: (re)issue the learner's credential from their completed
 * practical locks. The evidence gate is enforced by the use-case — a blocked
 * gate never signs, persists, or supersedes the existing credential.
 */
export async function finalizeCredential(locale: string): Promise<FinalizeResult> {
  const learnerId = await resolveLearner();
  if (!learnerId) return { ok: false, reason: 'NO_LEARNER' };

  const journeyId = await resolveLearnerJourneyId(learnerId);
  if (!journeyId) return { ok: false, reason: 'NO_JOURNEY' };

  const issuer = getIssuerConfig();
  if (!issuer.privateKeyPem) return { ok: false, reason: 'ISSUER_KEY_UNCONFIGURED' };

  const signer = createEd25519Signer({ privateKey: issuer.privateKeyPem, verificationMethod: issuer.verificationMethod });
  const result = await issueCredential(
    {
      userId: learnerId,
      journeyId,
      achievement: CITS_ACHIEVEMENT,
      issuerDid: issuer.did,
      issuerName: issuer.name,
      actorId: learnerId,
      reissue: true,
    },
    { repo: prismaIssuanceRepository, signer, clock: { now: () => new Date() }, ids: { uuid: () => randomUUID() } },
  );

  if (result.ok) {
    const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? '';
    revalidatePath(`/${locale}/verify/${result.publicNumber}`);
    return { ok: true, publicNumber: result.publicNumber, verifyUrl: `${site}/${locale}/verify/${result.publicNumber}` };
  }
  if (result.reason === 'EVIDENCE_GATE_BLOCKED') {
    return { ok: false, reason: 'EVIDENCE_GATE_BLOCKED', pendingTools: result.gate.missing.map((m) => m.toolNumber) };
  }
  return { ok: false, reason: result.reason };
}

const schema = z.object({
  lessonId: z.string().min(1),
  courseSlug: z.string().min(1),
  locale: z.string().min(1),
});

/**
 * Mark a READING/ASSESSMENT lesson complete. TOOL lessons are intentionally not
 * completable here — their gate is the tool's ToolReport, not a self-declared
 * acknowledgement (see domain/learning/curriculum.ts).
 */
export async function markLessonRead(input: z.infer<typeof schema>) {
  const userId = await requireUser();
  const { lessonId, courseSlug, locale } = schema.parse(input);

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, select: { kind: true } });
  if (!lesson) throw new Error('NOT_FOUND');
  if (lesson.kind === 'TOOL') {
    return { ok: false as const, reason: 'TOOL_LESSON_GATED_BY_REPORT' };
  }

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: { userId, lessonId, status: 'COMPLETED', completedAt: new Date() },
    update: { status: 'COMPLETED', completedAt: new Date() },
  });

  revalidatePath(`/${locale}/learn/${courseSlug}`);
  return { ok: true as const };
}
