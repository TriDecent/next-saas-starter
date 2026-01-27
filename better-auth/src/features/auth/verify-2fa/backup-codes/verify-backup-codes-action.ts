'use server';

import { getAuthService } from '@/infrastructure/service';
import type { GeneralAuthResponse } from '@/infrastructure/service/auth';
import {
  ajRestrictiveAnonymous,
  handleDeniedInServerAction,
} from '@/lib/security';
import { backupCodeSchema } from '@/shared/schema';
import { request } from '@arcjet/next';

type Response = GeneralAuthResponse | { type: 'initial' };

export async function verifyBackupCodesAction(
  state: Response,
  input: unknown
): Promise<Response> {
  const parsedInput = backupCodeSchema.safeParse(input);
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
