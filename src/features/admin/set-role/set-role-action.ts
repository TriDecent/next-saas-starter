'use server';

import type { AppRole } from '@/features/authorization';
import type { UserMutationResult } from '@/features/user/server';
import { getUserService } from '@/infrastructure/composition/factory';
import { refresh } from 'next/cache';

export async function setRoleAction(
  params: {
    userId: string;
    roles: AppRole[];
  },
  callbackURL: string
): Promise<UserMutationResult> {
  const service = await getUserService(callbackURL);
  const response = await service.setRole(params);
  refresh();

  return response;
}
