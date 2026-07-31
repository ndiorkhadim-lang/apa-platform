import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

/**
 * Minimal Vitest config. Resolves the `@/*` path alias (mirrors tsconfig)
 * so domain unit tests can import from `@/domain/...`. Runs from project root.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(process.cwd(), 'src'),
      // Neutralize the Next.js "server-only" import guard under Vitest.
      'server-only': resolve(process.cwd(), 'tests/stubs/server-only.ts'),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
