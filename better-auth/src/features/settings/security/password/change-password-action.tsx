'use server';

import { getUserService } from '@/infrastructure/service';
import type { GeneralUserResponse } from '@/infrastructure/service/user';
import { ensureSession } from '@/lib/auth';
import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/security';
import { COOKIES, ROUTES } from '@/shared/constants';
import { changePasswordSchema } from '@/shared/schema';
import { request } from '@arcjet/next';
import { cookies, headers } from 'next/headers';

type ChangePasswordResponse = GeneralUserResponse | { type: 'initial' };

export async function changePasswordAction(
  state: ChangePasswordResponse,
  input: unknown
): Promise<ChangePasswordResponse> {
  const [headersList, cookiesList, reqList] = await Promise.all([
    headers(),
    cookies(),
    request(),
  ]);
  const session = await ensureSession(
    headersList,
    ROUTES.settings.nested.security.href
  );

  const parsedResult = changePasswordSchema.safeParse(input);

  if (!parsedResult.success)
    return { type: 'error', payload: { message: 'Invalid input data' } };

  const changePasswordDecision = await ajRestrictiveAuthenticated.protect(
    reqList,
    {
      action: 'sa-update-password',
      userId: session.user.id,
    }
  );

  if (changePasswordDecision.isDenied())
    handleDeniedInServerAction(changePasswordDecision);

  const service = await getUserService(ROUTES.settings.nested.security.href);
  const sudoToken = cookiesList.get(COOKIES['sudo-token'].name)?.value;

  return service.changePassword(parsedResult.data, sudoToken);
}
