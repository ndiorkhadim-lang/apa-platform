import { NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/prisma/client';
import { ACRI_VERSION, CRITERIA, METHODOLOGY, classify } from '@/domain/acri/methodology';

/**
 * GET /api/v1/acri — the ACRI intelligence feed (public, cacheable).
 * Query: version (dataVersion, default illustrative-v1) · lang (fr|en).
 * Same engine as the Executive Dashboard — one source of truth.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const dataVersion = url.searchParams.get('version') ?? 'illustrative-v1';
  const lang = url.searchParams.get('lang') === 'fr' ? 'fr' : 'en';

  const nations = await prisma.nation.findMany({
    where: { isPriority: true },
    include: {
      acriScores: { where: { dataVersion }, orderBy: { criterion: 'asc' } },
    },
  });

  const rankings = nations
    .map((n) => ({
      code: n.code,
      name: lang === 'fr' ? n.nameFr : n.nameEn,
      region: n.region,
      composite: n.acriScore ?? 0,
      tier: classify(n.acriScore ?? 0),
      criteria: Object.fromEntries(
        n.acriScores.map((s) => [`c${s.criterion}`, s.score])
      ),
    }))
    .sort((a, b) => b.composite - a.composite);

  return NextResponse.json(
    {
      data: {
        index: 'ACRI — Africa Country Readiness Index',
        engineVersion: ACRI_VERSION,
        dataVersion,
        confidence: dataVersion.startsWith('illustrative') ? 'ILLUSTRATIVE' : 'MEASURED',
        weights: Object.fromEntries(CRITERIA.map((c) => [`c${c.id}`, c.weight])),
        compositeFormula: METHODOLOGY.compositeFormula,
        rankings,
      },
      meta: { count: rankings.length, source: 'APA Master Memoire §V + acri_scores' },
    },
    { headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' } }
  );
}
