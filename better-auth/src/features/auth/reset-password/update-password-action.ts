'use server';

import {
  ajLaxAnonymous,
  ajRestrictiveAnonymous,
  handleDeniedInServerAction,
} from '@/lib';
import { auth } from '@/lib/auth';
import type { OldActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';
import z from 'zod';
import { credentialsSchema } from '../action/credentials-schema';

const updatePasswordSchema = credentialsSchema
  .pick({ password: true })
  .extend({
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    token: z.string().min(1, 'Invalid reset token'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type UpdatePasswordInput = Partial<z.infer<typeof updatePasswordSchema>>;

type UpdatePasswordError = Partial<
  Record<keyof UpdatePasswordInput, string[]>
> & {
  unexpected?: string;
  auth?: string;
};

export type UpdatePasswordResponse = OldActionResponse<
  UpdatePasswordInput,
  UpdatePasswordError
>;

export type ErrorUpdatePasswordResponse = Extract<
  UpdatePasswordResponse,
  { type: 'error' }
>;

export type SuccessUpdatePasswordResponse = Extract<
  UpdatePasswordResponse,
  { type: 'success' }
>;

export async function updatePasswordAction(
  state: UpdatePasswordResponse,
  formData: FormData
): Promise<UpdatePasswordResponse> {
  const req = await request();
  const inputDecision = await ajLaxAnonymous.protect(req, {
    action: 'sa-update-password-input-check',
  });

  if (inputDecision.isDenied()) handleDeniedInServerAction(inputDecision);

  const input = Object.fromEntries(formData.entries());
  const parsedResult = updatePasswordSchema.safeParse(input);

  if (!parsedResult.success)
    return {
      type: 'error',
      payload: {
        userEntered: input,
        errors: z.flattenError(parsedResult.error).fieldErrors,
      },
    };
  const updatePasswordDecision = await ajRestrictiveAnonymous.protect(req, {
    action: 'sa-update-password',
  });

  if (updatePasswordDecision.isDenied())
    handleDeniedInServerAction(inputDecision);

  const { token, password } = parsedResult.data;

  try {
    await auth.api.resetPassword({
      headers: await headers(),
      body: {
        token,
        newPassword: password,
      },
    });
  } catch (error) {
    return {
      type: 'error',
      payload: {
        userEntered: { ...input, password: '', confirmPassword: '' },
        errors: {
          auth:
            error instanceof APIError || error instanceof Error
              ? error.message
              : 'An unexpected error occurred. Please try again.',
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
