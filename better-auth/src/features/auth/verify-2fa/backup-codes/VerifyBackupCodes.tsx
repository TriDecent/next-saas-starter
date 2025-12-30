'use client';

import { ROUTES } from '@/shared/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { VerifyBackupCodesForm } from './VerifyBackupCodesForm';

export function VerifyBackupCodes() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  return (
    <VerifyBackupCodesForm
      onFormSuccess={() => {
        router.replace(callbackUrl ?? ROUTES.home.href);
      }}
    />
  );
}
