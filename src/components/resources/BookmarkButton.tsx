'use client';

import { useEffect, useState } from 'react';

const KEY = 'apa.resources.bookmarks';

function read(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function write(list: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new StorageEvent('storage', { key: KEY }));
  } catch { /* ignore */ }
}

/** Toggle a resource bookmark. User feature — persists locally, backend-ready. */
export function BookmarkButton({ slug, label = false }: { slug: string; label?: boolean }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(read().includes(slug));
    const sync = () => setOn(read().includes(slug));
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [slug]);

  function toggle() {
    const list = read();
    const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
    write(next);
    setOn(next.includes(slug));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      title={on ? 'Remove bookmark' : 'Bookmark'}
      className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
        on ? 'border-apa-gold bg-apa-gold/10 text-apa-bronze' : 'border-apa-line text-apa-grey hover:border-apa-green hover:text-apa-green'
      }`}
    >
      <span>{on ? '★' : '☆'}</span>
      {label ? <span>{on ? 'Bookmarked' : 'Bookmark'}</span> : null}
    </button>
  );
}
