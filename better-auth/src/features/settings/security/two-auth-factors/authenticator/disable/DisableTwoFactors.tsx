'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FactorActionForm } from '../../_shared/FactorActionForm';
import { disableTwoFactorsAction } from './disable-two-factors-action';

export function DisableTwoFactors() {
  return (
    <FactorActionForm
      action={disableTwoFactorsAction}
      intent={'disable'}
      initialState={{ type: 'initial' }}
    >
      {() => <RefreshComponent />}
    </FactorActionForm>
  );
}

function RefreshComponent() {
  const router = useRouter();
  useEffect(() => router.refresh(), [router]);

  return null;
}
