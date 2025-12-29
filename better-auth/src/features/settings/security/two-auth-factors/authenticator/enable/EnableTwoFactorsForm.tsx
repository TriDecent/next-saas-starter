'use client';

import { useActionForm } from '@/shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useCallback } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type z from 'zod';
import { AuthFormLayout, basicAuthSchema, PasswordField } from '../../_shared';
import { enableTwoFactorsAction } from './enable-two-factors-action';

export function EnableTwoFactorsForm({
  onFormSuccess,
}: {
  onFormSuccess: (
    data: Extract<
      Awaited<ReturnType<typeof enableTwoFactorsAction>>,
      { type: 'success' }
    >['payload']
  ) => void;
}) {
  const { methods, isPending, dispatch, animationScope, state } = useActionForm(
    {
      action: enableTwoFactorsAction,
      initialState: { type: 'initial' },
      formConfiguration: {
        resolver: zodResolver(basicAuthSchema),
        mode: 'onTouched',
        defaultValues: { password: '' },
      },
      onFormSuccess: () => {
        methods.reset();
        toast.success('TOTP is ready', {
          id: 'enable-2-fa',
          description:
            'TOTP is active. Scan the QR with your authenticator app and securely store your backup codes.',
        });
        if (state.type !== 'success') return;
        onFormSuccess(state.payload);
      },
      onFormError: state => {
        toast.error('Failed to enable authenticator', {
          id: 'enable-2-fa',
          description: state.payload.message,
        });
      },
      onFormPending: () => {
        toast.loading('Preparing TOTP…', {
          id: 'enable-2-fa',
          description:
            'Verifying your password and generating a QR code. The secret will only be shown once — save it securely.',
        });
      },
    }
  );

  const handleSubmit: SubmitHandler<z.infer<typeof basicAuthSchema>> =
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
    </AuthFormLayout>
  );
}
