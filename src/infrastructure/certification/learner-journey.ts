import 'server-only';
import { prisma } from '@/infrastructure/prisma/client';

/**
 * Resolve the certification journey a learner's credential belongs to, via org
 * membership. Dev-only fallback to the demo org's journey so the completion
 * loop is demonstrable without full enrolment wiring.
 */
export async function resolveLearnerJourneyId(userId: string): Promise<string | null> {
  const membership = await prisma.membership.findFirst({
    where: { userId },
    include: { org: { include: { journeys: { orderBy: { startedAt: 'desc' }, take: 1 } } } },
  });
  const viaMembership = membership?.org.journeys[0]?.id;
  if (viaMembership) return viaMembership;

  if (process.env.NODE_ENV === 'production') return null;
  const demo = await prisma.certificationJourney.findFirst({
    where: { org: { slug: 'demo-ministry-finance' } },
    orderBy: { startedAt: 'desc' },
    select: { id: true },
  });
  return demo?.id ?? null;
}
