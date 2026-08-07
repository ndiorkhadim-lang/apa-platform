import 'server-only';
import { redirect } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/infrastructure/prisma/client';
import { PREVIEW_ACCESS } from '@/lib/demo';

/**
 * Server-side RBAC guards for protected route subtrees. In this stack session
 * verification belongs in Server Components (Better Auth reads request headers /
 * DB), not the edge proxy — so these run at the top of each protected page.
 *
 * Dev ergonomics: outside production, an unauthenticated request is allowed
 * through as a demo preview (callers fall back to demo data). In production the
 * guard redirects — no demo bypass.
 */

export interface Guarded {
  /** Authenticated user id, or null in a dev demo preview. */
  userId: string | null;
  role: string;
}

/** Any authenticated user (a "candidate"). Protects /learn. */
export async function requireCandidate(locale: string, returnTo: string): Promise<Guarded> {
  const session = await getSession();
  if (session) return { userId: session.user.id, role: (session.user as { platformRole?: string }).platformRole ?? 'USER' };
  if (PREVIEW_ACCESS) return { userId: null, role: 'USER' };
  redirect({ href: `/sign-in?redirect=${encodeURIComponent(returnTo)}`, locale });
  throw new Error('unreachable');
}

/**
 * ADMIN_APA, or an ORG_ADMIN of `orgSlug`. Protects /enterprise. When orgSlug
 * is undefined (org not yet resolved) any ORG_ADMIN membership suffices.
 */
export async function requireOrgAdmin(locale: string, returnTo: string, orgSlug?: string): Promise<Guarded> {
  const session = await getSession();
  if (!session) {
    if (PREVIEW_ACCESS) return { userId: null, role: 'ORG_ADMIN' };
    redirect({ href: `/sign-in?redirect=${encodeURIComponent(returnTo)}`, locale });
    throw new Error('unreachable');
  }
  const role = (session.user as { platformRole?: string }).platformRole ?? 'USER';
  if (role === 'ADMIN_APA') return { userId: session.user.id, role };

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id, role: 'ORG_ADMIN', ...(orgSlug ? { org: { slug: orgSlug } } : {}) },
    select: { id: true },
  });
  if (!membership) {
    redirect({ href: '/app', locale }); // authenticated but not authorized → bounce
    throw new Error('unreachable');
  }
  return { userId: session.user.id, role };
}
