import { NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/prisma/client';
import type { Prisma, ToolCategory } from '@/generated/prisma/client';

const CATEGORIES = ['FORM', 'GUIDE', 'LEGAL', 'METRIC'];

/**
 * GET /api/v1/tools — public catalog API (drives integrations & the marketplace).
 * Query: pillar, cat (FORM|GUIDE|LEGAL|METRIC), q, lang (fr|en).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const pillar = url.searchParams.get('pillar') ?? undefined;
  const catParam = url.searchParams.get('cat');
  const cat = catParam && CATEGORIES.includes(catParam) ? (catParam as ToolCategory) : undefined;
  const q = url.searchParams.get('q')?.trim();
  const lang = url.searchParams.get('lang') === 'en' ? 'en' : 'fr';

  const where: Prisma.ToolWhereInput = {
    ...(pillar ? { pillar: { code: pillar } } : {}),
    ...(cat ? { category: cat } : {}),
    ...(q
      ? {
          OR:
            lang === 'en'
              ? [
                  { nameEn: { contains: q, mode: 'insensitive' } },
                  { descEn: { contains: q, mode: 'insensitive' } },
                ]
              : [
                  { nameFr: { contains: q, mode: 'insensitive' } },
                  { descFr: { contains: q, mode: 'insensitive' } },
                ],
        }
      : {}),
  };

  const tools = await prisma.tool.findMany({
    where,
    orderBy: { number: 'asc' },
    include: { pillar: { select: { code: true } } },
  });

  return NextResponse.json(
    {
      data: tools.map((t) => ({
        number: t.number,
        slug: t.slug,
        pillar: t.pillar.code,
        category: t.category,
        name: lang === 'en' ? t.nameEn : t.nameFr,
        description: lang === 'en' ? t.descEn : t.descFr,
        minTier: t.minTier,
      })),
      meta: { count: tools.length, total: 63, lang },
    },
    { headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' } }
  );
}
