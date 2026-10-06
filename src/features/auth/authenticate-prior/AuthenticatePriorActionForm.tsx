'use client';

import { BasicAuthSchema, TwoFAAuthSchema } from '@/features/auth/schema';
import { PasswordField } from '@/shared/components';
import { AuthFormLayout, TotpField } from '@/shared/components/client';
import { useActionForm } from '@/shared/components/form/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useCallback } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type z from 'zod';
import { authenticatePriorAction } from '.';

type AuthenticateMode = 'with-2fa' | 'no-2fa';

export function AuthenticatePriorActionForm({
  mode,
  onAuthenticated,
}: {
  mode: AuthenticateMode;
  onAuthenticated?: (enteredPassword: string) => void;
}) {
  const { methods, isPending, dispatch, animationScope, state } = useActionForm(
    {
      action: authenticatePriorAction,
      initialState: { type: 'initial' },
      formConfiguration: {
        resolver: zodResolver(
          mode === 'with-2fa' ? TwoFAAuthSchema : BasicAuthSchema
        ),
        mode: 'onTouched',
        defaultValues:
          mode === 'with-2fa'
            ? { password: '', code: '', trustDevice: false }
            : { password: '' },
      },
      onFormSuccess: () => {
        onAuthenticated?.(methods.getValues('password'));

        methods.reset();
        toast.success('Authenticated', {
          id: 'authenticate-prior-action-form',
          description:
            'You have been successfully authenticated to proceed with the action.',
        });
      },
      onFormError: state => {
        toast.error('Authentication failed', {
          id: 'authenticate-prior-action-form',
          description:
            state.payload.message ||
            'Verification failed. Check your credentials and try again.',
        });
      },
      onFormPending: () => {
        toast.loading('Authenticating…', {
          id: 'authenticate-prior-action-form',
          description:
            'Verifying your identity before proceeding with the action.',
        });
      },
    }
  );

  const handleSubmit: SubmitHandler<z.infer<typeof BasicAuthSchema>> =
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

      {mode === 'with-2fa' ? <TotpField isPending={isPending} /> : null}
    </AuthFormLayout>
  );
}
