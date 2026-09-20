'use server';

import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/arcjet';
import { getUserService } from '@/services';
import type { GenerateBackUpCodesResponse } from '@/services/user';
import { ROUTES } from '@/shared/constants';
import { twoFAAuthSchema } from '@/shared/schema';
import { request } from '@arcjet/next';

type Response = GenerateBackUpCodesResponse | { type: 'initial' };

export async function generateBackupCodesAction(
  state: Response,
  input: unknown
): Promise<Response> {
  const [service, req] = await Promise.all([
    getUserService(ROUTES.settings.nested.security.href),
    request(),
  ]);

  const parsedInput = twoFAAuthSchema.safeParse(input);
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
