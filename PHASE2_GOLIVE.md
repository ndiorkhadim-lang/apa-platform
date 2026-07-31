# APA Platform — Phase 2 Go-Live Runbook

Production hardening + deployment for the Verifiable-Credential platform
(Jalons 2.1–2.4). Follow top to bottom.

---

## 1. Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (Production).
Never commit real values; `.env.example` documents the shape.

| Variable | Required | What / where |
|---|---|---|
| `DATABASE_URL` | ✅ | Neon **pooled** connection string (`...-pooler.../db?sslmode=require`) |
| `BETTER_AUTH_SECRET` | ✅ | Session signing secret — `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | ✅ | Deployment origin, e.g. `https://apa-platform-five.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Same origin (SEO + verify URLs) |
| `APA_ISSUER_PRIVATE_KEY_PEM` | ✅ | Ed25519 **private** key (PEM) — signs credentials |
| `APA_ISSUER_PUBLIC_KEY_PEM` | ✅ | Ed25519 **public** key (PEM) — `/verify` + `/.well-known/did.json` |
| `APA_ISSUER_DID` | ⬜ | Defaults to `did:web:apa-platform-five.vercel.app` |
| `APA_ISSUER_NAME` | ⬜ | Defaults to `African Public Administration Institute` |
| `ANTHROPIC_API_KEY` | ⬜ | Set to auto-switch AI Concierge + capstone pre-scoring to a live Claude model; unset = deterministic engines |
| `ANTHROPIC_MODEL` | ⬜ | Defaults to `claude-sonnet-5` (Claude 3.5 Sonnet is retired) |
| `GOOGLE_CLIENT_ID/SECRET`, `LINKEDIN_*` | ⬜ | OAuth sign-in (auto-enabled when both set) |
| `RESEND_API_KEY`, `EMAIL_FROM` | ⬜ | Champion notification emails |

> **PEM on Vercel:** paste the key **with its real line breaks** (Vercel accepts
> multiline values). The runtime passes the value straight to `node:crypto`, so
> escaped `\n` will NOT work — use actual newlines.

### Generate the Ed25519 issuer keypair

```bash
openssl genpkey -algorithm ed25519 -out issuer_private.pem
openssl pkey -in issuer_private.pem -pubout -out issuer_public.pem
```

Paste `issuer_private.pem` → `APA_ISSUER_PRIVATE_KEY_PEM`, `issuer_public.pem` →
`APA_ISSUER_PUBLIC_KEY_PEM`. **Keep the private key out of git and CI logs.**

---

## 2. Database migration (Neon)

Local dev uses `npm run db:apply` (PGlite). **Production uses Prisma migrate deploy.**

```bash
# From the project root, with the production DATABASE_URL exported:
npm run db:migrate:prod        # = prisma migrate deploy (applies all prisma/migrations)
npm run db:seed:all            # 63 tools + nations + ACRI + C-SPA question bank
```

Phase-2 migrations included: `..._vc_issuance`, `..._capstone` (plus the Jalon-2.2
course/lesson tables). `prisma generate` runs automatically via `postinstall` + `build`.

### Promote the first APA administrator

RBAC is enforced (see §4). Grant the first `ADMIN_APA` directly in SQL:

```sql
UPDATE users SET "platformRole" = 'ADMIN_APA' WHERE email = 'pape@theapaafrica.org';
```

---

## 3. Deploy

```bash
git push            # Vercel builds: prisma generate → next build
```

Or `vercel --prod`. The build is verified: `next build` compiles all routes incl.
`/api/v1/credentials/{issue,revoke,status-list}`, `/.well-known/did.json`,
`/verify/[credentialId]`, `/learn/[courseId]`, `/enterprise`.

---

## 4. RBAC (enforced in production)

Server-side guards (`src/lib/guards.ts`) run at the top of each protected page.
In production an unauthorized request is redirected; in dev a demo preview renders.

| Surface | Requirement |
|---|---|
| `/learn/[courseId]`, `/learn/[courseId]/capstone` | authenticated candidate (`requireCandidate`) |
| `/enterprise`, `/enterprise/skills-matrix` | `ADMIN_APA` or `ORG_ADMIN` of the org (`requireOrgAdmin`) |
| `/app/admin/capstone` | `ADMIN_APA` or `AUDITOR` |
| `POST /api/v1/credentials/issue` | `ADMIN_APA` (401/403 otherwise) |
| `POST /api/v1/credentials/revoke` | `ADMIN_APA` (one-click revocation) |

---

## 5. DID sovereignty (open decision)

`did:web:apa-platform-five.vercel.app` resolves to
`https://apa-platform-five.vercel.app/.well-known/did.json`, which this app
**auto-publishes** from `APA_ISSUER_PUBLIC_KEY_PEM` — no static file to maintain.

⚠️ **Sovereignty caveat:** the DID is bound to the Vercel preview domain. If that
domain ever changes, **every already-issued credential becomes unverifiable**.
To migrate to a sovereign domain later:

1. Serve the app on `credentials.theapaafrica.org` (or similar, stable).
2. Set `APA_ISSUER_DID=did:web:credentials.theapaafrica.org`.
3. Re-issue outstanding credentials under the new DID (old ones stay pinned to the
   old domain — keep it alive, or accept invalidation).

Do this **before** issuing at scale.

---

## 6. Post-deploy smoke test

```bash
BASE=https://apa-platform-five.vercel.app

# DID document resolves and exposes the multibase key
curl -s $BASE/.well-known/did.json | jq .verificationMethod[0].publicKeyMultibase

# Public verification page loads (no auth, no cookie wall)
curl -s -o /dev/null -w "%{http_code}\n" $BASE/en/verify/APA-2026-XX-000001

# Revocation is gated (must be 401 without an ADMIN_APA session)
curl -s -o /dev/null -w "%{http_code}\n" -X POST $BASE/api/v1/credentials/revoke \
  -H 'content-type: application/json' -d '{"publicNumber":"X","reason":"y"}'

# StatusList2021 registry serves the encoded bitstring
curl -s $BASE/api/v1/credentials/status-list | jq .credentialSubject.type
```

Expected: multibase key present · verify page `200` · revoke `401` · status list
`"StatusList2021"`.

---

## 7. One-click manual revocation (ADMIN_APA)

```bash
curl -X POST $BASE/api/v1/credentials/revoke \
  -H 'content-type: application/json' \
  -H 'cookie: <admin session cookie>' \
  -d '{"publicNumber":"APA-2026-SN-000123","reason":"issued in error"}'
```

Effect: certificate → `REVOKED`, audit `certificate.revoke` written, StatusList
bit set → `/verify/APA-2026-SN-000123` flips to **REVOKED** on next load.
