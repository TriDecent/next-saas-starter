'use server';

import { verifySudoToken } from '@/features/auth/authenticate-prior';
import { auth, ensureSession } from '@/lib/auth';
import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/security';
import { COOKIES, ROUTES } from '@/shared/constants';
import type { ActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { cookies, headers } from 'next/headers';

type Response = ActionResponse<
  { totpURI: string; backupCodes: string[] },
  { message: string }
>;

export async function enableTwoFactorsAction(
  password: string
): Promise<Response> {
  const [headersList, req, cookiesList] = await Promise.all([
    headers(),
    request(),
    cookies(),
  ]);

  const sudoTokenCookie = cookiesList.get(COOKIES['sudo-token'].name);
  if (!sudoTokenCookie)
    return {
      type: 'error',
      payload: { message: 'You must re-authenticate to perform this action' },
    };
  const session = await ensureSession(
    headersList,
    ROUTES.settings.nested.security.href
  );
  if (!verifySudoToken(sudoTokenCookie.value, session.user.id))
    return {
      type: 'error',
      payload: { message: 'You must re-authenticate to perform this action' },
    };

  const decision = await ajRestrictiveAuthenticated.protect(req, {
    action: 'enable-2fa',
    userId: session.user.id,
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  try {
    const data = await auth.api.enableTwoFactor({
      body: { password },
      headers: headersList,
    });

    return {
      type: 'success',
      payload: data,
    };
  } catch (error) {
    return {
      type: 'error',
      payload: {
        message:
          error instanceof APIError || error instanceof Error
            ? error.message || 'Unknown error'
            : 'Unknown error',
      },
    };
  }
}
