import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

export const dbAvailable = Boolean(process.env.DATABASE_URL);

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrisma(): PrismaClient {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });
}

export const prisma: PrismaClient = dbAvailable
  ? (globalForPrisma.prisma ??= createPrisma())
  : (new Proxy({} as PrismaClient, {
      get() {
        throw new Error('DATABASE_URL is not configured');
      },
    }) as PrismaClient);

if (process.env.NODE_ENV !== 'production' && dbAvailable) {
  globalForPrisma.prisma = prisma;
}
