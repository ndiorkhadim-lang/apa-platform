import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'en'],
  // Home always opens in English by default; French stays available via the
  // FR toggle. localeDetection off = `/` never auto-switches from Accept-Language
  // or edge geolocation, so the root is deterministic (`/` → `/en`).
  defaultLocale: 'en',
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
