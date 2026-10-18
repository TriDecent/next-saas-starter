'use server';

import { UpdatePasswordSchema } from '@/features/auth/schema';
import { getAuthService } from '@/infrastructure/composition/factory';
import {
  ajRestrictiveAnonymous,
  handleDeniedInServerAction,
} from '@/lib/arcjet';
import type { ActionState } from '@/shared/components/form/client';
import { request } from '@arcjet/next';

type UpdatePasswordState = ActionState<void, { message: string }>;

export async function updatePasswordAction(
  state: UpdatePasswordState,
  input: unknown
): Promise<UpdatePasswordState> {
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
