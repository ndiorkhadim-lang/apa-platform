import { setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { getSession } from '@/lib/session';
import { AuthForm } from '@/components/auth/auth-form';

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const rawRedirect = typeof sp.redirect === 'string' ? sp.redirect : '/app';
  // internal paths only (prevent open redirect: no protocol, no //host)
  const redirectTo =
    rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/app';

  const session = await getSession();
  if (session) redirect({ href: redirectTo, locale });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <AuthForm mode="sign-in" redirectTo={redirectTo} />
    </div>
  );
}
