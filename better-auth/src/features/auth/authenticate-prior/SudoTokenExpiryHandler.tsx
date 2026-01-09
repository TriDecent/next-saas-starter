'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { type AuthenticatePriorContextType } from './authenticate-prior-context';

export function SudoTokenExpiryHandler({
  value,
}: {
  value: AuthenticatePriorContextType;
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

  return null;
}
