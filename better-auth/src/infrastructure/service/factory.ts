import type { Session, User } from '@/generated/prisma/client';
import { auth, ensureSession } from '@/lib/auth';
import { headers } from 'next/headers';
import { cache } from 'react';
import { OrganizationRepository } from '../repositories/organization';
import { UserRepository } from '../repositories/user';
import { AuthService } from './auth';
import { OrganizationService } from './organization';
import { ServiceExecutor } from './ServiceExecutor';
import { UserService } from './user';

export const getUserService = cache(async (callbackUrl: string) => {
  const headersList = await headers();
  const session = await ensureSession(headersList, callbackUrl);

  // the discrepancy between `null` and `undefined`
  // in fields such as `image` and `banReason`
  // usually does not affect the logic if we only check using `if (!user.image)`.
  const actor = session.user as User;
  const currentSession = session.session as Session;

  return new UserService(
    new ServiceExecutor(actor, new UserRepository(), headersList),
    currentSession
  );
});

export const getAuthService = cache(async () => {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  const actor = (session?.user ?? undefined) as User | undefined;
  const currentSession = (session?.session ?? undefined) as Session | undefined;

  return new AuthService(headersList, actor, currentSession);
});

export const getOrgService = cache(async (callbackUrl: string) => {
  const headersList = await headers();
  const session = await ensureSession(headersList, callbackUrl);

  const actor = session.user as User;

  return new OrganizationService(
    new ServiceExecutor(actor, new UserRepository(), headersList),
    new OrganizationRepository()
  );
});
