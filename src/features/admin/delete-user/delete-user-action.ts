'use server';

import type { GeneralUserResponse } from '@/features/user/server';
import type { User } from '@/generated/prisma/client';
import { getUserService } from '@/infrastructure/composition/factory';

export async function deleteUserAction(
  userId: User['id'],
  callbackUrl: string
): Promise<GeneralUserResponse> {
  const userService = await getUserService(callbackUrl);

  return await userService.deleteUser(userId);
}
