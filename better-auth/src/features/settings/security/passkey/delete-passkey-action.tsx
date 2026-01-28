'use server';

import { getUserService } from '@/infrastructure/service';
import type { GeneralUserResponse } from '@/infrastructure/service/user';
import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/security';
import { COOKIES, ROUTES } from '@/shared/constants';
import { request } from '@arcjet/next';
import { refresh } from 'next/cache';
import { cookies } from 'next/headers';

export async function deletePasskeyAction(
  passkeyId: string
): Promise<GeneralUserResponse> {
  const [req, cookiesList] = await Promise.all([request(), cookies()]);

  const sudoToken = cookiesList.get(COOKIES['sudo-token'].name);
  const service = await getUserService(ROUTES.settings.nested.security.href);

  const decision = await ajRestrictiveAuthenticated.protect(req, {
    action: 'disable-2fa',
    userId: service.self.id,
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  const response = await service.deletePasskey(passkeyId, sudoToken?.value);

  refresh();

  return response;
}
