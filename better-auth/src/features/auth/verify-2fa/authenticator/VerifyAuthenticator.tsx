'use client';

import { VerifyTotp } from '@/features/settings/security/two-auth-factors/authenticator/verify-totp';
import { ROUTES } from '@/shared/constants';
import { useRouter, useSearchParams } from 'next/navigation';

export function VerifyAuthenticator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  return (
    <VerifyTotp
      onVerifySuccess={() => {
        router.replace(callbackUrl ?? ROUTES.home.href);
      }}
    />
  );
}
