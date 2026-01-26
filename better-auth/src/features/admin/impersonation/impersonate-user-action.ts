'use server';

import type { User } from '@/generated/prisma/client';
import { getUserService } from '@/infrastructure/service';
import type { ActionResponse } from '@/shared/types';

type DeleteResponse = ActionResponse<undefined, { message: string }>;

export async function impersonateUserAction(
  userId: User['id'],
  callbackUrl: string
): Promise<DeleteResponse> {
  const userService = await getUserService(callbackUrl);

  const response = await userService.impersonateUser(userId);

  return response;
}
