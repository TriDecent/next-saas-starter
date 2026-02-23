'use server';

import type { User } from '@/generated/prisma/client';
import { getUserService } from '@/services';
import type { GeneralUserResponse } from '@/services/user';

export async function revokeUserSessionsAction(
  userId: User['id'],
  callbackUrl: string
): Promise<GeneralUserResponse> {
  const userService = await getUserService(callbackUrl);

  return await userService.revokeUser(userId);
}
