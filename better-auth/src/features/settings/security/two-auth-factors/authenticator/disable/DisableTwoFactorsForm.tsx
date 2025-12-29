'use client';

import { useActionForm } from '@/shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useCallback } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type z from 'zod';
import {
  AuthFormLayout,
  PasswordField,
  TotpField,
  twoFAAuthSchema,
} from '../../_shared';
import { disableTwoFactorsAction } from './disable-two-factors-action';

export function DisableTwoFactorsForm({
  onFormSuccess,
}: {
  onFormSuccess: (
    data: Extract<
      Awaited<ReturnType<typeof disableTwoFactorsAction>>,
      { type: 'success' }
    >['payload']
  ) => void;
}) {
  const { methods, isPending, dispatch, animationScope, state } = useActionForm(
    {
      action: disableTwoFactorsAction,
      initialState: { type: 'initial' },
      formConfiguration: {
        resolver: zodResolver(twoFAAuthSchema),
        mode: 'onTouched',
        defaultValues: { code: '', password: '', trustDevice: false },
      },
      onFormSuccess: () => {
        methods.reset();
        toast.success('2FA disabled', {
          id: 'disable-2-fa',
          description:
            'Two-factor authentication has been disabled for your account.',
        });
        if (state.type !== 'success') return;
        onFormSuccess(state.payload);
      },
      onFormError: state => {
        toast.error('Unable to disable 2FA', {
          id: 'disable-2-fa',
          description:
            state.payload.message ||
            'Verification failed. Check your credentials and try again.',
        });
      },
      onFormPending: () => {
        toast.loading('Disabling two-factor…', {
          id: 'disable-2-fa',
          description:
            'Verifying identity and disabling two-factor authentication.',
        });
      },
    }
  );

  const handleSubmit: SubmitHandler<z.infer<typeof twoFAAuthSchema>> =
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
      <PasswordField isPending={isPending} />
      <TotpField isPending={isPending} />
    </AuthFormLayout>
  );
}
