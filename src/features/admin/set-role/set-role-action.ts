'use server';

import type { UserRole } from '@/lib/auth';
import { getUserService } from '@/infrastructure/composition/factory';
import type { GeneralUserResponse } from '@/features/user/server';
import { refresh } from 'next/cache';

export async function setRoleAction(
  params: {
    userId: string;
    roles: UserRole[];
  },
  callbackURL: string
): Promise<GeneralUserResponse> {
  const service = await getUserService(callbackURL);
  const response = await service.setRole(params);
  refresh();

  return response;
}
