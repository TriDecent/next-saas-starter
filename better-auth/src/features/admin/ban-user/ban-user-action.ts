'use server';

import type { User } from '@/generated/prisma/client';
import { getUserService } from '@/infrastructure/service';
import type { ActionResponse } from '@/shared/types';
import { refresh } from 'next/cache';

type BanResponse = ActionResponse<undefined, { message: string }>;

export async function banUserAction(
  userId: User['id'],
  shouldBan: boolean,
  callbackUrl: string
): Promise<BanResponse> {
  const userService = await getUserService(callbackUrl);

  const result = await userService.toggleBanStatus(userId, shouldBan);

  refresh();

  return result;
}
