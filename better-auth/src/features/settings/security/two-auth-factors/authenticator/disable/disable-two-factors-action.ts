'use server';

import {
  ajLaxAuthenticated,
  auth,
  ensureSession,
  handleDeniedInServerAction,
} from '@/lib';
import { ROUTES } from '@/shared/constants';
import type { ActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';
import { twoFAAuthSchema } from '../../_shared/schema';

type Response = ActionResponse<undefined, { message: string }>;

export async function disableTwoFactorsAction(
  state: Response,
  input: unknown
): Promise<Response> {
  const parsedInput = twoFAAuthSchema.safeParse(input);
  if (!parsedInput.success)
    return { type: 'error', payload: { message: 'Invalid input' } };

  const [headersList, req] = await Promise.all([headers(), request()]);

  const session = await ensureSession(
    headersList,
    ROUTES.settings.nested.security.href
  );

  const decision = await ajLaxAuthenticated.protect(req, {
    action: 'get-totp-uri',
    userId: session.user.id,
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  try {
    await auth.api.verifyTOTP({
      body: { code: parsedInput.data.code },
      headers: headersList,
    });

    await auth.api.disableTwoFactor({
      body: { password: parsedInput.data.password },
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
