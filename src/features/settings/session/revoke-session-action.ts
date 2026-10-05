'use server';

import { getUserService } from '@/infrastructure/composition/factory';
import { ROUTES } from '@/shared/constants';
import { type Session } from 'better-auth';
import { refresh } from 'next/cache';

export async function revokeSessionAction(token: Session['token']) {
  const service = await getUserService(ROUTES.settings.nested.sessions.href);
  await service.revokeSessionWithToken(token);

  refresh();
}
