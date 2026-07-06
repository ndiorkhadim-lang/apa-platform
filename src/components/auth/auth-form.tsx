'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const t = useTranslations('Auth');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');

    const res =
      mode === 'sign-up'
        ? await authClient.signUp.email({
            name: String(form.get('name') ?? ''),
            email,
            password,
          })
        : await authClient.signIn.email({ email, password });

    setPending(false);
    if (res.error) {
      const code = res.error.status;
      setError(
        mode === 'sign-in' && (code === 401 || code === 403)
          ? t('errorCredentials')
          : mode === 'sign-up' && code === 422
            ? t('errorExists')
            : t('errorGeneric')
      );
      return;
    }
    router.push('/app');
    router.refresh();
  }

  const isUp = mode === 'sign-up';

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="text-2xl font-bold text-apa-green">
        {t(isUp ? 'signUpTitle' : 'signInTitle')}
      </h1>
      <div className="apa-rule my-4" />
      <p className="text-sm text-apa-grey">
        {t(isUp ? 'signUpSubtitle' : 'signInSubtitle')}
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {isUp ? (
          <label className="block text-sm font-semibold text-apa-ink">
            {t('name')}
            <input
              name="name"
              required
              autoComplete="name"
              className="mt-1 w-full rounded-md border border-apa-line px-3 py-2.5 text-sm focus:border-apa-green focus:outline-none focus:ring-2 focus:ring-apa-green/20"
            />
          </label>
        ) : null}
        <label className="block text-sm font-semibold text-apa-ink">
          {t('email')}
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-md border border-apa-line px-3 py-2.5 text-sm focus:border-apa-green focus:outline-none focus:ring-2 focus:ring-apa-green/20"
          />
        </label>
        <label className="block text-sm font-semibold text-apa-ink">
          {t('password')}
          <input
            type="password"
            name="password"
            required
            minLength={10}
            autoComplete={isUp ? 'new-password' : 'current-password'}
            className="mt-1 w-full rounded-md border border-apa-line px-3 py-2.5 text-sm focus:border-apa-green focus:outline-none focus:ring-2 focus:ring-apa-green/20"
          />
          {isUp ? (
            <span className="mt-1 block text-xs font-normal text-apa-grey">
              {t('passwordHint')}
            </span>
          ) : null}
        </label>

        {error ? (
          <p role="alert" className="apa-box apa-box-gold p-3 text-sm text-apa-ink">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-apa-green px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-apa-green-mid disabled:opacity-60"
        >
          {pending ? '…' : t(isUp ? 'submitUp' : 'submitIn')}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-apa-grey">
        {isUp ? (
          <>
            {t('hasAccount')}{' '}
            <Link href="/sign-in" className="font-semibold text-apa-green underline">
              {t('signInLink')}
            </Link>
          </>
        ) : (
          <>
            {t('noAccount')}{' '}
            <Link href="/sign-up" className="font-semibold text-apa-green underline">
              {t('createOne')}
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
