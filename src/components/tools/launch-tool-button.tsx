'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { AuthModal } from './auth-modal';

/**
 * "Launch Tool" — the operational CTA. Authenticated users go straight to
 * the tool's secure workspace (C-SPA for tool #3, tool workspace otherwise);
 * anonymous users authenticate in-place, then land on the same tool.
 */
export function LaunchToolButton({
  launchPath,
  label,
}: {
  launchPath: string;
  label: string;
}) {
  const [checking, setChecking] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  async function onLaunch() {
    setChecking(true);
    const { data } = await authClient.getSession();
    setChecking(false);
    if (data?.session) window.location.href = launchPath;
    else setModalOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={onLaunch}
        disabled={checking}
        className="mt-4 w-full rounded-md bg-apa-green px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-apa-green-mid disabled:opacity-60"
      >
        {checking ? '…' : `${label} →`}
      </button>
      {modalOpen ? (
        <AuthModal
          redirectTo={launchPath}
          onClose={() => setModalOpen(false)}
          onAuthenticated={() => {
            window.location.href = launchPath;
          }}
        />
      ) : null}
    </>
  );
}
