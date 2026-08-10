import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // APA ecosystem — two layers. The root now serves the Main Platform (Layer 1)
  // Home; next-intl handles `/` → `/{locale}`. The Certification Platform
  // (Layer 2) remains reachable at /{locale}/platform (renamed to /certification
  // in a later phase). No forced redirect into certification.
};

export default withNextIntl(nextConfig);
