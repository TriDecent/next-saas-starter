'use server';

import { getOrgService } from '@/infrastructure/service';
import type { GeneralOrgResponse } from '@/infrastructure/service/organization';
import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/security';
import { ROUTES } from '@/shared/constants';
import { request } from '@arcjet/next';
import { createNewOrgSchema } from './schema';

export type Response = GeneralOrgResponse | { type: 'initial' };
export async function createNewOrg(
  state: Response,
  input: unknown
): Promise<Response> {
  const [service, req] = await Promise.all([
    getOrgService(ROUTES.organization.href),
    request(),
  ]);

  const parsedResult = createNewOrgSchema.safeParse(input);
  if (!parsedResult.success)
    return { type: 'error', payload: { message: 'Invalid input' } };

  const decision = await ajRestrictiveAuthenticated.protect(req, {
    action: 'create-new-org',
    userId: service.actor.id,
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  return service.createOrg(parsedResult.data);
}
