'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';

export function SignOutButton() {
  const t = useTranslations('Auth');
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut();
        router.push('/');
        router.refresh();
      }}
      className="rounded-md border border-apa-line px-4 py-2 text-sm font-medium text-apa-grey transition-colors hover:border-apa-green hover:text-apa-green"
    >
      {t('signOut')}
    </button>
  );
}
