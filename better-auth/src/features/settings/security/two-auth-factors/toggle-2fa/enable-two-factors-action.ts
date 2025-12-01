'use server';

import { credentialsSchema } from '@/features/auth/action';
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

const schema = credentialsSchema.pick({ password: true });

type Response = ActionResponse<
  { totpURI: string; backupCodes: string[] },
  { message: string }
>;

export async function enableTwoFactorsAction(
  state: Response,
  input: unknown
): Promise<Response> {
  console.log(input);
  const parsedInput = schema.safeParse(input);
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
    const data = await auth.api.enableTwoFactor({
      body: { password: parsedInput.data.password },
      headers: headersList,
    });

    return {
      type: 'success',
      payload: data,
    };
  } catch (error) {
    console.log(error);
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
