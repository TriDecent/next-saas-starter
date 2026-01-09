'use server';

import { auth } from '@/lib/auth';
import {
  ajRestrictiveAnonymous,
  handleDeniedInServerAction,
} from '@/lib/security';
import { backupCodeSchema } from '@/shared/schema';
import type { ActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';

type Response = ActionResponse<undefined, { message: string }>;

export async function verifyBackupCodesAction(
  state: Response,
  input: unknown
): Promise<Response> {
  const parsedInput = backupCodeSchema.safeParse(input);
  if (!parsedInput.success)
    return { type: 'error', payload: { message: 'Invalid input' } };

  const [headersList, req] = await Promise.all([headers(), request()]);

  const decision = await ajRestrictiveAnonymous.protect(req, {
    action: 'verify-backup-codes',
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  try {
    await auth.api.verifyBackupCode({
      body: {
        code:
          parsedInput.data.code.slice(0, 5) +
          '-' +
          parsedInput.data.code.slice(5),
        trustDevice: parsedInput.data.trustDevice,
      },
      headers: headersList,
    });

    return { type: 'success', payload: undefined };
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
