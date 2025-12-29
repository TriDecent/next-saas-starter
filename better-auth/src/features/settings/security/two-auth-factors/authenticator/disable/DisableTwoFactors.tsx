'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { DisableTwoFactorsForm } from './DisableTwoFactorsForm';

export function DisableTwoFactors() {
  const router = useRouter();
  const handleFormSuccess = useCallback(() => router.refresh(), [router]);

  return <DisableTwoFactorsForm onFormSuccess={handleFormSuccess} />;
}
