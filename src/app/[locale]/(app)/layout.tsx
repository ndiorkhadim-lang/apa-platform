import type { ReactNode } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { TerminalChrome } from '@/components/terminal/terminal-chrome';

/**
 * Certification application plane. Phase 1 consolidation: the (app) routes now
 * render inside the SAME unified sovereign Control-Tower chrome as /certify-v2,
 * replacing the standalone CertShell — one platform, one shell.
 */
export default async function PlatformLayout({
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
