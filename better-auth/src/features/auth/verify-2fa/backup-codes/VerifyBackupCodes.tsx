'use client';

import { FactorActionForm } from '@/features/settings/security/two-auth-factors';
import { ROUTES } from '@/shared/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { verifyBackupCodes } from './verify-backup-codes';

export function VerifyBackupCodes() {
  return (
    <FactorActionForm
      action={verifyBackupCodes}
      initialState={{ type: 'initial' }}
      intent={'verify-backup-codes'}
    >
      {() => <RedirectAfterSuccessVerification />}
    </FactorActionForm>
  );
}

function RedirectAfterSuccessVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  useEffect(() => {
    router.replace(callbackUrl ?? ROUTES.home.href);
  }, [callbackUrl, router]);

  return null;
}
