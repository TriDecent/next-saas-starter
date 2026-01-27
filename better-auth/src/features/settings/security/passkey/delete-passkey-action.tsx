'use server';

import { getUserService } from '@/infrastructure/service';
import type { GeneralUserResponse } from '@/infrastructure/service/user';
import { ensureSession } from '@/lib/auth';
import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/security';
import { COOKIES, ROUTES } from '@/shared/constants';
import { request } from '@arcjet/next';
import { refresh } from 'next/cache';
import { cookies, headers } from 'next/headers';

export async function deletePasskeyAction(
  passkeyId: string
): Promise<GeneralUserResponse> {
  const [headersList, req, cookiesList] = await Promise.all([
    headers(),
    request(),
    cookies(),
  ]);

  const sudoToken = cookiesList.get(COOKIES['sudo-token'].name);

  const session = await ensureSession(
    headersList,
    ROUTES.settings.nested.security.href
  );

  const decision = await ajRestrictiveAuthenticated.protect(req, {
    action: 'disable-2fa',
    userId: session.user.id,
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  const service = await getUserService(ROUTES.settings.nested.security.href);

  const response = await service.deletePasskey(passkeyId, sudoToken?.value);

  refresh();

  return response;
}
