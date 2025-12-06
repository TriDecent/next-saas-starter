'use server';

import {
  ajRestrictiveAnonymous,
  ajRestrictiveAuthenticated,
  auth,
  handleDeniedInServerAction,
} from '@/lib';
import type { ActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';
import { totpAuthSchema } from '../../_shared/schema';

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
      body: { code: parsedInput.data.code },
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
