/**
 * GET /api/v1/badges/[badgeId] — download an earned badge as a signed Open
 * Badges 3.0 credential (W3C VC 2.0). Public, no auth: the credential is a
 * shareable, self-verifiable artifact (Ed25519, offline-verifiable via the
 * issuer's /.well-known/did.json). Returns the badge only if the resolved
 * learner has actually earned it.
 */

import { NextResponse } from 'next/server';
import { prisma, dbAvailable } from '@/infrastructure/prisma/client';
import { getSession } from '@/lib/session';
import { PREVIEW_ACCESS } from '@/lib/demo';
import { getUserScore } from '@/infrastructure/scoring/scoring-service';
import { issueBadgeCredential } from '@/infrastructure/scoring/badge-issuer';
import { BADGES, type BadgeId } from '@/domain/scoring/scoring';

export const dynamic = 'force-dynamic';

async function resolveLearner(): Promise<{ id: string; name: string } | null> {
  const session = await getSession();
  if (session) return { id: session.user.id, name: session.user.name };
  if (!PREVIEW_ACCESS) return null;
  const demo = await prisma.user.findUnique({ where: { email: 'demo-holder@apa.test' }, select: { id: true, name: true } });
  return demo ?? null;
}

export async function GET(request: Request, { params }: { params: Promise<{ badgeId: string }> }) {
  if (!dbAvailable) return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });

  const { badgeId } = await params;
  const badge = BADGES[badgeId as BadgeId];
  if (!badge) return NextResponse.json({ error: 'unknown_badge' }, { status: 404 });

  const learner = await resolveLearner();
  if (!learner) return NextResponse.json({ error: 'no_learner' }, { status: 401 });

  const score = await getUserScore(learner.id);
  if (!score.badges.some((b) => b.id === badge.id)) {
    return NextResponse.json({ error: 'badge_not_earned' }, { status: 403 });
  }

  const locale = new URL(request.url).searchParams.get('lang') === 'fr' ? 'fr' : 'en';
  const credential = issueBadgeCredential(badge, { name: learner.name, key: learner.id }, locale);
  if (!credential) return NextResponse.json({ error: 'issuer_key_unconfigured' }, { status: 503 });

  return NextResponse.json(credential, {
    headers: {
      'Content-Type': 'application/ld+json',
      'Content-Disposition': `attachment; filename="apa-badge-${badge.id}.json"`,
    },
  });
}
