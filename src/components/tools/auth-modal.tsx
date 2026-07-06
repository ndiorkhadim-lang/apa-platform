'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { authClient } from '@/lib/auth-client';

/**
 * Inline auth modal for the marketplace flow. On success it calls
 * onAuthenticated (the caller redirects to the selected tool) so the user
 * never has to search for the tool again.
 */
export function AuthModal({
  redirectTo,
  onClose,
  onAuthenticated,
}: {
  redirectTo: string;
  onClose: () => void;
  onAuthenticated: () => void;
}) {
  const t = useTranslations('Auth');
  const tm = useTranslations('Marketplace');
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');
    const res =
      mode === 'sign-up'
        ? await authClient.signUp.email({ name: String(form.get('name') ?? ''), email, password })
        : await authClient.signIn.email({ email, password });
    setPending(false);
    if (res.error) {
      setError(
        mode === 'sign-in' && (res.error.status === 401 || res.error.status === 403)
          ? t('errorCredentials')
          : mode === 'sign-up' && res.error.status === 422
            ? t('errorExists')
            : t('errorGeneric')
      );
      return;
    }
    onAuthenticated();
  }

  const isUp = mode === 'sign-up';
  const inputCls =
    'mt-1 w-full rounded-md border border-apa-line px-3 py-2.5 text-sm focus:border-apa-green focus:outline-none focus:ring-2 focus:ring-apa-green/20';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-apa-navy/60 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-apa-lg bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-apa-green">
            {t(isUp ? 'signUpTitle' : 'signInTitle')}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-apa-grey hover:text-apa-ink"
          >
            ✕
          </button>
        </div>
        <p className="mt-1 text-sm text-apa-grey">{tm('modalHint')}</p>

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          {isUp ? (
            <label className="block text-sm font-semibold text-apa-ink">
              {t('name')}
              <input name="name" required autoComplete="name" className={inputCls} />
            </label>
          ) : null}
          <label className="block text-sm font-semibold text-apa-ink">
            {t('email')}
            <input type="email" name="email" required autoComplete="email" className={inputCls} />
          </label>
          <label className="block text-sm font-semibold text-apa-ink">
            {t('password')}
            <input
              type="password"
              name="password"
              required
              minLength={10}
              autoComplete={isUp ? 'new-password' : 'current-password'}
              className={inputCls}
            />
          </label>
          {error ? (
            <p role="alert" className="apa-box apa-box-gold p-3 text-sm">
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

        <p className="mt-4 text-center text-sm text-apa-grey">
          {isUp ? (
            <>
              {t('hasAccount')}{' '}
              <button
                type="button"
                onClick={() => setMode('sign-in')}
                className="font-semibold text-apa-green underline"
              >
                {t('signInLink')}
              </button>
            </>
          ) : (
            <>
              {t('noAccount')}{' '}
              <button
                type="button"
                onClick={() => setMode('sign-up')}
                className="font-semibold text-apa-green underline"
              >
                {t('createOne')}
              </button>
            </>
          )}
        </p>
        <input type="hidden" value={redirectTo} readOnly aria-hidden />
      </div>
    </div>
  );
}
