import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

export const dbAvailable = Boolean(process.env.DATABASE_URL);

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrisma(): PrismaClient {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });
}

function createNoopClient(): PrismaClient {
  return new Proxy({} as PrismaClient, {
    get() {
      return new Proxy({}, {
        get() {
          return async (..._args: any[]) => {
            const stack = new Error().stack || '';
            if (stack.includes('.count(') || stack.includes('.aggregate(') || stack.includes('.groupBy(')) return 0;
            if (stack.includes('.findMany(') || stack.includes('.createMany(')) return [];
            return null;
          };
        },
      }) as any;
    },
  }) as PrismaClient;
}

export const prisma: PrismaClient = dbAvailable
  ? (globalForPrisma.prisma ??= createPrisma())
  : createNoopClient();

if (process.env.NODE_ENV !== 'production' && dbAvailable) {
  globalForPrisma.prisma = prisma;
}
