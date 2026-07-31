/**
 * DEMO ONLY — enrol a varied cohort into the demo org so the B2B dashboard and
 * ISO 37000 heatmap render real, differentiated coverage.
 * Run: DATABASE_URL=... npx tsx scripts/seed-cohort.ts
 */
import { prisma } from '@/infrastructure/prisma/client';
import { SECTIONS } from '@/domain/cspa/engine';

const S = SECTIONS.map((s) => s.tools); // [S1tools, S2tools, ...]
const ALL = S.flat();

// name, email, and which competency tools they've completed (passing).
const COHORT: { name: string; email: string; tools: number[] }[] = [
  { name: 'Aïcha Diallo', email: 'aicha@cohort.test', tools: ALL }, // full
  { name: 'Kofi Mensah', email: 'kofi@cohort.test', tools: [...S[0], ...S[1], ...S[2]] }, // S1–S3
  { name: 'Fatou Sow', email: 'fatou@cohort.test', tools: [...S[0], ...S[1]] }, // S1–S2
  { name: 'Jean Kouassi', email: 'jean@cohort.test', tools: [S[0][0]] }, // one tool
];

async function main() {
  const org = await prisma.organization.findUniqueOrThrow({ where: { slug: 'demo-ministry-finance' } });
  const toolsByNumber = new Map((await prisma.tool.findMany({ where: { number: { in: ALL } } })).map((t) => [t.number, t]));

  // Include the existing demo credential holder in the cohort too.
  const holder = await prisma.user.findUnique({ where: { email: 'demo-holder@apa.test' } });
  if (holder) {
    await prisma.membership.upsert({
      where: { userId_orgId: { userId: holder.id, orgId: org.id } },
      update: {}, create: { userId: holder.id, orgId: org.id, role: 'ORG_MEMBER' },
    });
  }

  for (const person of COHORT) {
    const user = await prisma.user.upsert({
      where: { email: person.email },
      update: { name: person.name },
      create: { name: person.name, email: person.email, platformRole: 'USER' },
    });
    await prisma.membership.upsert({
      where: { userId_orgId: { userId: user.id, orgId: org.id } },
      update: {}, create: { userId: user.id, orgId: org.id, role: 'ORG_MEMBER' },
    });
    // Reset then create passing reports for their completed tools.
    await prisma.toolReport.deleteMany({ where: { session: { userId: user.id } } });
    await prisma.toolSession.deleteMany({ where: { userId: user.id } });
    for (const num of person.tools) {
      const tool = toolsByNumber.get(num);
      if (!tool) continue;
      const session = await prisma.toolSession.create({ data: { userId: user.id, toolId: tool.id, status: 'ARCHIVED', data: {} } });
      await prisma.toolReport.create({ data: { sessionId: session.id, title: `${tool.nameEn} report`, content: { score: 82, passed: true } } });
    }
  }

  const memberCount = await prisma.membership.count({ where: { orgId: org.id } });
  console.log(`✔ cohort seeded on "${org.slug}" — ${memberCount} members`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
