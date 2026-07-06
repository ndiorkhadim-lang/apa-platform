import { setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { AuthForm } from '@/components/auth/auth-form';

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getSession();
  if (session) redirect({ href: '/app', locale });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <AuthForm mode="sign-in" />
    </div>
  );
}
