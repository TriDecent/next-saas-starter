'use server';

import { changePasswordSchema } from '@/features/_shared';
import {
  ajRestrictiveAuthenticated,
  ensureSession,
  handleDeniedInServerAction,
} from '@/lib';
import { auth } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import type { ActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';

type ChangePasswordResponse = ActionResponse<undefined, { message: string }>;

export async function changePasswordAction(
  state: ChangePasswordResponse,
  input: unknown
): Promise<ChangePasswordResponse> {
  const headersList = await headers();
  const session = await ensureSession(
    headersList,
    ROUTES.settings.nested.security.href
  );

  const parsedResult = changePasswordSchema.safeParse(input);

  console.log(parsedResult.data);

  if (!parsedResult.success)
    return { type: 'error', payload: { message: 'Invalid input data' } };

  const changePasswordDecision = await ajRestrictiveAuthenticated.protect(
    await request(),
    {
      action: 'sa-update-password',
      userId: session.user.id,
    }
  );

  if (changePasswordDecision.isDenied())
    handleDeniedInServerAction(changePasswordDecision);

  const { newPassword, currentPassword, revokeOtherSessions } =
    parsedResult.data;

  try {
    await auth.api.changePassword({
      body: { currentPassword, newPassword, revokeOtherSessions },
      headers: headersList,
    });

    return { type: 'success', payload: undefined };
  } catch (error) {
    return {
      type: 'error',
      payload: {
        message:
          error instanceof Error || error instanceof APIError
            ? error.message
            : 'Unknown error',
      },
    };
  }
}
