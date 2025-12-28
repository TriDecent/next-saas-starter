'use server';

import { credentialsSchema } from '@/features/_shared';
import { ajEmailSend, ajLaxAnonymous, handleDeniedInServerAction } from '@/lib';
import { auth } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import type { OldActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import z from 'zod';

const resetPasswordSchema = credentialsSchema.pick({ email: true });

type ResetPasswordInput = Partial<z.infer<typeof resetPasswordSchema>>;

type ResetPasswordError = Partial<
  Record<keyof ResetPasswordInput, string[]>
> & {
  unexpected?: string;
  auth?: string;
};

export type ResetPasswordResponse = OldActionResponse<
  ResetPasswordInput,
  ResetPasswordError
>;

export type ErrorResetPasswordResponse = Partial<
  Extract<ResetPasswordResponse, { type: 'error' }>
>;

export type SuccessResetPasswordResponse = Extract<
  ResetPasswordResponse,
  { type: 'success' }
>;

export async function resetPasswordAction(
  state: ResetPasswordResponse,
  formData: FormData
): Promise<ResetPasswordResponse> {
  const req = await request();
  const inputDecision = await ajLaxAnonymous.protect(req, {
    action: 'sa-reset-password-input-check',
  });

  if (inputDecision.isDenied()) handleDeniedInServerAction(inputDecision);

  const input = Object.fromEntries(formData.entries());
  const parsedResult = resetPasswordSchema.safeParse(input);

  if (!parsedResult.success)
    return {
      type: 'error',
      payload: {
        userEntered: input,
        errors: z.flattenError(parsedResult.error).fieldErrors,
      },
    };

  const emailForPasswordReset = parsedResult.data.email;

  const resetPasswordDecision = await ajEmailSend.protect(req, {
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
  } catch (error) {
    return {
      type: 'error',
      payload: {
        userEntered: parsedResult.data,
        errors: {
          auth:
            error instanceof APIError || error instanceof Error
              ? error.message
              : 'Unknown error',
        },
      },
    };
  }

  return {
    type: 'success',
    payload: {
      userEntered: null,
      errors: null,
    },
  };
}
