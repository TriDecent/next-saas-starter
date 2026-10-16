'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAuthenticatePrior } from './context/use-authenticate-prior';

export function SudoTokenExpiryHandler() {
  const { doesSudoTokenExist, sudoTokenExpiresAt } = useAuthenticatePrior(
    useShallow(state => ({
      doesSudoTokenExist: state.doesSudoTokenExist,
      sudoTokenExpiresAt: state.sudoTokenExpiresAt,
    }))
  );

  const router = useRouter();

  useEffect(() => {
    if (!doesSudoTokenExist || !sudoTokenExpiresAt) return;

    const timeUntilExpiry = sudoTokenExpiresAt - Date.now();

    if (timeUntilExpiry <= 0) {
      router.refresh();
      return;
    }

    const timeoutId = setTimeout(() => {
      router.refresh();
    }, timeUntilExpiry);

    return () => clearTimeout(timeoutId);
  }, [router, doesSudoTokenExist, sudoTokenExpiresAt]);

  return null;
}
