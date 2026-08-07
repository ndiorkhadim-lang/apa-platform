/**
 * Demo Mode — temporary stakeholder-preview switch.
 *
 * When ON (default), unauthenticated visitors get READ-ONLY access to the
 * protected surfaces (C-SPA diagnostic, workspace, tool workspaces, admin
 * previews, application forms). Every mutation stays server-guarded — the
 * server actions still require a session — so demo mode can never write,
 * submit, upload or pay. Pages display a clear "Demo Mode" notice instead.
 *
 * Turn OFF for production hardening by setting NEXT_PUBLIC_DEMO_MODE=off
 * in the Vercel environment (no code change needed).
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== 'off';

/**
 * Read-only preview access: true in dev, or in production while DEMO_MODE is on.
 * Gates the demo fallback in RBAC guards and page resolvers so protected
 * surfaces (learn, enterprise) are viewable in a stakeholder preview. Mutations
 * stay server-guarded regardless.
 */
export const PREVIEW_ACCESS = DEMO_MODE || process.env.NODE_ENV !== 'production';

/** The identity shown on demo-accessed pages. Never persisted. */
export const DEMO_USER = {
  id: 'demo-preview',
  name: 'Guest (Preview)',
  email: 'preview@theapaafrica.org',
} as const;
