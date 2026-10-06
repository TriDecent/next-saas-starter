'use server';

import { UpdatePasswordSchema } from '@/features/auth/schema';
import type { GeneralAuthResponse } from '@/features/auth/server';
import { getAuthService } from '@/infrastructure/composition/factory';
import {
  ajRestrictiveAnonymous,
  handleDeniedInServerAction,
} from '@/lib/arcjet';
import { request } from '@arcjet/next';

type UpdatePasswordResponse = GeneralAuthResponse | { type: 'initial' };

export async function updatePasswordAction(
  state: UpdatePasswordResponse,
  input: unknown
): Promise<UpdatePasswordResponse> {
  const parsedResult = UpdatePasswordSchema.safeParse(input);

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

  const service = await getAuthService();

  return service.resetPassword(token, password);
}
