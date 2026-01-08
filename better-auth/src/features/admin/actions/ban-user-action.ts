'use server';

import type { User } from '@/generated/prisma/client';
import { prisma } from '@/lib';
import { auth, ensureSession } from '@/lib/auth';
import { defineAbilityFor } from '@/lib/casl';
import { ROUTES } from '@/shared/constants';
import type { ActionResponse } from '@/shared/types';
import { APIError } from 'better-auth';
import { refresh } from 'next/cache';
import { headers } from 'next/headers';

type BanResponse = ActionResponse<undefined, { message: string }>;

export async function banUserAction(
  userId: User['id'],
  shouldBan: boolean
): Promise<BanResponse> {
  const headersList = await headers();
  const session = await ensureSession(headersList, ROUTES.admin.href);

  const targetUser = await prisma.user.findFirst({ where: { id: userId } });
  if (!targetUser)
    return { type: 'error', payload: { message: 'User not found' } };

  const ability = defineAbilityFor(session.user);
  if (!ability.can('ban-user', { ...targetUser, kind: 'User' }))
    return {
      type: 'error',
      payload: {
        message: 'You do not have permission to ban/unban this user.',
      },
    };

  try {
    if (shouldBan) {
      await auth.api.banUser({ body: { userId }, headers: headersList });
    } else {
      await auth.api.unbanUser({ body: { userId }, headers: headersList });
    }

    refresh();

    return { type: 'success', payload: undefined };
  } catch (error) {
    return {
      type: 'error',
      payload: {
        message:
          error instanceof APIError || error instanceof Error
            ? error.message
            : 'Unknown error',
      },
    };
  }
}
