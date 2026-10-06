'use server';

import { ChangePasswordSchema } from '@/features/auth/schema';
import type { GeneralUserResponse } from '@/features/user/server';
import { getUserService } from '@/infrastructure/composition/factory';
import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/arcjet';
import { COOKIES, ROUTES } from '@/shared/constants';
import { request } from '@arcjet/next';
import { cookies } from 'next/headers';

type ChangePasswordResponse = GeneralUserResponse | { type: 'initial' };

export async function changePasswordAction(
  state: ChangePasswordResponse,
  input: unknown
): Promise<ChangePasswordResponse> {
  const [cookiesList, reqList] = await Promise.all([cookies(), request()]);
  const service = await getUserService(ROUTES.settings.nested.security.href);

  const parsedResult = ChangePasswordSchema.safeParse(input);

  if (!parsedResult.success)
    return { type: 'error', payload: { message: 'Invalid input data' } };

  const changePasswordDecision = await ajRestrictiveAuthenticated.protect(
    reqList,
    {
      action: 'sa-update-password',
      userId: service.actor.id,
    }
  );

  if (changePasswordDecision.isDenied())
    handleDeniedInServerAction(changePasswordDecision);

  const sudoToken = cookiesList.get(COOKIES['sudo-token'].name)?.value;

  return service.changePassword(parsedResult.data, sudoToken);
}
