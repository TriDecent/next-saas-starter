'use server';

import type { UserMutationResult } from '@/features/user/server';
import type { User } from '@/generated/prisma/client';
import { getUserService } from '@/infrastructure/composition/factory';
import { refresh } from 'next/cache';

export async function banUserAction(
  userId: User['id'],
  shouldBan: boolean,
  callbackUrl: string
): Promise<UserMutationResult> {
  const userService = await getUserService(callbackUrl);

  const result = await userService.toggleBanStatus(userId, shouldBan);

  refresh();

  return result;
}
