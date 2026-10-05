'use server';

import type { Session, User } from '@/generated/prisma/client';
import { getOrgRepo, getUserRepo } from '@/infrastructure/repositories';
import { AuthenticatedExecutor, BaseExecutor } from '@/infrastructure/executors';
import { auth, ensureSession } from '@/lib/auth';
import { UserRepository } from '@/infrastructure/repositories/user';
import { headers } from 'next/headers';
import { cache } from 'react';
import { AuthService } from '@/features/auth/server';
import { OrganizationService } from '@/features/organizations/server';
import { SubscriptionService } from '@/features/subscription/server';
import { UserService } from '@/features/user/server';

export const getUserService = cache(async (callbackUrl: string) => {
  const headersList = await headers();
  const session = await ensureSession(headersList, callbackUrl);

  // the discrepancy between `null` and `undefined`
  // in fields such as `image` and `banReason`
  // usually does not affect the logic if we only check using `if (!user.image)`.
  const actor = session.user as User;
  const currentSession = session.session as Session;

  return new UserService(
    new AuthenticatedExecutor(actor, new UserRepository(), headersList),
    currentSession
  );
});

export const getAuthService = cache(async () => {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  const actor = (session?.user ?? undefined) as User | undefined;
  const currentSession = (session?.session ?? undefined) as Session | undefined;

  return new AuthService(
    new BaseExecutor(getUserRepo(), headersList),
    actor,
    currentSession
  );
});

export const getOrgService = cache(async (callbackUrl: string) => {
  const headersList = await headers();
  const session = await ensureSession(headersList, callbackUrl);

  const actor = session.user as User;

  return new OrganizationService(
    new AuthenticatedExecutor(actor, new UserRepository(), headersList),
    getOrgRepo(),
    session.session as Session
  );
});

export const getSubscriptionService = cache(async (callbackUrl: string) => {
  const headersList = await headers();
  const session = await ensureSession(headersList, callbackUrl);

  const actor = session.user as User;

  return new SubscriptionService(
    new AuthenticatedExecutor(actor, new UserRepository(), headersList),
    {
      getAuthorizedUserIds: async (referenceId: string) =>
        getOrgRepo().getAuthorizedUserIdsForOrg(referenceId),
    }
  );
});
