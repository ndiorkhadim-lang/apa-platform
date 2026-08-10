import type { ReactNode } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';

/**
 * LAYER 1 — APA Main Platform chrome (light, institutional).
 *
 * Wraps only the institutional / discovery routes (Home, About, Solutions,
 * Tools, Intelligence, Resources, Contact). The certification platform
 * ((terminal) + (registry)) keeps its own TerminalChrome, untouched.
 */
export default async function SiteLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
