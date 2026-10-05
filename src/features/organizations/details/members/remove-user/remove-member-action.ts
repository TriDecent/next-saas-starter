'use server';

import type { RemoveUserInput } from '@/features/organizations/server';
import { getOrgService } from '@/infrastructure/composition/factory';
import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/arcjet';
import { request } from '@arcjet/next';

export async function removeMemberAction(
  params: RemoveUserInput,
  callbackUrl: string
) {
  const service = await getOrgService(callbackUrl);

  const decision = await ajRestrictiveAuthenticated.protect(await request(), {
    action: 'remove-member-action',
    userId: service.actor.id,
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  return service.removeMember(params);
}
