import type { User } from '@/generated/prisma/client';
import { ensureSession } from '@/lib/auth';
import { headers } from 'next/headers';
import { userRepo } from '../repositories';
import { AuthService } from './AuthService';
import { UserService } from './UserService';

export async function getUserService(callbackUrl: string) {
  const headersList = await headers();
  const session = await ensureSession(headersList, callbackUrl);

  // the discrepancy between `null` and `undefined`
  // in fields such as `image` and `banReason`
  // usually does not affect the logic if we only check using `if (!user.image)`.
  const actor = session.user as User;

  return new UserService(actor, userRepo, headersList);
}

export async function getAuthService() {
  const headersList = await headers();

  return new AuthService(headersList);
}
