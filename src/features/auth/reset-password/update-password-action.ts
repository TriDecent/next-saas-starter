'use server';

import {
  ajRestrictiveAnonymous,
  handleDeniedInServerAction,
} from '@/lib/arcjet';
import { getAuthService } from '@/services';
import type { GeneralAuthResponse } from '@/services/auth';
import { updatePasswordSchema } from '@/shared/schema';
import { request } from '@arcjet/next';

type UpdatePasswordResponse = GeneralAuthResponse | { type: 'initial' };

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

  const service = await getAuthService();

  return service.resetPassword(token, password);
}
