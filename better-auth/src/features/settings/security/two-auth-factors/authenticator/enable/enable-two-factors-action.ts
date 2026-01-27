'use server';

import { getUserService } from '@/infrastructure/service';
import type { Enable2FAResponse } from '@/infrastructure/service/user';
import { ensureSession } from '@/lib/auth';
import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/security';
import { COOKIES, ROUTES } from '@/shared/constants';
import { request } from '@arcjet/next';
import { cookies, headers } from 'next/headers';

export async function enableTwoFactorsAction(
  password: string
): Promise<Enable2FAResponse> {
  const [headersList, req, cookiesList] = await Promise.all([
    headers(),
    request(),
    cookies(),
  ]);

  const session = await ensureSession(
    headersList,
    ROUTES.settings.nested.security.href
  );

  const decision = await ajRestrictiveAuthenticated.protect(req, {
    action: 'enable-2fa',
    userId: session.user.id,
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  const service = await getUserService(ROUTES.settings.nested.security.href);
  const sudoTokenCookie = cookiesList.get(COOKIES['sudo-token'].name);

  return service.enable2FA(password, sudoTokenCookie?.value);
}
