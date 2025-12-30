'use server';

import {
  ajRestrictiveAuthenticated,
  auth,
  ensureSession,
  handleDeniedInServerAction,
} from '@/lib';
import { ROUTES } from '@/shared/constants';
import { basicAuthSchema } from '@/shared/schema';
import type { ActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';

type Response = ActionResponse<
  { totpURI: string; backupCodes: string[] },
  { message: string }
>;

export async function enableTwoFactorsAction(
  state: Response,
  input: unknown
): Promise<Response> {
  const parsedInput = basicAuthSchema.safeParse(input);
  if (!parsedInput.success)
    return { type: 'error', payload: { message: 'Invalid input' } };

  const [headersList, req] = await Promise.all([headers(), request()]);

  const session = await ensureSession(
    headersList,
    ROUTES.settings.nested.security.href
  );

  const decision = await ajRestrictiveAuthenticated.protect(req, {
    action: 'enable-2fa',
    userId: session.user.id,
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  try {
    const data = await auth.api.enableTwoFactor({
      body: { password: parsedInput.data.password },
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
