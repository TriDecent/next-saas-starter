'use server';

import { ajLaxAuthenticated, handleDeniedInServerAction } from '@/lib/arcjet';
import {
  getOrgService,
  type GeneralOrgResponse,
  type SetActiveOrgInput,
} from '@/services';
import { request } from '@arcjet/next';

export async function SetActiveOrgAction(
  input: SetActiveOrgInput,
  callbackUrl: string
): Promise<GeneralOrgResponse> {
  const service = await getOrgService(callbackUrl);

  const decision = await ajLaxAuthenticated.protect(await request(), {
    userId: service.actor.id,
    action: 'set-active-action',
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  return service.setActiveOrg(input);
}
