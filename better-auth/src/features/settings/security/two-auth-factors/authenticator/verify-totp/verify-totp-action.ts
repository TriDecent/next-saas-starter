'use server';

import { getAuthService } from '@/infrastructure/service';
import type { GeneralUserResponse } from '@/infrastructure/service/user';
import {
  ajRestrictiveAnonymous,
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/security';
import { totpAuthSchema } from '@/shared/schema';
import { request } from '@arcjet/next';

type Response = GeneralUserResponse | { type: 'initial' };

export async function verifyTotpAction(
  state: Response,
  input: unknown
): Promise<Response> {
  const parsedInput = totpAuthSchema.safeParse(input);
  if (!parsedInput.success)
    return { type: 'error', payload: { message: 'Invalid input' } };

  const [service, req] = await Promise.all([getAuthService(), request()]);

  const decision = service.self
    ? await ajRestrictiveAuthenticated.protect(req, {
        action: 'verify-totp',
        userId: service.self.id,
      })
    : await ajRestrictiveAnonymous.protect(req, { action: 'verify-totp' });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  return service.verifyTOTP(parsedInput.data);
}
