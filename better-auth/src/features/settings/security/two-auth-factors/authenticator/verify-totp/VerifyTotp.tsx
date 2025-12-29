'use client';

import { useEffect } from 'react';
import { FactorActionForm } from '../../_shared/FactorActionForm';
import { verifyTotpAction } from './verify-totp-action';

export function VerifyTotp({
  onVerifySuccess,
}: {
  onVerifySuccess: () => void;
}) {
  return (
    <FactorActionForm
      action={verifyTotpAction}
      initialState={{ type: 'initial' }}
      intent={'verify-totp'}
    >
      {() => <RenderOnSuccessForm onSuccess={onVerifySuccess} />}
    </FactorActionForm>
  );
}

function RenderOnSuccessForm({ onSuccess }: { onSuccess: () => void }) {
  useEffect(() => {
    onSuccess();
  }, [onSuccess]);

  return null;
}
