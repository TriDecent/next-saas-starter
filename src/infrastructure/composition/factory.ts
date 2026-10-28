'use server';

import { AuthService } from '@/features/auth/server';
import { OrganizationService } from '@/features/organizations/server';
import { SubscriptionService } from '@/features/subscription/server';
import { UserService } from '@/features/user/server';
import type { Session, User } from '@/generated/prisma/client';
import {
  AuthenticatedExecutor,
  BaseExecutor,
} from '@/infrastructure/executors';
import { getOrgRepo } from '@/infrastructure/repositories';
import { UserRepository } from '@/infrastructure/repositories/user';
import { auth, ensureSession } from '@/lib/auth';
import { headers } from 'next/headers';
import { cache } from 'react';

export const getUserService = cache(async (callbackUrl: string) => {
  const { actor, session, headers } = await loadUserSession(callbackUrl);

  return new UserService(
    new UserRepository(),
    new AuthenticatedExecutor(actor),
    session,
    headers
  );
});

export const getAuthService = cache(async () => {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  const actor = (session?.user ?? undefined) as User | undefined;
  const currentSession = (session?.session ?? undefined) as Session | undefined;

  return new AuthService(
    new BaseExecutor(),
    headersList,
    actor,
    currentSession
  );
});

export const getOrgService = cache(async (callbackUrl: string) => {
  const { actor, session, headers } = await loadUserSession(callbackUrl);

  return new OrganizationService(
    new AuthenticatedExecutor(actor),
    getOrgRepo(),
    session,
    headers
  );
});

export const getSubscriptionService = cache(async (callbackUrl: string) => {
  const { actor, headers } = await loadUserSession(callbackUrl);

  return new SubscriptionService(new AuthenticatedExecutor(actor), headers);
});

const loadUserSession = cache(async (callbackUrl: string) => {
  const headersList = await headers();
  const { user, session } = await ensureSession(headersList, callbackUrl);

  // the discrepancy between `null` and `undefined`
  // in fields such as `image` and `banReason`
  // usually does not affect the logic if we only check using `if (!user.image)`.
  return {
    actor: user as User,
    session: session as Session,
    headers: headersList,
  };
});
