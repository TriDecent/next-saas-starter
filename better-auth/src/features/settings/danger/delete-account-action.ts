'use server';

import { auth, ensureSession } from '@/lib/auth';
import {
  ajExtremeRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/security';
import { ROUTES } from '@/shared/constants';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { refresh } from 'next/cache';
import { headers } from 'next/headers';

// deleteAccountAction handles two cases:
// - No token: send confirmation email
// - With token: perform account deletion

// Note: Better Auth does not provide
//       a separate method for sending only
//       delete account verification

export async function deleteAccountAction(token?: string) {
  const [req, headersList] = await Promise.all([request(), headers()]);
  const session = await ensureSession(
    headersList,
    ROUTES.settings.nested.danger.href
  );

  const decision = await ajExtremeRestrictiveAuthenticated.protect(req, {
    userId: session.user.id,
    action: token ? 'delete-account' : 'send-delete-verification-email',
  });

  if (decision.isDenied()) handleDeniedInServerAction(decision);

  try {
    await auth.api.deleteUser({
      headers: headersList,
      body: { token, callbackURL: ROUTES.auth.href },
    });
    if (token) await auth.api.signOut({ headers: headersList }); // prevent client session cache
  } catch (error) {
    throw new Error(
      error instanceof APIError ? error.message : 'Unknown error'
    );
  }

  refresh();
}
