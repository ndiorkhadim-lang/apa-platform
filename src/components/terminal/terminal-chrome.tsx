import type { CSSProperties, ReactNode } from 'react';
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { TerminalShell } from './terminal-shell';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

const fontVars = {
  '--t-font-sans': 'var(--font-inter)',
  '--t-font-display': 'var(--font-jakarta)',
  '--t-font-mono': 'var(--font-jetbrains)',
} as CSSProperties;

/**
 * The single sovereign application chrome — fonts + Control-Tower shell.
 * Shared by BOTH the (terminal) and (app) route groups so the whole certified
 * platform wears one shell. Phase 1 of the consolidation (unify the shell).
 */
export function TerminalChrome({ locale, children }: { locale: string; children: ReactNode }) {
  return (
    <div className={`${inter.variable} ${jakarta.variable} ${mono.variable} flex-1`} style={fontVars}>
      <TerminalShell locale={locale}>{children}</TerminalShell>
    </div>
  );
}
