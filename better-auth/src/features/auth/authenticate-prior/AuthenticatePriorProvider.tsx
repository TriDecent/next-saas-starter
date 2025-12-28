'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import {
  AuthenticatePriorContext,
  type AuthenticatePriorContextType,
} from './authenticate-prior-context';

export function AuthenticatePriorProvider({
  value,
  children,
}: {
  value: AuthenticatePriorContextType;
  children: ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!value.doesSudoTokenExist || !value.sudoTokenExpiresAt) return;

    const timeUntilExpiry = value.sudoTokenExpiresAt - Date.now();

    if (timeUntilExpiry <= 0) {
      router.refresh();
      return;
    }

    const timeoutId = setTimeout(() => {
      router.refresh();
    }, timeUntilExpiry);

    return () => clearTimeout(timeoutId);
  }, [router, value.doesSudoTokenExist, value.sudoTokenExpiresAt]);

  return (
    <AuthenticatePriorContext value={value}>
      {children}
    </AuthenticatePriorContext>
  );
}
