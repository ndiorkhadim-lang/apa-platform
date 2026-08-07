import 'server-only';
import { prisma } from '@/infrastructure/prisma/client';
import { getCompletedToolNumbers } from '@/infrastructure/learning/completion';
import { PREVIEW_ACCESS } from '@/lib/demo';
import type { CertificateStatus } from '@/generated/prisma/client';

/** A cohort: an organization's members with their tool completions + credentials. */
export interface CohortMember {
  id: string;
  name: string;
  completedToolNumbers: number[];
}

export interface CohortCertificate {
  publicNumber: string;
  status: CertificateStatus;
  issuedAt: Date;
  holder: string;
}

export interface CohortData {
  org: { name: string; slug: string };
  members: CohortMember[];
  certificates: CohortCertificate[];
}

/** Resolve the org slug for the current view (query → membership → dev demo). */
export async function resolveOrgSlug(queryOrg: string | undefined, userId: string | null): Promise<string | null> {
  if (queryOrg) return queryOrg;
  if (userId) {
    const membership = await prisma.membership.findFirst({
      where: { userId },
      include: { org: { select: { slug: true } } },
      orderBy: { createdAt: 'asc' },
    });
    if (membership) return membership.org.slug;
  }
  return PREVIEW_ACCESS ? 'demo-ministry-finance' : null;
}

export async function loadCohort(slug: string): Promise<CohortData | null> {
  const org = await prisma.organization.findUnique({
    where: { slug },
    include: {
      memberships: { include: { user: { select: { id: true, name: true } } } },
      journeys: { include: { certificate: true } },
    },
  });
  if (!org) return null;

  const members: CohortMember[] = await Promise.all(
    org.memberships.map(async (m) => ({
      id: m.user.id,
      name: m.user.name,
      completedToolNumbers: [...(await getCompletedToolNumbers(m.user.id))],
    })),
  );

  const certificates: CohortCertificate[] = org.journeys.flatMap((j) =>
    j.certificate
      ? [{ publicNumber: j.certificate.publicNumber, status: j.certificate.status, issuedAt: j.certificate.issuedAt, holder: org.name }]
      : [],
  );

  return { org: { name: org.name, slug: org.slug }, members, certificates };
}
