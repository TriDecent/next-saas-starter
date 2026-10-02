'use server';

import {
  ajEmailSend,
  ajLaxAuthenticated,
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/arcjet';
import { getUserService, type GeneralUserResponse } from '@/services';
import { request } from '@arcjet/next';
import z from 'zod';

type ChangeEmailParams = {
  newEmail: string;
};

type ChangeEmailState = GeneralUserResponse | { type: 'initial' };

export async function changeEmailFormAction(
  callbackURL: string,
  state: ChangeEmailState,
  input: unknown
): Promise<ChangeEmailState> {
  const [req, service] = await Promise.all([
    request(),
    getUserService(callbackURL),
  ]);

  const decision = await ajLaxAuthenticated.protect(req, {
    action: ' change-email',
    userId: service.actor.id,
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  const parsed = z.object({ newEmail: z.email() }).safeParse(input);
  if (!parsed.success)
    return { type: 'error', payload: { message: 'Invalid email address' } };

  const { newEmail } = parsed.data;

  const emailSendDecision = await ajEmailSend.protect(req, {
    action: `change-email-${newEmail}`,
    emailId: newEmail,
    requested: 1,
  });
  if (emailSendDecision.isDenied())
    handleDeniedInServerAction(emailSendDecision);

  return changeEmailAction({ newEmail }, callbackURL);
}

export async function changeEmailAction(
  { newEmail }: ChangeEmailParams,
  callbackURL: string
): Promise<GeneralUserResponse> {
  const service = await getUserService(callbackURL);

  const req = await request();
  const inputDecision = await ajRestrictiveAuthenticated.protect(req, {
    action: 'sa-change-email',
    userId: service.actor.id,
  });
  if (inputDecision.isDenied()) handleDeniedInServerAction(inputDecision);

  return service.changeEmail({ newEmail, callbackURL });
}
