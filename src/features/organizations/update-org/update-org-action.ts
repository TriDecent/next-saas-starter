'use server';

import { getOrgService } from '@/infrastructure/composition/factory';
import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/arcjet';
import type { ActionState } from '@/shared/components/form/client';
import { ROUTES } from '@/shared/constants';
import { request } from '@arcjet/next';
import { OrgSchema } from '../schema';

export type UpdateOrganizationState = ActionState<void, { message: string }>;

export async function updateOrgAction(
  state: UpdateOrganizationState,
  input: unknown
): Promise<UpdateOrganizationState> {
  const service = await getOrgService(ROUTES.organizations.href);

  const parsedResult = OrgSchema.safeParse(input);
  if (!parsedResult.success)
    return { type: 'error', payload: { message: 'Invalid input' } };

  const decision = await ajRestrictiveAuthenticated.protect(await request(), {
    action: 'update-org-action',
    userId: service.actor.id,
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  const safeInput = parsedResult.data;
  const response = await service.updateOrg({
    data: safeInput,
    organizationId: safeInput.id,
  });

  return response;
}
