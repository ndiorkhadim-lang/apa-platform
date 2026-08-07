/**
 * DEMO ONLY — enrich the demo learner so the executive standing panel showcases
 * the full scoring engine (level + all badges). Run: DATABASE_URL=... npx tsx scripts/demo-scoring.ts
 */
import { prisma } from '@/infrastructure/prisma/client';

async function main() {
  const user = await prisma.user.findUniqueOrThrow({ where: { email: 'demo-holder@apa.test' } });
  const journey = await prisma.certificationJourney.findFirstOrThrow({
    where: { org: { slug: 'demo-ministry-finance' } },
    orderBy: { startedAt: 'desc' },
  });

  // 1. Passing tool reports → FORM tools count toward completion (pathway badge)
  await prisma.toolReport.updateMany({
    where: { session: { userId: user.id } },
    data: { content: { score: 82, passed: true } },
  });

  // 2. Completed C-SPA run for the learner (diagnostic + csv-leader badges)
  const run = await prisma.cspaRun.findFirst({ where: { userId: user.id } });
  const cspaData = { status: 'COMPLETED' as const, composite: 87, maturity: 'CSV_LEADER', completedAt: new Date(), answers: {} };
  if (run) await prisma.cspaRun.update({ where: { id: run.id }, data: cspaData });
  else await prisma.cspaRun.create({ data: { userId: user.id, ...cspaData } });

  // 3. Approved capstone (capstone badge)
  await prisma.capstoneSubmission.upsert({
    where: { journeyId: journey.id },
    update: { status: 'APPROVED', reviewVerdict: 'APPROVED', decidedAt: new Date() },
    create: {
      journeyId: journey.id, authorId: user.id, title: 'Shared-value governance reform',
      content: 'Demo capstone.', status: 'APPROVED', reviewVerdict: 'APPROVED',
      submittedAt: new Date(), decidedAt: new Date(),
    },
  });

  console.log('✔ demo learner scoring profile enriched');
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
