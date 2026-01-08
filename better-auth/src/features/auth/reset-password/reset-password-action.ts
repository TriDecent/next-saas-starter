'use server';

import { auth } from '@/lib/auth';
import { ajEmailSend, handleDeniedInServerAction } from '@/lib/security';
import { ROUTES } from '@/shared/constants';
import { resetPasswordSchema } from '@/shared/schema';
import type { ActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';

type ResetPasswordResponse = ActionResponse<undefined, { message: string }>;

export async function resetPasswordAction(
  state: ResetPasswordResponse,
  input: unknown
): Promise<ResetPasswordResponse> {
  const parsedResult = resetPasswordSchema.safeParse(input);

  if (!parsedResult.success)
    return { type: 'error', payload: { message: 'Invalid input data' } };

  const emailForPasswordReset = parsedResult.data.email;

  const resetPasswordDecision = await ajEmailSend.protect(await request(), {
    action: 'sa-reset-password',
    emailId: `${emailForPasswordReset}`,
    requested: 1,
  });

  if (resetPasswordDecision.isDenied())
    handleDeniedInServerAction(
      resetPasswordDecision,
      ROUTES.auth.nested['reset-password'].href
    );

  try {
    await auth.api.requestPasswordReset({
      body: {
        email: emailForPasswordReset,
        redirectTo: ROUTES.auth.nested['reset-password'].href,
      },
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
