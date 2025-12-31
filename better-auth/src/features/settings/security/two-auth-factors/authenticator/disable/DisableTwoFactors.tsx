'use client';

import { useRouter } from 'next/navigation';
import { DisableTwoFactorsButton } from './DisableTwoFactorsButton';

export function DisableTwoFactors({ password }: { password: string }) {
  const router = useRouter();
  const handleFormSuccess = () => router.refresh();

  return (
    <DisableTwoFactorsButton
      password={password}
      onSuccess={handleFormSuccess}
    />
  );
}
