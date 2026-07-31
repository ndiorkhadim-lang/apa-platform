import 'server-only';
import { prisma } from '@/infrastructure/prisma/client';

/**
 * Tool numbers a learner has effectively completed — the practical-lock source
 * of truth shared with the C-SPA evidence engine. A FORM tool counts only when
 * its latest report passed (score ≥ 70); other categories count once a report
 * exists (a frozen working artifact).
 */
export async function getCompletedToolNumbers(userId: string): Promise<Set<number>> {
  const reports = await prisma.toolReport.findMany({
    where: { session: { userId } },
    orderBy: { createdAt: 'desc' },
    include: { session: { include: { tool: { select: { number: true, category: true } } } } },
  });

  const seen = new Set<number>();
  const completed = new Set<number>();
  for (const r of reports) {
    const tool = r.session.tool;
    if (seen.has(tool.number)) continue; // latest report per tool wins
    seen.add(tool.number);
    const passed =
      tool.category === 'FORM'
        ? (r.content as { passed?: boolean } | null)?.passed === true
        : true;
    if (passed) completed.add(tool.number);
  }
  return completed;
}
