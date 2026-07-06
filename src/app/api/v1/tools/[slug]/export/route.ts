import { NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/prisma/client';
import { getSession } from '@/lib/session';

/**
 * GET /api/v1/tools/{slug}/export?report={id} | ?session={id}
 * Owner-only JSON export of a report (or the latest report of a session).
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
  }
  const userId = session.user.id;

  const url = new URL(request.url);
  const reportId = url.searchParams.get('report');
  const sessionId = url.searchParams.get('session');

  const report = reportId
    ? await prisma.toolReport.findFirst({
        where: { id: reportId, session: { userId, tool: { slug } } },
        include: { session: { include: { tool: true } } },
      })
    : sessionId
      ? await prisma.toolReport.findFirst({
          where: { sessionId, session: { userId, tool: { slug } } },
          orderBy: { createdAt: 'desc' },
          include: { session: { include: { tool: true } } },
        })
      : null;

  if (!report) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  }

  const payload = {
    tool: { slug, name: report.session.tool.nameEn, number: report.session.tool.number },
    report: { title: report.title, createdAt: report.createdAt, content: report.content },
    issuer: 'APA™ — Accountable Partners for Africa',
    exportedAt: new Date().toISOString(),
  };

  const filename = `APA_${slug}_${report.id}.json`;
  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
