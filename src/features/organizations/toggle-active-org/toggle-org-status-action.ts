'use server';

import type {
  GeneralOrgResponse,
  SetActiveOrgInput,
} from '@/features/organizations/server';
import { getOrgService } from '@/infrastructure/composition/factory';
import { ajLaxAuthenticated, handleDeniedInServerAction } from '@/lib/arcjet';
import { request } from '@arcjet/next';

export async function toggleOrgStatus(
  input: SetActiveOrgInput,
  callbackUrl: string
): Promise<GeneralOrgResponse> {
  const service = await getOrgService(callbackUrl);

  const decision = await ajLaxAuthenticated.protect(await request(), {
    userId: service.actor.id,
    action: 'toggle-org-status-action',
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  return service.toggleOrgStatus(input);
}
