'use client';

import {
  AuthFormLayout,
  BackupCodeField,
  TrustDeviceField,
} from '@/shared/components';
import { useActionForm } from '@/shared/components/form';
import { backupCodeSchema } from '@/shared/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useCallback } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type z from 'zod';
import { verifyBackupCodesAction } from './verify-backup-codes-action';

export function VerifyBackupCodesForm({
  onFormSuccess,
}: {
  onFormSuccess: (
    data: Extract<
      Awaited<ReturnType<typeof verifyBackupCodesAction>>,
      { type: 'success' }
    >['payload']
  ) => void;
}) {
  const { methods, isPending, dispatch, animationScope, state } = useActionForm(
    {
      action: verifyBackupCodesAction,
      initialState: { type: 'initial' },
      formConfiguration: {
        resolver: zodResolver(backupCodeSchema),
        mode: 'onTouched',
        defaultValues: { code: '', trustDevice: false },
      },
      onFormSuccess: () => {
        methods.reset();
        toast.success('Backup code verified', {
          id: 'verify-backup-codes-form',
          description:
            'Your backup code was accepted. You are now authenticated.',
        });
        if (state.type !== 'success') return;
        onFormSuccess(state.payload);
      },
      onFormError: state => {
        toast.error('Invalid backup code', {
          id: 'verify-backup-codes-form',
          description:
            state.payload.message ||
            'The code you entered is incorrect or expired. Try again.',
        });
      },
      onFormPending: () => {
        toast.loading('Verifying backup code…', {
          id: 'verify-backup-codes-form',
          description: 'Checking the backup code you entered.',
        });
      },
    }
  );

  const handleSubmit: SubmitHandler<z.infer<typeof backupCodeSchema>> =
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
      <BackupCodeField isPending={isPending} />
      <TrustDeviceField isPending={isPending} />
    </AuthFormLayout>
  );
}
