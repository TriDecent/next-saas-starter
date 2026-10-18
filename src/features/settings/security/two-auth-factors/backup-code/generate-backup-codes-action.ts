'use server';

import { TwoFAAuthSchema } from '@/features/auth/schema';
import type { GenerateBackUpCodesResult } from '@/features/user/server';
import { getUserService } from '@/infrastructure/composition/factory';
import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/arcjet';
import type { ActionState } from '@/shared/components/form/client';
import { ROUTES } from '@/shared/constants';
import { request } from '@arcjet/next';

type GenerateBackupCodesState = ActionState<
  Extract<GenerateBackUpCodesResult, { type: 'success' }>['payload'],
  Extract<GenerateBackUpCodesResult, { type: 'error' }>['payload']
>;

export async function generateBackupCodesAction(
  state: GenerateBackupCodesState,
  input: unknown
): Promise<GenerateBackupCodesState> {
  const [service, req] = await Promise.all([
    getUserService(ROUTES.settings.nested.security.href),
    request(),
  ]);

  const parsedInput = TwoFAAuthSchema.safeParse(input);
  if (!parsedInput.success)
    return { type: 'error', payload: { message: 'Invalid input' } };

  const decision = await ajRestrictiveAuthenticated.protect(req, {
    action: 'generate-backup-codes',
    userId: service.actor.id,
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  return service.generateBackUpCodes({
    ...parsedInput.data,
    totpCode: parsedInput.data.code,
  });
}
