'use server';

import type { OrganizationRole } from '@/lib/auth';
import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/security';
import { getOrgService } from '@/services';
import { request } from '@arcjet/next';
import type { Member, Organization } from 'better-auth/plugins';
import { refresh } from 'next/cache';

export async function updateRoleAction(
  params: {
    memberId: Member['id'];
    organizationId: Organization['id'];
    role: OrganizationRole[];
  },
  callbackUrl: string
) {
  const service = await getOrgService(callbackUrl);

  const decision = await ajRestrictiveAuthenticated.protect(await request(), {
    action: 'update-role-action',
    userId: service.actor.id,
  });

  if (decision.isDenied()) handleDeniedInServerAction(decision);

  const response = await service.updateRole(params);

  refresh();

  return response;
}
