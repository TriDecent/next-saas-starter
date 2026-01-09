import type { User } from '@/generated/prisma/client';
import { ensureSession } from '@/lib/auth';
import { headers } from 'next/headers';
import { userRepo } from '../repositories';
import { UserService } from './UserService';

export async function getUserService(callbackUrl: string) {
  const session = await ensureSession(await headers(), callbackUrl);

  // the discrepancy between `null` and `undefined`
  // in fields such as `image` and `banReason`
  // usually does not affect the logic if we only check using `if (!user.image)`.
  const actor = session.user as unknown as User;

  return new UserService(actor, userRepo);
}
