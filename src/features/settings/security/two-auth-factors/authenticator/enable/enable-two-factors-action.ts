'use server';

import type { Enable2FAResponse } from '@/features/user/server';
import { getUserService } from '@/infrastructure/composition/factory';
import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/arcjet';
import { COOKIES, ROUTES } from '@/shared/constants';
import { request } from '@arcjet/next';
import { cookies } from 'next/headers';

export async function enableTwoFactorsAction(
  password: string
): Promise<Enable2FAResponse> {
  const [req, cookiesList] = await Promise.all([request(), cookies()]);
  const service = await getUserService(ROUTES.settings.nested.security.href);

  const decision = await ajRestrictiveAuthenticated.protect(req, {
    action: 'enable-2fa',
    userId: service.actor.id,
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  const sudoTokenCookie = cookiesList.get(COOKIES['sudo-token'].name);

  return service.enable2FA(password, sudoTokenCookie?.value);
}
