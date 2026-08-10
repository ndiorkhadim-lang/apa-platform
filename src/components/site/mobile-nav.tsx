'use client';

import { useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';

export interface MobileGroup {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export function MobileNav({
  groups,
  ctaLabel,
}: {
  groups: MobileGroup[];
  ctaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

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
        <nav className="absolute inset-x-0 top-16 z-50 max-h-[80vh] overflow-y-auto border-b border-apa-line bg-white shadow-lg">
          <ul className="px-4 py-3">
            {groups.map((g) => (
              <li key={g.href} className="border-b border-apa-mist last:border-0">
                <Link
                  href={g.href}
                  onClick={close}
                  className={`block py-3 text-sm font-bold uppercase tracking-wide ${
                    pathname === g.href ? 'text-apa-green' : 'text-apa-ink'
                  }`}
                >
                  {g.label}
                </Link>
                {g.children ? (
                  <ul className="pb-2 pl-4">
                    {g.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          onClick={close}
                          className={`block py-2 text-sm ${
                            pathname === c.href ? 'text-apa-green' : 'text-apa-grey'
                          }`}
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
            <li className="py-3">
              <Link
                href="/certification"
                onClick={close}
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
