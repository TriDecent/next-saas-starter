'use server';

import {
  ajExtremeRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/security';
import { getOrgService } from '@/services';
import { request } from '@arcjet/next';
import { refresh } from 'next/cache';

export async function deleteOrgAction(
  organizationId: string,
  callbackUrl: string
) {
  const service = await getOrgService(callbackUrl);

  const decision = await ajExtremeRestrictiveAuthenticated.protect(
    await request(),
    {
      action: 'delete-org-action',
      userId: service.actor.id,
    }
  );

  if (decision.isDenied()) handleDeniedInServerAction(decision);

  const response = await service.deleteOrg(organizationId);

  refresh();

  return response;
}
