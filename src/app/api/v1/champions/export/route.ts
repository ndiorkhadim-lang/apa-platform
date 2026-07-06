import { NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/prisma/client';
import { getSession } from '@/lib/session';
import type { ChampionAppStatus, Prisma } from '@/generated/prisma/client';

const STATUSES = ['SUBMITTED', 'SCREENING', 'INTERVIEW', 'ACCEPTED', 'REJECTED'];

function csvCell(v: unknown): string {
  const s = v == null ? '' : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

/** GET /api/v1/champions/export?status= — ADMIN_APA only, CSV download. */
export async function GET(request: Request) {
  const session = await getSession();
  const role = (session?.user as { platformRole?: string } | undefined)?.platformRole;
  if (!session || role !== 'ADMIN_APA') {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  const url = new URL(request.url);
  const statusParam = url.searchParams.get('status');
  const status =
    statusParam && STATUSES.includes(statusParam)
      ? (statusParam as ChampionAppStatus)
      : undefined;

  const where: Prisma.ChampionApplicationWhereInput = {
    status: status ?? { not: 'DRAFT' },
  };
  const apps = await prisma.championApplication.findMany({
    where,
    orderBy: { submittedAt: 'desc' },
    include: { reviews: { orderBy: { createdAt: 'desc' }, take: 1 } },
  });

  const header = [
    'status', 'submittedAt', 'firstName', 'lastName', 'email', 'phone',
    'nationality', 'countryResidence', 'city', 'position', 'organization',
    'yearsExperience', 'education', 'languages', 'expertise', 'linkedin',
    'cvUrl', 'lastScore', 'signature',
  ];
  const rows = apps.map((a) =>
    [
      a.status, a.submittedAt?.toISOString() ?? '', a.firstName, a.lastName,
      a.email, a.phone, a.nationality, a.countryResidence, a.city, a.position,
      a.organization, a.yearsExperience, a.education, a.languages, a.expertise,
      a.linkedin, a.cvUrl, a.reviews[0]?.score ?? '', a.signature,
    ]
      .map(csvCell)
      .join(',')
  );
  const csv = [header.join(','), ...rows].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="apa_champion_applications.csv"`,
    },
  });
}
