'use server';

import { BackupCodeSchema } from '@/features/auth/schema';
import { getAuthService } from '@/infrastructure/composition/factory';
import {
  ajRestrictiveAnonymous,
  handleDeniedInServerAction,
} from '@/lib/arcjet';
import type { ActionState } from '@/shared/components/form/client';
import { request } from '@arcjet/next';

type VerifyBackupCodesState = ActionState<void, { message: string }>;

export async function verifyBackupCodesAction(
  state: VerifyBackupCodesState,
  input: unknown
): Promise<VerifyBackupCodesState> {
  const parsedInput = BackupCodeSchema.safeParse(input);
  if (!parsedInput.success)
    return { type: 'error', payload: { message: 'Invalid input' } };

  const req = await request();

  const decision = await ajRestrictiveAnonymous.protect(req, {
    action: 'verify-backup-codes',
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  const service = await getAuthService();

  return service.verifyBackupCode(
    parsedInput.data.code,
    parsedInput.data.trustDevice
  );
}
