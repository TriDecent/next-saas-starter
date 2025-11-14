'use client';

import { Form, FormRow } from '@/shared/components';
import {
  Button,
  FieldGroup,
  FieldLegend,
  FieldSet,
  InputGroupAddon,
} from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { RiLockPasswordFill } from 'react-icons/ri';
import { toast } from 'sonner';
import { AuthCard } from '../AuthCard';
import {
  updatePasswordAction,
  type ErrorUpdatePasswordResponse,
  type UpdatePasswordResponse,
} from './update-password-action';

export function UpdatePasswordCard({ token }: { token: string }) {
  const { renderFields, renderUnexpectedErrors } = useUpdatePasswordForm(token);
  const { onFormError, onFormSuccess } = useFormStatus();

  return (
    <AuthCard
      title='Update Password'
      description='Enter your new password to complete the reset process.'
      className='space-y-8'
    >
      <Form<UpdatePasswordResponse>
        action={updatePasswordAction}
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
            Update Password <RiLockPasswordFill />
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
  const router = useRouter();

  const onFormSuccess = useCallback(() => {
    toast.success('Password updated successfully!', {
      description: 'You can now sign in with your new password.',
    });

    router.push(ROUTES.auth.href);
  }, [router]);

  const onFormError = useCallback((state: ErrorUpdatePasswordResponse) => {
    if (state.payload?.errors?.auth) {
      toast.error('Failed to update password', {
        description: state.payload.errors.auth,
      });
      return;
    }
    toast.error('Failed to update password', {
      description: state.payload?.errors?.unexpected || 'Please try again.',
    });
  }, []);

  return {
    onFormSuccess,
    onFormError,
  };
}

function useUpdatePasswordForm(token: string) {
  const renderFields = useCallback(
    (state: UpdatePasswordResponse, isPending: boolean) => (
      <FieldSet>
        <FieldLegend>Enter your new password</FieldLegend>
        <FieldGroup>
          <input type='hidden' name='token' value={token} />

          <FormRow
            kind='input'
            type='password'
            id='password'
            name='password'
            labelText='New Password'
            description='Must be at least 6 characters long'
            error={state.payload.errors?.password?.at(0)}
            addons={
              <InputGroupAddon>
                <RiLockPasswordFill />
              </InputGroupAddon>
            }
            autoComplete='new-password'
            disabled={isPending}
            defaultValue={state.payload.userEntered?.password ?? ''}
            placeholder='Enter your new password'
          />

          <FormRow
            kind='input'
            type='password'
            id='confirmPassword'
            name='confirmPassword'
            labelText='Confirm Password'
            description='Re-enter your new password'
            error={state.payload.errors?.confirmPassword?.at(0)}
            addons={
              <InputGroupAddon>
                <RiLockPasswordFill />
              </InputGroupAddon>
            }
            autoComplete='new-password'
            disabled={isPending}
            defaultValue={state.payload.userEntered?.confirmPassword ?? ''}
            placeholder='Confirm your new password'
          />
        </FieldGroup>
      </FieldSet>
    ),
    [token]
  );

  const renderUnexpectedErrors = useCallback(
    (state: UpdatePasswordResponse) =>
      state.payload.errors?.unexpected || state.payload.errors?.auth ? (
        <p className='text-destructive text-center text-sm'>
          {state.payload.errors.unexpected || state.payload.errors.auth}
        </p>
      ) : null,
    []
  );

  return {
    renderFields,
    renderUnexpectedErrors,
  };
}
