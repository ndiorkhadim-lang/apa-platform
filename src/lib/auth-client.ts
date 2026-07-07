'use client';

import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;

export async function safeGetSession() {
  try {
    const { data } = await authClient.getSession();
    return data;
  } catch {
    return null;
  }
}
