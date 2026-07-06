'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import { AuthModal } from './auth-modal';

/**
 * Marketplace "Access Tool" CTA.
 * - authenticated → straight to the tool workspace
 * - anonymous → auth modal, then redirect to the SAME tool (no re-search)
 */
export function AccessToolButton({
  slug,
  workspacePath,
}: {
  slug: string;
  workspacePath: string; // locale-aware path, e.g. /fr/app/tools/03-...
}) {
  const t = useTranslations('Marketplace');
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  async function onAccess() {
    setChecking(true);
    const { data } = await authClient.getSession();
    setChecking(false);
    if (data?.session) {
      window.location.href = workspacePath;
    } else {
      setModalOpen(true);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={onAccess}
        disabled={checking}
        className="mt-4 w-full rounded-md bg-apa-green px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-apa-green-mid disabled:opacity-60"
      >
        {checking ? '…' : `${t('accessTool')} →`}
      </button>
      {modalOpen ? (
        <AuthModal
          redirectTo={workspacePath}
          onClose={() => setModalOpen(false)}
          onAuthenticated={() => {
            window.location.href = workspacePath;
          }}
        />
      ) : null}
      {/* router kept for potential client nav; window redirect guarantees a fresh
          server render that re-reads the session cookie */}
      <span hidden aria-hidden onClick={() => router.refresh()} />
    </>
  );
}
