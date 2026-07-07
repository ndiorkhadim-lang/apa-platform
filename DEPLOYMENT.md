# APA Platform — Deployment Guide (Vercel)

This app is a **Next.js 16** full-stack application (React 19, Prisma 7,
PostgreSQL, Better Auth). It builds cleanly and every data page is
server-rendered on demand, so **no database is needed at build time** — only
at runtime.

Estimated time to a live URL: **~20 minutes**.

---

## 0 · What you need (accounts, all have free tiers)

| Service | Purpose | Free tier |
|---|---|---|
| **Vercel** | Hosting + CI | Yes |
| **Neon** (or Supabase) | Production PostgreSQL | Yes |
| **GitHub** | Repo Vercel deploys from | Yes |
| Resend *(optional)* | Champion emails | Yes |

---

## 1 · Push the code to GitHub

```bash
cd apa-platform
git remote add origin https://github.com/<org>/apa-platform.git
git push -u origin main
```

## 2 · Create the production database (Neon)

1. Create a project at [neon.tech](https://neon.tech) (region: **Frankfurt** or
   **Paris** for Africa latency).
2. Copy the **pooled** connection string (looks like
   `postgresql://user:pass@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require`).

## 3 · Import to Vercel

1. [vercel.com/new](https://vercel.com/new) → import the GitHub repo.
2. Framework preset: **Next.js** (auto-detected). Leave build settings default —
   `package.json` already runs `prisma generate && next build`.
3. Add **Environment Variables** (Project Settings → Environment Variables):

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | the Neon pooled string |
   | `BETTER_AUTH_SECRET` | run `openssl rand -base64 32` |
   | `BETTER_AUTH_URL` | `https://<your-app>.vercel.app` |
   | `NEXT_PUBLIC_SITE_URL` | `https://<your-app>.vercel.app` |

   (Full list in `.env.example`. Optional vars — OAuth, Resend — can be added later.)

4. **Deploy.**

## 4 · Create the schema + load the data (once)

From your machine, pointed at the **production** DB:

```bash
# put the Neon URL in a local shell var (do NOT commit it)
export DATABASE_URL="postgresql://...neon.../neondb?sslmode=require"

npx prisma migrate deploy      # creates all 20 tables
npm run db:seed:all            # 63 tools, 54 nations, ACRI, C-SPA questions
```

`db:seed:all` is idempotent — safe to re-run.

## 5 · Create the first admin

Sign up once through the live site (`/en/sign-up`), then promote that user:

```bash
# using the Neon SQL editor or psql
UPDATE users SET "platformRole" = 'ADMIN_APA' WHERE email = 'you@theapaafrica.org';
```

That account now sees the admin dashboards (`/app/admin/champions`, `/app/admin/cspa`).

---

## 6 · After go-live

- **Custom domain**: Vercel → Domains → add `app.theapaafrica.org` (decision D3).
  Update `BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the custom domain.
- **Founder photos**: drop `aisha-babangida.jpg` and `pape-samb.jpg` into
  `public/founders/`, commit, push — Vercel redeploys automatically.
- **Preview deployments**: every branch/PR gets its own URL automatically —
  ideal for sharing work-in-progress with the CEO without touching production.

---

## Notes for the reviewer (CEO / stakeholders)

- The URL is a real, working app: create an account, run a C-SPA diagnostic,
  launch a tool, apply as a Champion, explore the ACRI dashboard.
- Content is drawn from the APA Master Memoire; illustrative figures are
  labelled as such (e.g. the ACRI shows "ILLUSTRATIVE / illustrative-v1").
- What is **not** wired yet is listed in `HANDOFF.md` (§ Open items).
