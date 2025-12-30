'use client';

import {
  AuthFormLayout,
  TotpField,
  TrustDeviceField,
} from '@/shared/components';
import { useActionForm } from '@/shared/hooks';
import { totpAuthSchema } from '@/shared/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useCallback } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type z from 'zod';
import { verifyTotpAction } from './verify-totp-action';

export function VerifyTotpForm({
  onFormSuccess,
}: {
  onFormSuccess: (
    data: Extract<
      Awaited<ReturnType<typeof verifyTotpAction>>,
      { type: 'success' }
    >['payload']
  ) => void;
}) {
  const { methods, isPending, dispatch, animationScope, state } = useActionForm(
    {
      action: verifyTotpAction,
      initialState: { type: 'initial' },
      formConfiguration: {
        resolver: zodResolver(totpAuthSchema),
        mode: 'onTouched',
        defaultValues: { code: '', trustDevice: false },
      },
      onFormSuccess: () => {
        methods.reset();
        toast.success('TOTP verified', {
          id: 'verify-totp-form',
          description: 'Your code was accepted. You are now authenticated.',
        });
        if (state.type !== 'success') return;
        onFormSuccess(state.payload);
      },
      onFormError: state => {
        toast.error('Invalid TOTP code', {
          id: 'verify-totp-form',
          description:
            state.payload.message ||
            'The code you entered is incorrect or expired. Try again.',
        });
      },
      onFormPending: () => {
        toast.loading('Verifying TOTP code…', {
          id: 'verify-totp-form',
          description: 'Checking the code from your authenticator app.',
        });
      },
    }
  );

  const handleSubmit: SubmitHandler<z.infer<typeof totpAuthSchema>> =
    useCallback(
      data => {
        startTransition(() => dispatch(data));
      },
      [dispatch]
    );

  return (
    <AuthFormLayout
      methods={methods}
      isPending={isPending}
      onSubmit={handleSubmit}
      animationRef={animationScope}
      error={state.type === 'error' ? state.payload.message : undefined}
    >
      <TotpField isPending={isPending} />
      <TrustDeviceField isPending={isPending} />
    </AuthFormLayout>
  );
}
