'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';

/**
 * USER MENU — single account entry point (fixes the live site's
 * "Sign Up in nav vs login form in footer" confusion).
 */
export function UserMenu({
  signedIn,
  name,
  isAdmin,
}: {
  signedIn: boolean;
  name?: string;
  isAdmin: boolean;
}) {
  const t = useTranslations('Nav');
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const initial = (name?.trim()[0] ?? '?').toUpperCase();
  const itemCls =
    'block w-full px-4 py-2.5 text-left text-sm text-apa-ink transition-colors hover:bg-apa-soft hover:text-apa-green';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('account')}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold transition-shadow ${
          signedIn
            ? 'apa-gradient text-apa-gold-bright ring-1 ring-apa-gold'
            : 'border border-apa-line text-apa-grey hover:border-apa-green hover:text-apa-green'
        }`}
      >
        {signedIn ? initial : '👤'}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-11 z-50 w-60 overflow-hidden rounded-apa-lg border border-apa-line bg-white py-1 shadow-xl"
        >
          {signedIn ? (
            <>
              <p className="border-b border-apa-mist px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-apa-grey">
                {name}
              </p>
              <Link href="/app" role="menuitem" onClick={() => setOpen(false)} className={itemCls}>
                {t('myWorkspace')}
              </Link>
              <Link href="/champions/apply" role="menuitem" onClick={() => setOpen(false)} className={itemCls}>
                {t('myApplication')}
              </Link>
              {isAdmin ? (
                <Link href="/app/admin/champions" role="menuitem" onClick={() => setOpen(false)} className={itemCls}>
                  {t('adminPipeline')}
                </Link>
              ) : null}
              <button
                type="button"
                role="menuitem"
                onClick={async () => {
                  await authClient.signOut();
                  setOpen(false);
                  router.push('/');
                  router.refresh();
                }}
                className={`${itemCls} border-t border-apa-mist text-apa-grey`}
              >
                {t('signOut')}
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in" role="menuitem" onClick={() => setOpen(false)} className={itemCls}>
                {t('signIn')}
              </Link>
              <Link
                href="/sign-up"
                role="menuitem"
                onClick={() => setOpen(false)}
                className={`${itemCls} font-semibold text-apa-green`}
              >
                {t('signUp')}
              </Link>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
