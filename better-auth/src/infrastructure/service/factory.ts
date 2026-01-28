import type { Session, User } from '@/generated/prisma/client';
import { auth, ensureSession } from '@/lib/auth';
import { headers } from 'next/headers';
import { cache } from 'react';
import { userRepo } from '../repositories';
import { AuthService } from './auth';
import { UserService } from './user';

export const getUserService = cache(async (callbackUrl: string) => {
  const headersList = await headers();
  const session = await ensureSession(headersList, callbackUrl);

  // the discrepancy between `null` and `undefined`
  // in fields such as `image` and `banReason`
  // usually does not affect the logic if we only check using `if (!user.image)`.
  const actor = session.user as User;
  const currentSession = session.session as Session;

  return new UserService(actor, currentSession, userRepo, headersList);
});

export const getAuthService = cache(async () => {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  return new AuthService(headersList, session?.user as User | undefined);
});
