import 'server-only';
import { headers } from 'next/headers';
import { cache } from 'react';

export const getSession = cache(async () => {
  if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET) {
    return null;
  }
  try {
    const { auth } = await import('@/infrastructure/auth/auth');
    return auth.api.getSession({ headers: await headers() });
  } catch {
    return null;
  }
});
