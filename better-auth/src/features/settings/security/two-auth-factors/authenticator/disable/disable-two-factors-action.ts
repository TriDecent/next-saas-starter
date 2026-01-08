'use server';

import {
  SUDO_TOKEN_COOKIE,
  verifySudoToken,
} from '@/features/auth/authenticate-prior';
import { auth, ensureSession } from '@/lib/auth';
import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/security';
import { ROUTES } from '@/shared/constants';
import type { ActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { cookies, headers } from 'next/headers';

type Response = ActionResponse<undefined, { message: string }>;

export async function disableTwoFactorsAction(
  password: string
): Promise<Response> {
  const [headersList, req, cookiesList] = await Promise.all([
    headers(),
    request(),
    cookies(),
  ]);

  const sudoTokenCookie = cookiesList.get(SUDO_TOKEN_COOKIE.name);
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
    action: 'disable-2fa',
    userId: session.user.id,
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  try {
    await auth.api.disableTwoFactor({
      body: { password },
      headers: headersList,
    });
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

  return { type: 'success', payload: undefined };
}
