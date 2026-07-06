import 'server-only';
import { headers } from 'next/headers';
import { cache } from 'react';
import { auth } from '@/infrastructure/auth/auth';

/** Server-side session lookup, deduped per request. */
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});
