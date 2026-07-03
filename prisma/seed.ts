/**
 * APA™ Platform seed — 6 pillars · 63 tools · 54 nations (22 Atlas priority, 16 V8 champions)
 * Sources: APA_63_Tools_Descriptions_{FR,EN}.md · 22-Nation Atlas · V8 Champions page.
 * Idempotent (upserts) — safe to re-run.
 */
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, ToolCategory } from '../src/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const DATA = (f: string) =>
  JSON.parse(readFileSync(join(__dirname, 'seed-data', f), 'utf8'));

const PILLARS = [
  { code: 'I', order: 1, nameEn: 'Foundational Diagnostics & Strategic Alignment', nameFr: 'Diagnostics fondamentaux & alignement stratégique' },
  { code: 'II', order: 2, nameEn: 'Governance, Accountability & Power-Sharing Architecture', nameFr: 'Gouvernance, redevabilité & architecture de partage du pouvoir' },
  { code: 'III', order: 3, nameEn: 'Contractual Mandates & Enforcement Mechanisms', nameFr: "Mandats contractuels & mécanismes d'application" },
  { code: 'IV', order: 4, nameEn: 'Metrics, Verification & Longitudinal Impact', nameFr: 'Indicateurs, vérification & impact longitudinal' },
  { code: 'V', order: 5, nameEn: 'Specialized Implementation & Capacity Building', nameFr: 'Mise en œuvre spécialisée & renforcement des capacités' },
  { code: 'VI', order: 6, nameEn: 'Foundational Concepts & Operational Mandates', nameFr: 'Concepts fondateurs & mandats opérationnels' },
] as const;

interface ToolRow {
  number: number; pillar: string; slug: string;
  nameEn: string; nameFr: string;
  typeOfficialEn: string; typeFr: string; category: keyof typeof ToolCategory;
  descEn: string; descFr: string;
}

interface NationRow {
  code: string; nameEn: string; nameFr: string; region: string;
  isPriority: boolean; activationTier: number | null; activationMonths: string | null;
  acriScore: number | null; strategicNote: string | null;
  championName: string | null; championTitle: string | null;
}

async function main() {
  // 1 · Pillars
  for (const p of PILLARS) {
    await prisma.pillar.upsert({ where: { code: p.code }, update: p, create: p });
  }
  console.log(`✔ ${PILLARS.length} pillars`);

  // 2 · Tools (official numbering 01–63, official V3 categories)
  const pillarIds = new Map(
    (await prisma.pillar.findMany()).map((p) => [p.code, p.id])
  );
  const tools: ToolRow[] = DATA('tools.json');
  for (const t of tools) {
    const data = {
      slug: t.slug,
      pillarId: pillarIds.get(t.pillar)!,
      category: ToolCategory[t.category],
      nameEn: t.nameEn, nameFr: t.nameFr,
      typeOfficialEn: t.typeOfficialEn, typeFr: t.typeFr,
      descEn: t.descEn, descFr: t.descFr,
    };
    await prisma.tool.upsert({
      where: { number: t.number },
      update: data,
      create: { number: t.number, ...data },
    });
  }
  console.log(`✔ ${tools.length} tools`);

  // 3 · Nations (54 · 22 Atlas priority · V8 champions)
  const nations: NationRow[] = DATA('nations.json');
  for (const n of nations) {
    const data = {
      nameEn: n.nameEn, nameFr: n.nameFr, region: n.region,
      isPriority: n.isPriority,
      activationTier: n.activationTier, activationMonths: n.activationMonths,
      acriScore: n.acriScore, strategicNote: n.strategicNote,
      championName: n.championName, championTitle: n.championTitle,
    };
    await prisma.nation.upsert({
      where: { code: n.code },
      update: data,
      create: { code: n.code, ...data },
    });
  }
  console.log(`✔ ${nations.length} nations`);

  // Integrity checks — fail loudly if canon is violated
  const [nTools, nPriority, byCat] = await Promise.all([
    prisma.tool.count(),
    prisma.nation.count({ where: { isPriority: true } }),
    prisma.tool.groupBy({ by: ['category'], _count: true }),
  ]);
  const cat = Object.fromEntries(byCat.map((c) => [c.category, c._count]));
  if (nTools !== 63) throw new Error(`Expected 63 tools, got ${nTools}`);
  if (nPriority !== 22) throw new Error(`Expected 22 priority nations, got ${nPriority}`);
  if (cat.FORM !== 22 || cat.GUIDE !== 14 || cat.LEGAL !== 15 || cat.METRIC !== 12) {
    throw new Error(`Category counts drifted from official V3: ${JSON.stringify(cat)}`);
  }
  console.log(`✔ integrity: 63 tools (22 FORM · 14 GUIDE · 15 LEGAL · 12 METRIC) · 22 priority nations`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
