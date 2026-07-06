import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.theapaafrica.org';

const PUBLIC_ROUTES = [
  '',
  '/journeys',
  '/tools',
  '/solutions',
  '/intelligence',
  '/certification',
  '/champions',
  '/dashboard',
  '/about',
  '/contact',
  '/verify',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.flatMap((route) =>
    routing.locales.map((locale) => ({
      url: `${BASE}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? ('weekly' as const) : ('monthly' as const),
      priority: route === '' ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${BASE}/${l}${route}`])
        ),
      },
    }))
  );
}
