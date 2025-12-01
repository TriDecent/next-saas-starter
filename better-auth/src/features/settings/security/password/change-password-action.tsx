'use server';

import {
  ajLaxAnonymous,
  ajRestrictiveAuthenticated,
  ensureSession,
  handleDeniedInServerAction,
} from '@/lib';
import { auth } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import type { OldActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';
import z from 'zod';

const changePasswordSchema = z
  .object({
    newPassword: z.string().min(6),
    currentPassword: z.string(),
    confirmPassword: z.string(),
    revokeOtherSessions: z.coerce.boolean().optional(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ChangePasswordInput = Partial<z.infer<typeof changePasswordSchema>>;

type ChangePasswordError = Partial<
  Record<keyof ChangePasswordInput, string[]>
> & {
  unexpected?: string;
  auth?: { status: APIError['status']; message: string };
};

export type ChangePasswordResponse = OldActionResponse<
  ChangePasswordInput,
  ChangePasswordError
>;

export type ErrorChangePasswordResponse = Extract<
  ChangePasswordResponse,
  { type: 'error' }
>;

export type SuccessChangePasswordResponse = Extract<
  ChangePasswordResponse,
  { type: 'success' }
>;

export async function changePasswordAction(
  state: ChangePasswordResponse,
  formData: FormData
): Promise<ChangePasswordResponse> {
  const headersList = await headers();
  const session = await ensureSession(
    headersList,
    ROUTES.settings.nested.security.href
  );

  const req = await request();
  const inputDecision = await ajLaxAnonymous.protect(req, {
    action: 'sa-change-password-input-check',
  });

  if (inputDecision.isDenied()) handleDeniedInServerAction(inputDecision);

  const input = Object.fromEntries(formData.entries());
  const parsedResult = changePasswordSchema.safeParse(input);

  if (!parsedResult.success)
    return {
      type: 'error',
      payload: {
        userEntered: input,
        errors: z.flattenError(parsedResult.error).fieldErrors,
      },
    };

  const changePasswordDecision = await ajRestrictiveAuthenticated.protect(req, {
    action: 'sa-update-password',
    userId: session.user.id,
  });

  if (changePasswordDecision.isDenied())
    handleDeniedInServerAction(inputDecision);

  const { newPassword, currentPassword, revokeOtherSessions } =
    parsedResult.data;

  try {
    await auth.api.changePassword({
      body: { currentPassword, newPassword, revokeOtherSessions },
      headers: headersList,
    });
  } catch (error) {
    return {
      type: 'error',
      payload: {
        userEntered: parsedResult.data,
        errors:
          error instanceof APIError
            ? { auth: { status: error.status, message: error.message } }
            : error instanceof Error
              ? { unexpected: error.message }
              : { unexpected: 'Unknown error' },
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
