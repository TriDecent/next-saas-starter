'use server';

import { getOrgService } from '@/infrastructure/service';
import type { GeneralOrgResponse } from '@/infrastructure/service/organization';
import { ajEmailSend, handleDeniedInServerAction } from '@/lib/security';
import { ROUTES } from '@/shared/constants';
import { request } from '@arcjet/next';
import { createInvitationSchema } from './schema';

export type CreateInvitationResponse = GeneralOrgResponse | { type: 'initial' };
export async function createInvitationAction(
  state: CreateInvitationResponse,
  input: unknown
): Promise<CreateInvitationResponse> {
  const service = await getOrgService(ROUTES.invitations.href);

  const parsedResult = createInvitationSchema.safeParse(input);
  if (!parsedResult.success)
    return { type: 'error', payload: { message: 'Invalid input data' } };

  const decision = await ajEmailSend.protect(await request(), {
    action: 'create-invitation',
    emailId: `${parsedResult.data.email}`,
    requested: 1,
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  return service.createInvitation(parsedResult.data);
}
