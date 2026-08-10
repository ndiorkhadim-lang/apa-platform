import { notFound } from 'next/navigation';

// Dynamic so unknown routes return a real 404 status, not a prerendered 200.
export const dynamic = 'force-dynamic';

/** Catch-all: any unknown route inside a locale renders the branded 404. */
export default function CatchAllPage() {
  notFound();
}
