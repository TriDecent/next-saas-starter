'use server';

import type { GeneralOrgResponse } from '@/features/organizations/server';
import { getOrgService } from '@/infrastructure/composition/factory';
import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/arcjet';
import { ROUTES } from '@/shared/constants';
import { request } from '@arcjet/next';
import { orgSchema } from '../_shared';

export type Response = GeneralOrgResponse | { type: 'initial' };

export async function updateOrgAction(
  state: Response,
  input: unknown
): Promise<Response> {
  const service = await getOrgService(ROUTES.organizations.href);

  const parsedResult = orgSchema.safeParse(input);
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
