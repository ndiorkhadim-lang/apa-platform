import { setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';

/**
 * Root of the deployment. This is the Certification Platform — not the
 * corporate website (which lives separately at theapaafrica.org). The front
 * door goes straight to the platform; there is no marketing homepage here.
 */
export default async function RootIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect({ href: '/platform', locale });
}
