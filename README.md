# APA Platform

**Accountable Partners for Africa** — the governance-intelligence platform.
Bilingual (FR/EN) Next.js 16 application implementing the APA Master Memoire:
63-tool GRC marketplace, C-SPA certification diagnostic, ACRI executive
analytics, Champions recruitment, and 3-tier Intelligence membership.

> Intended to become **app.theapaafrica.org**, alongside the marketing site.

## Quick start (local)

```bash
npm install
npx prisma dev &            # local Postgres (no Docker)
npm run db:apply           # apply migrations
npm run db:seed:all        # load tools, nations, ACRI, C-SPA
npm run dev                # http://localhost:3000/fr
```

## Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** — ship to Vercel (~20 min).
- **[HANDOFF.md](./HANDOFF.md)** — architecture, database, decisions, open items.
- **[AGENTS.md](./AGENTS.md)** — Next.js 16 breaking-change notes.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind v4 · Prisma 7 · PostgreSQL ·
Better Auth · next-intl. Clean Architecture (`domain` → `application` →
`infrastructure` → `presentation`).

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | `prisma generate && next build` |
| `npm run typecheck` | `tsc --noEmit` (must be clean) |
| `npm run db:seed:all` | Seed tools / nations / ACRI / C-SPA |
| `npm run db:migrate:prod` | `prisma migrate deploy` (prod) |

© 2026 APA™ — Accountable Partners for Africa · APA Sénégal SARL.
