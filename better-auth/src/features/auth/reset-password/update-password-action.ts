'use server';

import { auth } from '@/lib/auth';
import {
  ajRestrictiveAnonymous,
  handleDeniedInServerAction,
} from '@/lib/security';
import { updatePasswordSchema } from '@/shared/schema';
import type { ActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';

type UpdatePasswordResponse = ActionResponse<undefined, { message: string }>;

export async function updatePasswordAction(
  state: UpdatePasswordResponse,
  input: unknown
): Promise<UpdatePasswordResponse> {
  const parsedResult = updatePasswordSchema.safeParse(input);

  if (!parsedResult.success)
    return {
      type: 'error',
      payload: { message: 'Invalid input. Please check your data.' },
    };

  const updatePasswordDecision = await ajRestrictiveAnonymous.protect(
    await request(),
    { action: 'sa-update-password' }
  );

  if (updatePasswordDecision.isDenied())
    handleDeniedInServerAction(updatePasswordDecision);

  const { token, password } = parsedResult.data;

  try {
    await auth.api.resetPassword({
      headers: await headers(),
      body: { token, newPassword: password },
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
