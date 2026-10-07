'use server';

import type { AppRole } from '@/features/authorization';
import type { GeneralUserResponse } from '@/features/user/server';
import { getUserService } from '@/infrastructure/composition/factory';
import { refresh } from 'next/cache';

export async function setRoleAction(
  params: {
    userId: string;
    roles: AppRole[];
  },
  callbackURL: string
): Promise<GeneralUserResponse> {
  const service = await getUserService(callbackURL);
  const response = await service.setRole(params);
  refresh();

  return response;
}
