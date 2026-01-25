'use server';

import type { User } from '@/generated/prisma/client';
import { getUserService } from '@/infrastructure/service';
import type { ActionResponse } from '@/shared/types';

type BanResponse = ActionResponse<undefined, { message: string }>;

export async function revokeUserSessionsAction(
  userId: User['id'],
  callbackUrl: string
): Promise<BanResponse> {
  const userService = await getUserService(callbackUrl);

  return await userService.revokeUser(userId);
}
