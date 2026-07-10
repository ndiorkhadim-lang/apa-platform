import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { RESOURCES, getResourceBySlug } from '@/data/resources';
import { PublicationDocument } from '@/components/resources/PublicationDocument';
import { PrintTrigger, PrintNowButton } from '@/components/resources/PrintTrigger';

export function generateStaticParams() {
  return RESOURCES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = getResourceBySlug(slug);
  if (!r) return {};
  return { title: `${r.title} — Official APA Publication (PDF)`, description: r.executiveSummary };
}

export default async function PublicationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const r = getResourceBySlug(slug);
  if (!r) notFound();

  return (
    <div className="bg-[#eef1f0]">
      <PrintTrigger enabled={sp.print === '1'} />

      {/* Screen-only document toolbar */}
      <div className="print:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4">
          <Link href={`/resources/${r.slug}`} className="text-sm font-semibold text-apa-navy hover:text-apa-green">
            ← Back to resource
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-apa-grey sm:block">Official APA publication template</span>
            <PrintNowButton />
          </div>
        </div>
      </div>

      {/* The document sheet */}
      <div className="mx-auto max-w-3xl pb-12 print:max-w-none print:pb-0">
        <div className="overflow-hidden bg-white shadow-xl ring-1 ring-black/5 print:shadow-none print:ring-0">
          <PublicationDocument resource={r} />
        </div>
      </div>
    </div>
  );
}
