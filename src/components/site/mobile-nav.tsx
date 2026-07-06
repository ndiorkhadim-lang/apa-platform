'use client';

import { useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';

interface NavLink {
  label: string;
  href: string;
}

export function MobileNav({
  items,
  authLabel,
  authHref,
  ctaLabel,
}: {
  items: NavLink[];
  authLabel: string;
  authHref: string;
  ctaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label="Menu"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-apa-line text-apa-ink"
      >
        <span aria-hidden className="text-lg leading-none">
          {open ? '✕' : '☰'}
        </span>
      </button>

      {open ? (
        <nav className="absolute inset-x-0 top-16 z-50 border-b border-apa-line bg-white shadow-lg">
          <ul className="px-4 py-3">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block border-b border-apa-mist py-3 text-sm font-medium ${
                    pathname === item.href ? 'text-apa-green' : 'text-apa-ink'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={authHref}
                onClick={() => setOpen(false)}
                className="block border-b border-apa-mist py-3 text-sm font-semibold text-apa-navy"
              >
                {authLabel}
              </Link>
            </li>
            <li className="py-3">
              <Link
                href="/certification"
                onClick={() => setOpen(false)}
                className="block rounded-md bg-apa-green px-4 py-3 text-center text-sm font-semibold text-white"
              >
                {ctaLabel}
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
