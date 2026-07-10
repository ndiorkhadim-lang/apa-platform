'use client';

import { useEffect } from 'react';

/** Auto-opens the system print dialog (Save as PDF) when ?print=1. */
export function PrintTrigger({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return;
    const t = setTimeout(() => window.print(), 900); // let fonts/images settle
    return () => clearTimeout(t);
  }, [enabled]);
  return null;
}

/** Manual "Save as PDF / Print" button for the publication toolbar. */
export function PrintNowButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md bg-apa-green px-4 py-2 text-sm font-bold text-white hover:bg-apa-green-mid"
    >
      ⬇ Save as PDF / Print
    </button>
  );
}
