import { notFound } from 'next/navigation';

/** Catch-all: any unknown route inside a locale renders the branded 404. */
export default function CatchAllPage() {
  notFound();
}
