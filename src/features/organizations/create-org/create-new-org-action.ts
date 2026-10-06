'use server';

import type { GeneralOrgResponse } from '@/features/organizations/server';
import { getOrgService } from '@/infrastructure/composition/factory';
import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/arcjet';
import { ROUTES } from '@/shared/constants';
import { request } from '@arcjet/next';
import { CreateNewOrgSchema } from './schema';

export type Response = GeneralOrgResponse | { type: 'initial' };
export async function createNewOrg(
  state: Response,
  input: unknown
): Promise<Response> {
  const [service, req] = await Promise.all([
    getOrgService(ROUTES.organizations.href),
    request(),
  ]);

  const parsedResult = CreateNewOrgSchema.safeParse(input);
  if (!parsedResult.success)
    return { type: 'error', payload: { message: 'Invalid input' } };

  const decision = await ajRestrictiveAuthenticated.protect(req, {
    action: 'create-new-org',
    userId: service.actor.id,
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  return service.createOrg(parsedResult.data);
}
