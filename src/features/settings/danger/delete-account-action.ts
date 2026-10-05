'use server';

import { getUserService } from '@/infrastructure/composition/factory';
import {
  ajExtremeRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/arcjet';
import { ROUTES } from '@/shared/constants';
import { request } from '@arcjet/next';
import { refresh } from 'next/cache';

export async function deleteAccountAction(token?: string) {
  const service = await getUserService(ROUTES.settings.nested.danger.href);

  const decision = await ajExtremeRestrictiveAuthenticated.protect(
    await request(),
    {
      userId: service.actor.id,
      action: token ? 'delete-account' : 'send-delete-verification-email',
    }
  );

  if (decision.isDenied()) handleDeniedInServerAction(decision);

  await service.deleteAccount(token);

  refresh();
}
