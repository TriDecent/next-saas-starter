'use server';

import { getUserService } from '@/infrastructure/service';
import type { GenerateBackUpCodesResponse } from '@/infrastructure/service/user';
import { ensureSession } from '@/lib/auth';
import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/security';
import { ROUTES } from '@/shared/constants';
import { twoFAAuthSchema } from '@/shared/schema';
import { request } from '@arcjet/next';
import { headers } from 'next/headers';

type Response = GenerateBackUpCodesResponse | { type: 'initial' };

export async function generateBackupCodesAction(
  state: Response,
  input: unknown
): Promise<Response> {
  const [headersList, req] = await Promise.all([headers(), request()]);

  const session = await ensureSession(
    headersList,
    ROUTES.settings.nested.security.href
  );

  const parsedInput = twoFAAuthSchema.safeParse(input);
  if (!parsedInput.success)
    return { type: 'error', payload: { message: 'Invalid input' } };

  const decision = await ajRestrictiveAuthenticated.protect(req, {
    action: 'generate-backup-codes',
    userId: session.user.id,
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  const service = await getUserService(ROUTES.settings.nested.security.href);

  return service.generateBackUpCodes({
    ...parsedInput.data,
    totpCode: parsedInput.data.code,
  });
}
