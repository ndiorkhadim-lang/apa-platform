import { NextResponse } from 'next/server';
import { dbAvailable } from '@/infrastructure/prisma/client';

async function handler(req: Request, ctx: { params: Promise<Record<string, string>> }) {
  if (!dbAvailable) {
    // Return empty session for get-session, 503 for mutations
    const url = new URL(req.url);
    if (url.pathname.includes('get-session')) {
      return NextResponse.json({ session: null, user: null });
    }
    return NextResponse.json({ error: 'Database not configured yet' }, { status: 503 });
  }
  const { toNextJsHandler } = await import('better-auth/next-js');
  const { auth } = await import('@/infrastructure/auth/auth');
  const { GET, POST } = toNextJsHandler(auth.handler);
  if (req.method === 'POST') return POST(req, ctx);
  return GET(req, ctx);
}

export const GET = handler;
export const POST = handler;
