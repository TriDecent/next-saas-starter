'use server';

import type { User } from '@/generated/prisma/client';
import { auth, ensureSession } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import type { ActionResponse } from '@/shared/types';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';

type BanResponse = ActionResponse<undefined, { message: string }>;

export async function revokeUserSessionsAction(
  userId: User['id']
): Promise<BanResponse> {
  const headersList = await headers();
  await ensureSession(headersList, ROUTES.admin.href);

  try {
    await auth.api.revokeUserSessions({
      body: { userId },
      headers: headersList,
    });

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
