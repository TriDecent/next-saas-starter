'use server';

import {
  ajRestrictiveAuthenticated,
  auth,
  ensureSession,
  handleDeniedInServerAction,
} from '@/lib';
import { ROUTES } from '@/shared/constants';
import { twoFAAuthSchema } from '@/shared/schema';
import type { ActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';

type Response = ActionResponse<{ backupCodes: string[] }, { message: string }>;

export async function generateBackupCodesAction(
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

  const decision = await ajRestrictiveAuthenticated.protect(req, {
    action: 'generate-backup-codes',
    userId: session.user.id,
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  try {
    await auth.api.verifyTOTP({
      body: { code: parsedInput.data.code },
      headers: headersList,
    });

    const data = await auth.api.generateBackupCodes({
      body: { password: parsedInput.data.password },
      headers: headersList,
    });

    return {
      type: 'success',
      payload: { backupCodes: data.backupCodes },
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
