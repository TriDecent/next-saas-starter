'use server';

import { getUserService } from '@/infrastructure/service';
import { COOKIES } from '@/shared/constants';
import { refresh } from 'next/cache';
import { cookies } from 'next/headers';

export async function stopImpersonateAction(callbackUrl: string) {
  const service = await getUserService(callbackUrl);

  const response = await service.stopImpersonate();

  if (response.type === 'success')
    (await cookies()).delete(COOKIES['admin-session'].name);

  refresh();

  return response;
}
