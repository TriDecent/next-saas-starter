'use client';

import { credentialsSchema } from '@/features/auth/action';
import { FormField } from '@/shared/components';
import { Button, Field, FieldGroup } from '@/shared/components/ui';
import { useActionForm } from '@/shared/hooks';
import type { ActionResponse } from '@/shared/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useCallback, type ReactNode } from 'react';
import { FormProvider, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';

type FactorIntent = 'enable' | 'disable' | 'authenticator' | 'generate-backup';

type FactorActionFormProps<TResponse extends ActionResponse<unknown, unknown>> =
  {
    action: (
      state: Awaited<TResponse>,
      payload: { password: string }
    ) => Promise<TResponse>;
    initialState: Awaited<TResponse>;
    intent: FactorIntent;
    children?: (
      payload: Extract<TResponse, { type: 'success' }>['payload']
    ) => ReactNode;
  };

export function FactorActionForm<
  TResponse extends ActionResponse<unknown, { message: string }>,
>(props: FactorActionFormProps<TResponse>) {
  const msgs = MESSAGES[props.intent];
  const toastId = `factor-${props.intent}`;

  const { animationScope, methods, isPending, state, dispatch } = useActionForm<
    TResponse,
    { password: string }
  >({
    formConfiguration: {
      resolver: zodResolver(credentialsSchema.pick({ password: true })),
      mode: 'onTouched',
      defaultValues: { password: '' },
    },
    action: props.action,
    initialState: props.initialState,
    onFormPending: () => {
      toast.loading(msgs.pending.title, {
        description: msgs.pending.description,
        id: toastId,
      });
    },
    onFormSuccess: () => {
      toast.success(msgs.success.title, {
        description: msgs.success.description,
        id: toastId,
      });
    },
    onFormError: error => {
      toast.error(error.payload?.message, {
        description: msgs.error.description,
        id: toastId,
      });
    },
  });

  const onValid: SubmitHandler<{ password: string }> = useCallback(
    data => {
      console.log(data);
      startTransition(() => dispatch(data));
    },
    [dispatch]
  );

  if (state.type === 'success') return <>{props.children?.(state.payload)}</>;

  return (
    <FormProvider {...methods}>
      <form ref={animationScope} onSubmit={methods.handleSubmit(onValid)}>
        <FieldGroup className='mx-auto max-w-sm space-y-6 px-4 pb-8'>
          <FormField
            kind='input'
            id='password'
            name='password'
            labelText='Password'
            description='Enter your account password to confirm this action.'
            placeholder='******'
            type='password'
            autoComplete='current-password webauthn'
          />

          <Field>
            <Button disabled={isPending} className='w-full'>
              Confirm
            </Button>
          </Field>

          {state.type === 'error' ? (
            <p className='text-destructive text-center text-sm'>
              {state.payload.message}
            </p>
          ) : null}
        </FieldGroup>
      </form>
    </FormProvider>
  );
}

const MESSAGES: Record<
  FactorIntent,
  {
    pending: { title: string; description: string };
    success: { title: string; description: string };
    error: { title: string; description: string };
  }
> = {
  authenticator: {
    pending: {
      title: 'Generating TOTP setup…',
      description: 'Verifying password and creating QR code.',
    },
    success: {
      title: 'TOTP ready',
      description:
        'Scan the QR code with your authenticator app. Save backup codes.',
    },
    error: {
      title: 'Unable to create TOTP',
      description: 'Check your password and try again.',
    },
  },
  'generate-backup': {
    pending: {
      title: 'Generating backup codes…',
      description:
        'Creating new backup codes. Previous codes will be invalidated.',
    },
    success: {
      title: 'Backup codes generated',
      description:
        'Download or copy the codes now. They will not be shown again.',
    },
    error: {
      title: 'Unable to generate backup codes',
      description: 'Verification failed. Try again or contact support.',
    },
  },
  disable: {
    pending: {
      title: 'Disabling two-factor…',
      description:
        'Verifying identity and disabling two-factor authentication.',
    },
    success: {
      title: '2FA disabled',
      description:
        'Two-factor authentication has been disabled for your account.',
    },
    error: {
      title: 'Unable to disable 2FA',
      description: 'Verification failed. Check your credentials and try again.',
    },
  },
  enable: {
    pending: {
      title: 'Preparing TOTP…',
      description:
        'Verifying your password and generating a QR code. The secret will only be shown once — save it securely.',
    },
    success: {
      title: 'Authenticator enabled',
      description:
        'TOTP is active. Scan the QR with your authenticator app and securely store your backup codes.',
    },
    error: {
      title: 'Failed to enable authenticator',
      description:
        'Verification failed or an internal error occurred. Check your password and try again.',
    },
  },
};
