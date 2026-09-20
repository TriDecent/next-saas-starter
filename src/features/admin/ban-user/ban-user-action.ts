'use server';

import type { User } from '@/generated/prisma/client';
import { getUserService } from '@/services';
import type { GeneralUserResponse } from '@/services/user';
import { refresh } from 'next/cache';

export async function banUserAction(
  userId: User['id'],
  shouldBan: boolean,
  callbackUrl: string
): Promise<GeneralUserResponse> {
  const userService = await getUserService(callbackUrl);

  const result = await userService.toggleBanStatus(userId, shouldBan);

  refresh();

  return result;
}
