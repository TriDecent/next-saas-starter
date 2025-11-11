'use client';

import { Form, FormRow } from '@/features/shared/components';
import {
  Button,
  FieldGroup,
  FieldLegend,
  FieldSet,
  InputGroupAddon,
} from '@/features/shared/components/ui';
import { ROUTES } from '@/features/shared/constants';
import Link from 'next/link';
import { useCallback } from 'react';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { toast } from 'sonner';
import { AuthCard } from '../AuthCard';
import {
  resetPasswordAction,
  type ErrorResetPasswordResponse,
  type ResetPasswordResponse,
} from './reset-password-action';

export function ResetPasswordCard() {
  const { renderFields, renderUnexpectedErrors } = useResetPasswordForm();
  const { onFormError, onFormSuccess } = useFormStatus();

  return (
    <AuthCard
      title='Reset Password'
      description='Enter your email address and we will send you a link to reset your password.'
      className='space-y-8'
    >
      <Form<ResetPasswordResponse>
        action={resetPasswordAction}
        initialState={{
          type: 'initial',
          payload: { userEntered: null, errors: null },
        }}
        renderFields={renderFields}
        renderUnexpectedErrors={renderUnexpectedErrors}
        onFormSuccess={onFormSuccess}
        onFormError={onFormError}
        submitNode={
          <>
            Send Reset Link <RiLockPasswordFill />
          </>
        }
      />

      <div className='text-muted-foreground flex flex-col items-center gap-2 text-sm md:flex-row md:justify-end'>
        <p>Remember your password?</p>
        <Button variant={'link'} asChild className='underline'>
          <Link href={ROUTES.auth.href}>Back to Sign In</Link>
        </Button>
      </div>
    </AuthCard>
  );
}

function useFormStatus() {
  const onFormSuccess = useCallback(() => {
    toast.success('Password reset link sent!', {
      description: 'Check your email for instructions to reset your password.',
    });
  }, []);

  const onFormError = useCallback((state: ErrorResetPasswordResponse) => {
    toast.error('Failed to send reset link', {
      description: state.payload?.errors?.unexpected || 'Please try again.',
    });
  }, []);

  return {
    onFormSuccess,
    onFormError,
  };
}

function useResetPasswordForm() {
  const renderFields = useCallback(
    (state: ResetPasswordResponse, isPending: boolean) => (
      <FieldSet>
        <FieldLegend>Enter your email</FieldLegend>
        <FieldGroup>
          <FormRow
            kind='input'
            id='email'
            name='email'
            labelText='Email Address'
            description='We will send a password reset link to this email'
            error={state.payload.errors?.email?.at(0)}
            addons={
              <>
                <InputGroupAddon>
                  <MdEmail />
                </InputGroupAddon>
              </>
            }
            autoComplete='email'
            disabled={isPending}
            defaultValue={state.payload.userEntered?.email ?? ''}
            placeholder='your.email@example.com'
          />
        </FieldGroup>
      </FieldSet>
    ),
    []
  );

  const renderUnexpectedErrors = useCallback(
    (state: ResetPasswordResponse) =>
      state.payload.errors?.unexpected ? (
        <p className='text-destructive text-center text-sm'>
          {state.payload.errors.unexpected}
        </p>
      ) : null,
    []
  );

  return {
    renderFields,
    renderUnexpectedErrors,
  };
}
