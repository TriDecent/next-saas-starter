'use server';

import type { User } from '@/generated/prisma/client';
import { getUserService } from '@/infrastructure/service';
import type { ActionResponse } from '@/shared/types';
import { headers } from 'next/headers';

type DeleteResponse = ActionResponse<undefined, { message: string }>;

export async function deleteUserAction(
  userId: User['id'],
  callbackUrl: string
): Promise<DeleteResponse> {
  const userService = await getUserService(callbackUrl);

  return await userService.deleteUser(userId, await headers());
}
