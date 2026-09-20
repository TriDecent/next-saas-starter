'use server';

import type { User } from '@/generated/prisma/client';
import { getUserService } from '@/services';
import type { GeneralUserResponse } from '@/services/user';

export async function impersonateUserAction(
  userId: User['id'],
  callbackUrl: string
): Promise<GeneralUserResponse> {
  const userService = await getUserService(callbackUrl);

  const response = await userService.impersonateUser(userId);

  return response;
}
