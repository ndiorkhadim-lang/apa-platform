import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // APA ecosystem — two layers. The root serves the Main Platform (Layer 1)
  // Home; next-intl handles `/` → `/{locale}`. The Certification Platform
  // (Layer 2) gateway lives at /{locale}/certification.
  //
  // Preserve legacy deep links: the old /platform gateway now redirects to
  // /certification, so nothing that pointed at the certification hub breaks.
  async redirects() {
    return [
      { source: '/:locale(en|fr)/platform', destination: '/:locale/certification', permanent: false },
      { source: '/platform', destination: '/en/certification', permanent: false },
    ];
  },
};

export default withNextIntl(nextConfig);
