'use server';

import { auth } from '@/lib/auth';
import {
  ajRestrictiveAnonymous,
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/security';
import { totpAuthSchema } from '@/shared/schema';
import type { ActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';

type Response = ActionResponse<undefined, { message: string }>;

export async function verifyTotpAction(
  state: Response,
  input: unknown
): Promise<Response> {
  const parsedInput = totpAuthSchema.safeParse(input);
  if (!parsedInput.success)
    return { type: 'error', payload: { message: 'Invalid input' } };

  const [headersList, req] = await Promise.all([headers(), request()]);

  const session = await auth.api.getSession({ headers: headersList });

  const decision = session
    ? await ajRestrictiveAuthenticated.protect(req, {
        action: 'verify-totp',
        userId: session.user.id,
      })
    : await ajRestrictiveAnonymous.protect(req, { action: 'verify-totp' });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  try {
    await auth.api.verifyTOTP({
      body: {
        code: parsedInput.data.code,
        trustDevice: parsedInput.data.trustDevice,
      },
      headers: headersList,
    });

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
