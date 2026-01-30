'use server';

import { getUserService } from '@/infrastructure/service';
import type { GeneralUserResponse } from '@/infrastructure/service/user';
import type { UserRole } from '@/lib/auth';
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
