'use server';

import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/security';
import { getOrgService } from '@/services';
import type { GeneralOrgResponse } from '@/services/organization';
import { request } from '@arcjet/next';
import { refresh } from 'next/cache';

export async function handleInvitationApprovalAction(
  id: string,
  mode: 'accept' | 'reject',
  callbackUrl: string
) {
  const service = await getOrgService(callbackUrl);

  const decision = await ajRestrictiveAuthenticated.protect(await request(), {
    userId: service.actor.id,
    action: `process-invitation-${id}-approval`,
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  let response: GeneralOrgResponse | null = null;
  if (mode === 'accept') {
    response = await service.acceptInvitation(id);
  } else if (mode === 'reject') {
    response = await service.rejectInvitation(id);
  }

  refresh();
  return response as GeneralOrgResponse;
}
