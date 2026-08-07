import 'server-only';
import { prisma } from '@/infrastructure/prisma/client';
import { getCompletedToolNumbers } from '@/infrastructure/learning/completion';
import { ALL_REQUIRED_TOOL_NUMBERS } from '@/domain/certification/evidence';
import { computeScore, type ScoreResult } from '@/domain/scoring/scoring';
import type { Maturity } from '@/domain/cspa/engine';

/**
 * Assembles a learner's activity from the database and runs the pure scoring
 * engine. The engine stays deterministic and testable; this reads the facts.
 * Each query is defensive so a missing row never breaks the panel.
 */
export async function getUserScore(userId: string): Promise<ScoreResult> {
  const completed = await getCompletedToolNumbers(userId).catch(() => new Set<number>());
  const toolsCompleted = completed.size;
  const pathwayComplete = ALL_REQUIRED_TOOL_NUMBERS.every((n) => completed.has(n));

  const lessonsRead = await prisma.lessonProgress
    .count({ where: { userId, status: 'COMPLETED' } })
    .catch(() => 0);

  const cspa = await prisma.cspaRun
    .findFirst({
      where: { userId, status: 'COMPLETED' },
      orderBy: { completedAt: 'desc' },
      select: { composite: true, maturity: true },
    })
    .catch(() => null);
  const cspaPassed = (cspa?.composite ?? 0) >= 70;
  const cspaMaturity = (cspa?.maturity as Maturity | null | undefined) ?? undefined;

  const capstone = await prisma.capstoneSubmission
    .findFirst({ where: { authorId: userId, status: 'APPROVED' }, select: { id: true } })
    .catch(() => null);

  const cert = await prisma.certificate
    .findFirst({
      where: {
        OR: [
          { journey: { capstone: { authorId: userId } } },
          { journey: { org: { memberships: { some: { userId } } } } },
        ],
      },
      select: { id: true },
    })
    .catch(() => null);

  return computeScore(
    {
      toolsCompleted,
      lessonsRead,
      cspaPassed,
      cspaMaturity,
      capstoneApproved: Boolean(capstone),
      certified: Boolean(cert),
    },
    pathwayComplete,
  );
}
