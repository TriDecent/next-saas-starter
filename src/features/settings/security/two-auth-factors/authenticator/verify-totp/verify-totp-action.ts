'use server';

import { TotpAuthSchema } from '@/features/auth/schema';
import { getAuthService } from '@/infrastructure/composition/factory';
import {
  ajRestrictiveAnonymous,
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/arcjet';
import type { ActionState } from '@/shared/components/form/client';
import { request } from '@arcjet/next';

type VerifyTotpState = ActionState<void, { message: string }>;

export async function verifyTotpAction(
  state: VerifyTotpState,
  input: unknown
): Promise<VerifyTotpState> {
  const parsedInput = TotpAuthSchema.safeParse(input);
  if (!parsedInput.success)
    return { type: 'error', payload: { message: 'Invalid input' } };

  const [service, req] = await Promise.all([getAuthService(), request()]);

  const decision = service.actor
    ? await ajRestrictiveAuthenticated.protect(req, {
        action: 'verify-totp',
        userId: service.actor.id,
      })
    : await ajRestrictiveAnonymous.protect(req, { action: 'verify-totp' });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  return service.verifyTOTP(parsedInput.data);
}
