'use server';

import { getUserService } from '@/infrastructure/service';
import { ensureSession } from '@/lib/auth';
import {
  ajExtremeRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/security';
import { ROUTES } from '@/shared/constants';
import { request } from '@arcjet/next';
import { refresh } from 'next/cache';
import { headers } from 'next/headers';

export async function deleteAccountAction(token?: string) {
  const [req, headersList] = await Promise.all([request(), headers()]);
  const session = await ensureSession(
    headersList,
    ROUTES.settings.nested.danger.href
  );

  const decision = await ajExtremeRestrictiveAuthenticated.protect(req, {
    userId: session.user.id,
    action: token ? 'delete-account' : 'send-delete-verification-email',
  });

  if (decision.isDenied()) handleDeniedInServerAction(decision);

  const service = await getUserService(ROUTES.settings.nested.danger.href);

  await service.deleteAccount(token);

  refresh();
}
