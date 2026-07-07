# APA Platform — Developer Handoff

Everything a developer needs to understand this build and reconcile it with the
current site at **theapaafrica.org**. Read this once before touching the code.

---

## 1 · What this is

A production-ready **governance platform** (not a marketing site) implementing
the APA Master Memoire: the 63-tool GRC suite as an operational marketplace, the
C-SPA certification diagnostic, the ACRI executive analytics, the Champions
recruitment pipeline, and the 3-tier Intelligence membership — bilingual FR/EN.

It is meant to **become** `app.theapaafrica.org`, sitting alongside the existing
marketing site. The header IA already matches the live site
(HOME · ABOUT · JOURNEYS · FRAMEWORK · SOLUTIONS · AI CONCIERGE · USER MENU).

## 2 · Stack (and why)

| Layer | Choice | Note |
|---|---|---|
| Framework | **Next.js 16** (App Router, RSC) | ⚠️ Breaking changes vs 14/15 — see `AGENTS.md`. Middleware is `src/proxy.ts` (renamed in 16). |
| UI | React 19 · Tailwind v4 | Design tokens in `src/app/globals.css` (`@theme`), V8 brand palette. |
| DB / ORM | PostgreSQL · **Prisma 7** | Driver adapter required (`@prisma/adapter-pg`). Client generated to `src/generated/prisma` (git-ignored; `prisma generate` runs on install + build). |
| Auth | **Better Auth** | Email/password + OAuth (env-gated). `platformRole` is server-only (RBAC source of truth). |
| i18n | next-intl | `/fr` + `/en`, messages in `messages/*.json`. |

## 3 · Architecture (Clean Architecture — dependency rule enforced)

```
src/
  domain/          # pure business logic, zero framework imports
    acri/          # ACRI methodology + insight engine
    cspa/          # C-SPA scoring engine + maturity model
    solutions/     # 63-tools → Solutions/Frameworks ecosystem graph
    tools/         # tool workspace blueprints
    about/         # leadership data (founders, advisors, hubs, career path)
    site/          # contact + socials single source of truth
  application/     # (reserved for use-cases as they grow)
  infrastructure/  # prisma client, auth, email adapters
  app/[locale]/    # pages: (public) / (auth) / (app) route groups
  app/api/         # auth handler + REST /api/v1
  components/      # UI, grouped by feature
  lib/             # session, auth-client, tool-access
```

**Golden rule:** all displayed data flows from the DB + a `domain/` module.
No page owns its own numbers. Example: every ACRI figure traces to
`acri_scores` + `domain/acri/methodology.ts`.

## 4 · Database (26 models, 7 migrations)

Run `npx prisma studio` to browse. Key groups:

- **Identity** (Better Auth): `users` (+`platformRole`), `sessions`, `accounts`, `verifications`, `organizations`, `memberships`
- **Catalog**: `pillars` (6), `tools` (63), `tool_engagements`, `nations` (54)
- **Tool marketplace**: `tool_sessions`, `tool_reports`
- **Certification**: `certification_journeys`, `cspa_questions` (versioned bank), `cspa_runs`, `trust_audits`, `agreements`, `certificates` (public `/verify`)
- **ACRI**: `acri_scores` (nation × criterion × dataVersion)
- **Champions**: `champion_applications`, `champion_reviews`
- **Intelligence**: `subscriptions`, `intelligence_briefs`
- **Cross-cutting**: `leads`, `audit_logs` (append-only)

Migrations are plain SQL in `prisma/migrations/` and run with
`prisma migrate deploy` (prod) — see `DEPLOYMENT.md`.
> Local dev note: the local `prisma dev` server (PGlite/wasm) rejects the Rust
> schema engine (`P1017`), so locally we apply migrations with
> `npm run db:apply` (a pg-driver runner). **Production/Neon uses the standard
> `prisma migrate deploy`** — no workaround needed there.

## 5 · Seed data (regenerable — the Master Memoire is the source of truth)

| Script | Produces |
|---|---|
| `prisma/seed.ts` | 6 pillars, 63 tools FR/EN (official V3 categories 22/14/15/12), 54 nations (22 Atlas priority w/ ACRI, 16 champions) |
| `scripts/seed-acri.mjs` | ACRI per-criterion scores (`illustrative-v1`), a **traceable** decomposition of the official composites |
| `scripts/seed-cspa.mjs` | 18 C-SPA questions (`cspa-v1`), grounded in the corpus |

`npm run db:seed:all` runs all three (idempotent).

## 6 · How it maps to the current theapaafrica.org

The live site uses the same primary nav; this build implements the pages behind
it as a real application. Reconciliation notes:

- **Content parity**: copy is drawn from the Master Memoire / V8 Synthesis.
  Where the live site has placeholders (`[Partner 1-5]`, missing hero visual),
  this build has real, working sections instead.
- **Tools open at** `launchPath()` (`src/domain/solutions/ecosystem.ts`):
  today in-app (`/app/tools/{slug}`, C-SPA at `/app/cspa`). To route tools to
  `certification.theapaafrica.org` instead, set `TOOLS_WORKSPACE_ORIGIN` +
  `AUTH_COOKIE_DOMAIN` — **no code change** (cross-subdomain SSO is pre-wired).
- **Founder photos**: drop into `public/founders/` (see its README).
- **Socials/contact**: single source in `src/domain/site/contact.ts` — verify
  the LinkedIn/YouTube/X URLs there.

## 7 · Open items (decisions & not-yet-wired)

| ID | Item | Status |
|---|---|---|
| **D1** | Which "22 nations" headline the Champions map (Atlas vs V8 list) | DB models both; showing Atlas 22 |
| **D2** | Official C-SPA rubric (questions/weights) | Engine is versioned; `cspa-v1` seeded from corpus — replace by re-seeding a new version, no code change |
| **D3** | Go-live domain `app.theapaafrica.org` | Needs DNS |
| **D4** | Payment rail | v1 = manual activation; Paystack/Flutterwave/Stripe adapters pending |
| — | Certification steps 2–5 (Trust Audit → certificate issuance) | Schema ready; C-SPA (step 1) is live |
| — | Document uploads (CV, IDs) | Collected as links; presigned S3 pending (`AWS_*` env) |
| — | ACRI live datasets | `illustrative-v1` in place; swap by adding a measured `dataVersion` |
| — | Automated tests + CI | Vitest/Playwright/GitHub Actions pending |

## 8 · Common commands

```bash
npm install              # also runs prisma generate (postinstall)
npm run dev              # local dev (needs a Postgres; see below)
npm run typecheck        # tsc --noEmit — must be clean
npm run build            # prisma generate && next build
npm run db:seed:all      # load all seed data

# Local DB (no Docker): npx prisma dev  → then npm run db:apply && npm run db:seed:all
```

## 9 · Conventions

- TypeScript strict; `npm run typecheck` must pass before every commit.
- Bilingual: any new user-facing string goes in **both** `messages/fr.json` and
  `messages/en.json`.
- RBAC is checked in server code (actions/route handlers), never UI-only.
- New displayed data → add a `domain/` module; don't hardcode values in pages.
