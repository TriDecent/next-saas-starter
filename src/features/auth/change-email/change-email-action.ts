'use server';

import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/arcjet';
import { getUserService, type GeneralAuthResponse } from '@/services';
import { request } from '@arcjet/next';

type ChangeEmailParams = {
  newEmail: string;
};

export async function changeEmailAction(
  { newEmail }: ChangeEmailParams,
  callbackURL: string
): Promise<GeneralAuthResponse> {
  const service = await getUserService(callbackURL);

  const req = await request();
  const inputDecision = await ajRestrictiveAuthenticated.protect(req, {
    action: 'sa-change-email',
    userId: service.actor.id,
  });
  if (inputDecision.isDenied()) handleDeniedInServerAction(inputDecision);

  return service.changeEmail({ newEmail, callbackURL });
}
