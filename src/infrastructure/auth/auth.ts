import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '../prisma/client';

/**
 * Better Auth server instance.
 * - email/password enabled from day one
 * - Google / LinkedIn OAuth activate automatically once env vars are set
 * - platformRole rides on the user (RBAC source of truth, never client-writable)
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
  },
  user: {
    additionalFields: {
      platformRole: {
        type: 'string',
        defaultValue: 'USER',
        input: false, // never accepted from the client
      },
    },
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
    ...(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
      ? {
          linkedin: {
            clientId: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
          },
        }
      : {}),
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 10, // 10 auth attempts / minute / IP
  },
  // Cross-subdomain SSO: when set (e.g. ".theapaafrica.org"), the session cookie
  // is shared with certification.theapaafrica.org so tools open already-signed-in.
  ...(process.env.AUTH_COOKIE_DOMAIN
    ? {
        advanced: {
          crossSubDomainCookies: {
            enabled: true,
            domain: process.env.AUTH_COOKIE_DOMAIN,
          },
        },
      }
    : {}),
});

export type AuthSession = typeof auth.$Infer.Session;
