'use server';

import { getUserService } from '@/infrastructure/service';
import type { GeneralUserResponse } from '@/infrastructure/service/user';
import { auth } from '@/lib/auth';
import {
  ajRestrictiveAnonymous,
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/security';
import { ROUTES } from '@/shared/constants';
import { totpAuthSchema } from '@/shared/schema';
import { request } from '@arcjet/next';
import { headers } from 'next/headers';

type Response = GeneralUserResponse | { type: 'initial' };

export async function verifyTotpAction(
  state: Response,
  input: unknown
): Promise<Response> {
  const parsedInput = totpAuthSchema.safeParse(input);
  if (!parsedInput.success)
    return { type: 'error', payload: { message: 'Invalid input' } };

  const [headersList, req] = await Promise.all([headers(), request()]);

  const session = await auth.api.getSession({ headers: headersList });

  const decision = session
    ? await ajRestrictiveAuthenticated.protect(req, {
        action: 'verify-totp',
        userId: session.user.id,
      })
    : await ajRestrictiveAnonymous.protect(req, { action: 'verify-totp' });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  const service = await getUserService(ROUTES.settings.nested.security.href);

  return service.verifyTOTP(parsedInput.data);
}
