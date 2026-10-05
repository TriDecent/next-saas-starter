'use server';

import type { GeneralOrgResponse } from '@/features/organizations/server';
import { getOrgService } from '@/infrastructure/composition/factory';
import { ajEmailSend, handleDeniedInServerAction } from '@/lib/arcjet';
import { ROUTES } from '@/shared/constants';
import { request } from '@arcjet/next';
import { refresh } from 'next/cache';
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

  const response = await service.createInvitation(parsedResult.data);

  refresh();

  return response;
}
