'use server';

import type { User } from '@/generated/prisma/client';
import { COOKIES } from '@/shared/constants';
import { cookies } from 'next/headers';
import { type ReactNode } from 'react';
import { AuthenticatePriorClientProvider } from './context/AuthenticatePriorClientProvider';
import { verifySudoToken } from './sudo-mode';

export async function AuthenticatePriorProvider({
  user,
  children,
}: {
  user: Pick<User, 'id'> & { twoFactorEnabled?: boolean | null };
  children: ReactNode;
}) {
  const cookiesList = await cookies();
  const unverifiedToken = cookiesList.get(COOKIES['sudo-token'].name)?.value;
  const verifiedToken = unverifiedToken
    ? await verifySudoToken(unverifiedToken, user.id)
    : null;

  const sudoTokenExpiresAt = verifiedToken?.payload.exp
    ? verifiedToken.payload.exp * 1000
    : null;

  const value = {
    is2FAEnabled: !!user.twoFactorEnabled,
    doesSudoTokenExist: !!verifiedToken,
    sudoTokenExpiresAt: sudoTokenExpiresAt,
  };

  return (
    <AuthenticatePriorClientProvider value={value}>
      {children}
    </AuthenticatePriorClientProvider>
  );
}
