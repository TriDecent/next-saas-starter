'use server';

import { verifySudoToken } from '@/features/auth/authenticate-prior';
import { auth, ensureSession } from '@/lib/auth';
import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/security';
import { COOKIES, ROUTES } from '@/shared/constants';
import { changePasswordSchema } from '@/shared/schema';
import type { ActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { cookies, headers } from 'next/headers';

type ChangePasswordResponse = ActionResponse<undefined, { message: string }>;

export async function changePasswordAction(
  state: ChangePasswordResponse,
  input: unknown
): Promise<ChangePasswordResponse> {
  const [headersList, cookiesList] = await Promise.all([headers(), cookies()]);
  const session = await ensureSession(
    headersList,
    ROUTES.settings.nested.security.href
  );

  const unverifiedSudoToken = cookiesList.get(
    COOKIES['sudo-token'].name
  )?.value;
  if (!unverifiedSudoToken)
    return {
      type: 'error',
      payload: { message: 'Please re-authenticate to change your password.' },
    };

  if (!verifySudoToken(unverifiedSudoToken, session.user.id))
    return {
      type: 'error',
      payload: { message: 'Please re-authenticate to change your password.' },
    };

  const parsedResult = changePasswordSchema.safeParse(input);

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
