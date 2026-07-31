/**
 * Seed the demo CITS course. Its curriculum mirrors the 6 C-SPA sections; each
 * module = 1 reading + that section's 2 required tools as practical locks. Thus
 * finishing the course clears exactly the 12 tools of the issuance evidence gate.
 * Run: DATABASE_URL=... npx tsx scripts/seed-course.ts
 */
import { prisma } from '@/infrastructure/prisma/client';
import { SECTIONS } from '@/domain/cspa/engine';

async function main() {
  const course = await prisma.course.upsert({
    where: { slug: 'cits-executive-pathway' },
    update: { published: true },
    create: {
      slug: 'cits-executive-pathway',
      order: 1,
      published: true,
      titleEn: 'CITS — Institutional Transformation Strategist',
      titleFr: 'CITS — Stratège de la Transformation Institutionnelle',
      summaryEn: 'The executive pathway to the CITS credential, built on the six C-SPA paradigms.',
      summaryFr: 'Le parcours exécutif vers le titre CITS, structuré sur les six paradigmes C-SPA.',
    },
  });

  // Idempotent: clear modules (cascades to lessons) then rebuild.
  await prisma.module.deleteMany({ where: { courseId: course.id } });

  for (const [mi, section] of SECTIONS.entries()) {
    const mod = await prisma.module.create({
      data: { courseId: course.id, order: mi, titleEn: section.nameEn, titleFr: section.nameFr },
    });

    // Reading lesson.
    await prisma.lesson.create({
      data: {
        moduleId: mod.id,
        order: 0,
        kind: 'READING',
        titleEn: `Orientation — ${section.nameEn}`,
        titleFr: `Orientation — ${section.nameFr}`,
        bodyEn: `This module addresses the "${section.nameEn}" paradigm of the C-SPA. Read the orientation, then clear the two practical locks below to build verifiable evidence.`,
        bodyFr: `Ce module traite le paradigme « ${section.nameFr} » du C-SPA. Lisez l'orientation, puis levez les deux verrous pratiques ci-dessous pour constituer une preuve vérifiable.`,
      },
    });

    // Two required tools of this section → TOOL lessons (practical locks).
    const requiredToolNumbers = section.tools.slice(0, 2);
    const tools = await prisma.tool.findMany({ where: { number: { in: requiredToolNumbers } } });
    const byNumber = new Map(tools.map((t) => [t.number, t]));
    let order = 1;
    for (const num of requiredToolNumbers) {
      const tool = byNumber.get(num);
      if (!tool) continue;
      await prisma.lesson.create({
        data: {
          moduleId: mod.id,
          order: order++,
          kind: 'TOOL',
          toolId: tool.id,
          titleEn: tool.nameEn,
          titleFr: tool.nameFr,
        },
      });
    }
  }

  const lessons = await prisma.lesson.count({ where: { module: { courseId: course.id } } });
  console.log(`✔ course "${course.slug}" — ${SECTIONS.length} modules, ${lessons} lessons`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
