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
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { startTransition, useCallback, type ReactNode } from 'react';
import {
  Control,
  Controller,
  FormProvider,
  type FieldValues,
  type SubmitHandler,
} from 'react-hook-form';
import { GiConfirmed } from 'react-icons/gi';
import { VscWorkspaceTrusted } from 'react-icons/vsc';
import { toast } from 'sonner';
import type { ZodType } from 'zod';
import {
  backupCodeSchema,
  basicAuthSchema,
  totpAuthSchema,
  twoFAAuthSchema,
} from './schema';

type FactorIntent =
  | 'enable'
  | 'disable'
  | 'generate-backup'
  | 'verify-backup-codes'
  | 'verify-totp';

type FactorPayload = {
  password?: string;
  code?: string;
  trustDevice?: boolean;
};

type FactorActionFormProps<TResponse extends ActionResponse<unknown, unknown>> =
  {
    action: (
      state: Awaited<TResponse>,
      payload: FactorPayload
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
  const { intent, action, initialState, children } = props;

  const config = INTENT_CONFIG[intent];
  const msgs = MESSAGES[intent];
  const toastId = `factor-${intent}`;

  const { animationScope, methods, isPending, state, dispatch } = useActionForm<
    TResponse,
    FactorPayload
  >({
    formConfiguration: {
      resolver: zodResolver(config.schema),
      mode: 'onTouched',
      defaultValues: { password: '', code: '', trustDevice: false },
    },
    action: action,
    initialState: initialState,
    onFormPending: () => {
      toast.loading(msgs.pending.title, {
        description: msgs.pending.description,
        id: toastId,
      });
    },
    onFormSuccess: () => {
      methods.reset();
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

  const onValid: SubmitHandler<FactorPayload> = useCallback(
    data => {
      startTransition(() => dispatch(data));
    },
    [dispatch]
  );

  if (state.type === 'success')
    return children ? <>{children(state.payload)}</> : null;

  return (
    <FormProvider {...methods}>
      <form ref={animationScope} onSubmit={methods.handleSubmit(onValid)}>
        <FieldGroup className='mx-auto max-w-xl px-4 pb-8'>
          {config.showPassword ? <PasswordField isPending={isPending} /> : null}

          {config.showTotp ? (
            <TotpField control={methods.control} isPending={isPending} />
          ) : null}

          {config.showBackup ? (
            <BackupCodeField control={methods.control} isPending={isPending} />
          ) : null}

          {config.showTrustDevice ? (
            <TrustDeviceField isPending={isPending} />
          ) : null}

          <Button
            disabled={isPending}
            className='mx-auto w-full min-w-32 sm:w-fit'
          >
            <GiConfirmed /> Confirm
          </Button>

          {state.type === 'error' && (
            <p className='text-destructive text-center text-sm'>
              {state.payload.message}
            </p>
          )}
        </FieldGroup>
      </form>
    </FormProvider>
  );
}

function PasswordField({ isPending }: { isPending: boolean }) {
  return (
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
  );
}

function TotpField({
  control,
  isPending,
}: {
  control: Control<{ code?: string }>;
  isPending: boolean;
}) {
  return (
    <Controller
      name='code'
      control={control}
      render={({ field, fieldState }) => (
        <Field orientation='responsive' data-invalid={fieldState.invalid}>
          <FieldLabel className='max-w-40' htmlFor='code'>
            TOTP
          </FieldLabel>
          <FieldContent>
            <InputOTP
              {...field}
              id='code'
              disabled={isPending}
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              aria-invalid={fieldState.invalid}
              containerClassName='justify-center'
            >
              <InputOTPGroup>
                {[0, 1, 2].map(idx => (
                  <InputOTPSlot key={idx} index={idx} />
                ))}
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                {[3, 4, 5].map(idx => (
                  <InputOTPSlot key={idx} index={idx} />
                ))}
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
  );
}

function BackupCodeField({
  control,
  isPending,
}: {
  control: Control<{ code?: string }>;
  isPending: boolean;
}) {
  return (
    <Controller
      name='code'
      control={control}
      render={({ field, fieldState }) => (
        <Field orientation='responsive' data-invalid={fieldState.invalid}>
          <FieldLabel className='max-w-40' htmlFor='code'>
            Backup Codes
          </FieldLabel>
          <FieldContent>
            <InputOTP
              {...field}
              id='code'
              disabled={isPending}
              maxLength={10}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              aria-invalid={fieldState.invalid}
              containerClassName='justify-center flex-col sm:flex-row'
            >
              <InputOTPGroup>
                {[0, 1, 2, 3, 4].map(idx => (
                  <InputOTPSlot key={idx} index={idx} />
                ))}
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                {[5, 6, 7, 8, 9].map(idx => (
                  <InputOTPSlot key={idx} index={idx} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription>
              Enter the 10-character backup code.
            </FieldDescription>
            <FieldError errors={[fieldState.error]} />
          </FieldContent>
        </Field>
      )}
    />
  );
}

function TrustDeviceField({ isPending }: { isPending: boolean }) {
  return (
    <FormField
      kind='checkbox'
      id='trust-device'
      name='trustDevice'
      labelText='Trust this device'
      description='You will not be prompted for two-factor authentication on this device for the next 30 days.'
      addons={<VscWorkspaceTrusted />}
      disabled={isPending}
    />
  );
}

const INTENT_CONFIG: Record<
  FactorIntent,
  {
    schema: ZodType<FieldValues, FieldValues>;
    showPassword: boolean;
    showTotp: boolean;
    showBackup: boolean;
    showTrustDevice: boolean;
  }
> = {
  enable: {
    schema: basicAuthSchema,
    showPassword: true,
    showTotp: false,
    showBackup: false,
    showTrustDevice: false,
  },
  disable: {
    schema: twoFAAuthSchema,
    showPassword: true,
    showTotp: true,
    showBackup: false,
    showTrustDevice: false,
  },
  'generate-backup': {
    schema: twoFAAuthSchema,
    showPassword: true,
    showTotp: true,
    showBackup: false,
    showTrustDevice: false,
  },
  'verify-backup-codes': {
    schema: backupCodeSchema,
    showPassword: false,
    showTotp: false,
    showBackup: true,
    showTrustDevice: true,
  },
  'verify-totp': {
    schema: totpAuthSchema,
    showPassword: false,
    showTotp: true,
    showBackup: false,
    showTrustDevice: true,
  },
};

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
  'verify-backup-codes': {
    pending: {
      title: 'Verifying backup code…',
      description: 'Checking the backup code you entered.',
    },
    success: {
      title: 'Backup code verified',
      description: 'Your backup code was accepted. You are now authenticated.',
    },
    error: {
      title: 'Invalid backup code',
      description: 'The code you entered is incorrect or expired. Try again.',
    },
  },
  'verify-totp': {
    pending: {
      title: 'Verifying TOTP code…',
      description: 'Checking the code from your authenticator app.',
    },
    success: {
      title: 'TOTP verified',
      description: 'Your code was accepted. You are now authenticated.',
    },
    error: {
      title: 'Invalid TOTP code',
      description: 'The code you entered is incorrect or expired. Try again.',
    },
  },
};
