'use server';

import { getOrgService } from '@/infrastructure/composition/factory';
import { ajEmailSend, handleDeniedInServerAction } from '@/lib/arcjet';
import type { ActionState } from '@/shared/components/form/use-action-form';
import { ROUTES } from '@/shared/constants';
import { request } from '@arcjet/next';
import { refresh } from 'next/cache';
import { CreateInvitationSchema } from '../schema';

export type CreateInvitationState = ActionState<void, { message: string }>;

export async function createInvitationAction(
  state: CreateInvitationState,
  input: unknown
): Promise<CreateInvitationState> {
  const service = await getOrgService(ROUTES.invitations.href);

  const parsedResult = CreateInvitationSchema.safeParse(input);
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
