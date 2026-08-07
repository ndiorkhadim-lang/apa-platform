import type { ReactNode } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { TerminalChrome } from '@/components/terminal/terminal-chrome';

/**
 * Option B — "APA Terminal" route group. Renders the single sovereign
 * Control-Tower chrome, shared with the (app) plane (one unified shell).
 */
export default async function TerminalLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TerminalChrome locale={locale}>{children}</TerminalChrome>;
}
