import 'server-only';

/**
 * Tool-access routing — single source of truth for "where does a tool open?".
 *
 * The product spec wants tools to open on certification.theapaafrica.org via SSO.
 * That subdomain is not wired yet, so by default tools open INSIDE this app at
 * /app/tools/{slug} (same session, no dead end). The day the subdomain is live,
 * set TOOLS_WORKSPACE_ORIGIN and the whole platform points there — no code change.
 *
 * Cross-subdomain SSO: Better Auth is configured to scope its session cookie to
 * `.theapaafrica.org` when AUTH_COOKIE_DOMAIN is set, so the session is already
 * shared with certification.theapaafrica.org — the redirect carries the user in.
 */
const EXTERNAL_ORIGIN = process.env.TOOLS_WORKSPACE_ORIGIN?.replace(/\/$/, '');

/** Absolute or app-relative URL where a tool's workspace opens. */
export function toolWorkspaceUrl(slug: string, locale: string): string {
  if (EXTERNAL_ORIGIN) return `${EXTERNAL_ORIGIN}/tools/${slug}`;
  return `/${locale}/app/tools/${slug}`;
}

/** Whether tool workspaces live on another origin (drives full-page redirects). */
export const toolsAreExternal = Boolean(EXTERNAL_ORIGIN);
