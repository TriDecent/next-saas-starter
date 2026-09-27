'use client';

import { PasswordField } from '@/shared/components';
import { AuthFormLayout, TotpField } from '@/shared/components/client';
import { useActionForm } from '@/shared/components/form/client';
import { twoFAAuthSchema } from '@/shared/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useCallback } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type z from 'zod';
import { generateBackupCodesAction } from './generate-backup-codes-action';

export function GenerateBackupCodesForm({
  onFormSuccess,
}: {
  onFormSuccess: (
    data: Extract<
      Awaited<ReturnType<typeof generateBackupCodesAction>>,
      { type: 'success' }
    >['payload']
  ) => void;
}) {
  const { methods, isPending, dispatch, animationScope, state } = useActionForm(
    {
      action: generateBackupCodesAction,
      initialState: { type: 'initial' },
      formConfiguration: {
        resolver: zodResolver(twoFAAuthSchema),
        mode: 'onTouched',
        defaultValues: { code: '', password: '', trustDevice: false },
      },
      onFormSuccess: () => {
        methods.reset();
        toast.success('Backup codes generated', {
          id: 'generate-backup-codes',
          description:
            'Download or copy the codes now. They will not be shown again.',
        });
        if (state.type !== 'success') return;
        onFormSuccess(state.payload);
      },
      onFormError: state => {
        toast.error('Unable to generate backup codes', {
          id: 'generate-backup-codes',
          description:
            state.payload.message ||
            'Verification failed. Try again or contact support.',
        });
      },
      onFormPending: () => {
        toast.loading('Generating backup codes…', {
          id: 'generate-backup-codes',
          description:
            'Creating new backup codes. Previous codes will be invalidated.',
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
