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
import { twoFAAuthSchema } from '../../features/settings/security/two-auth-factors';

type Response = ActionResponse<undefined, { message: string }>;

export async function authenticatePriorAction(
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
    action: 'authenticate-prior-action',
    userId: session.user.id,
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  try {
    await Promise.all([
      auth.api.signInEmail({
        body: {
          email: session.user.email,
          password: parsedInput.data.password,
        },
        headers: headersList,
      }),
      auth.api.verifyTOTP({
        body: { code: parsedInput.data.code },
        headers: headersList,
      }),
    ]);

    return {
      type: 'success',
      payload: undefined,
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
