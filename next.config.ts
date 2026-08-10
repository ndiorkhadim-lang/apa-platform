import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // The deployment IS the certification platform — the corporate website lives
  // separately. Enter straight into the platform; no marketing homepage here.
  async redirects() {
    return [
      { source: '/', destination: '/en/platform', permanent: false },
      { source: '/en', destination: '/en/platform', permanent: false },
      { source: '/fr', destination: '/fr/platform', permanent: false },
    ];
  },
};

export default withNextIntl(nextConfig);
