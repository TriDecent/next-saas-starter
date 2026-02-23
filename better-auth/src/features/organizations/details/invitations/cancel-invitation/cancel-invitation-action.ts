'use server';

import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/security';
import { getOrgService } from '@/services';
import { request } from '@arcjet/next';
import type { Invitation } from 'better-auth/plugins';
import { refresh } from 'next/cache';

export async function cancelInvitationAction(
  invitationId: Invitation['id'],
  callbackUrl: string
) {
  const service = await getOrgService(callbackUrl);

  const decision = await ajRestrictiveAuthenticated.protect(await request(), {
    action: 'cancel-invitation-action',
    userId: service.actor.id,
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  const response = await service.cancelInvitation(invitationId);

  refresh();

  return response;
}
