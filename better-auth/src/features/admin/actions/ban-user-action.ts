'use server';

import type { User } from '@/generated/prisma/client';
import { getUserService } from '@/infrastructure/service';
import type { ActionResponse } from '@/shared/types';
import { refresh } from 'next/cache';
import { headers } from 'next/headers';

type BanResponse = ActionResponse<undefined, { message: string }>;

export async function banUserAction(
  userId: User['id'],
  shouldBan: boolean,
  callbackUrl: string
): Promise<BanResponse> {
  const [userService, headersList] = await Promise.all([
    getUserService(callbackUrl),
    headers(),
  ]);
  const result = await userService.toggleBanStatus(
    userId,
    shouldBan,
    headersList
  );

  refresh();

  return result;
}
