/** DEMO ONLY — revoke a credential by public number. */
import { revokeCertificate } from '@/infrastructure/certification/prisma-issuance-repository';
import { prisma } from '@/infrastructure/prisma/client';

async function main() {
  const num = process.argv[2];
  const actor = await prisma.user.findUniqueOrThrow({ where: { email: 'demo-holder@apa.test' } });
  const ok = await revokeCertificate(num, 'demo revocation', actor.id);
  console.log('revoked', num, '->', ok);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
