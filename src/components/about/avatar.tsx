'use client';

import { useState } from 'react';

/**
 * Photo when the file exists, else an elegant initials avatar on brand
 * gradient. Uses a plain <img> with onError fallback so a not-yet-uploaded
 * portrait never shows a broken image — drop the real file at the path and
 * it appears on next load, no code change.
 */
export function Avatar({
  name,
  photo,
  size = 96,
}: {
  name: string;
  photo?: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (photo && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        onError={() => setFailed(true)}
        className="shrink-0 rounded-full object-cover ring-2 ring-apa-gold"
        style={{ width: size, height: size }}
      />
    );
  }

  const initials = name
    .split(/\s+/)
    .filter((w) => /[A-Za-zÀ-ÿ]/.test(w[0] ?? ''))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');

  return (
    <div
      aria-hidden
      className="apa-gradient flex shrink-0 items-center justify-center rounded-full font-extrabold text-apa-gold-bright ring-2 ring-apa-gold"
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {initials}
    </div>
  );
}
