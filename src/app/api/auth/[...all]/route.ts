import { NextResponse } from 'next/server';
import { dbAvailable } from '@/infrastructure/prisma/client';

/**
 * Auth catch-all. Degrades gracefully before a database is configured:
 * get-session returns an empty session, mutations return 503.
 */
async function handler(req: Request) {
  if (!dbAvailable) {
    const url = new URL(req.url);
    if (url.pathname.includes('get-session')) {
      return NextResponse.json({ session: null, user: null });
    }
    return NextResponse.json({ error: 'Database not configured yet' }, { status: 503 });
  }
  const { toNextJsHandler } = await import('better-auth/next-js');
  const { auth } = await import('@/infrastructure/auth/auth');
  const { GET, POST } = toNextJsHandler(auth.handler);
  return req.method === 'POST' ? POST(req) : GET(req);
}

export const GET = handler;
export const POST = handler;
