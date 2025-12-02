'use client';

import { FormField } from '@/shared/components';
import {
  Button,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/shared/components/ui';
import { useActionForm } from '@/shared/hooks';
import type { ActionResponse } from '@/shared/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { startTransition, useCallback, type ReactNode } from 'react';
import { Controller, FormProvider, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { basicAuthSchema, twoFAAuthSchema } from './schema';

type FactorIntent = 'enable' | 'disable' | 'generate-backup';

type FactorActionFormProps<TResponse extends ActionResponse<unknown, unknown>> =
  {
    action: (
      state: Awaited<TResponse>,
      payload: { password: string; code?: string }
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
    { password: string; code?: string }
  >({
    formConfiguration: {
      resolver: zodResolver(
        props.intent === 'enable' ? basicAuthSchema : twoFAAuthSchema
      ),
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
            disabled={isPending}
            autoComplete='current-password webauthn'
          />

          {props.intent !== 'enable' ? (
            <Controller
              name='code'
              control={methods.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>TOTP</FieldLabel>
                  <FieldContent>
                    <InputOTP
                      {...field}
                      disabled={isPending}
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      containerClassName='justify-center'
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>

                      <InputOTPSeparator />

                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>

                    <FieldDescription>
                      Enter the 6-digit code from your authenticator app.
                    </FieldDescription>

                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />
          ) : null}

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
      title: 'TOTP is ready',
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
