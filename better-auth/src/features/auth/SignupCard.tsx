'use client';

import { Form, FormRow } from '@/shared/components';

import {
  FieldGroup,
  FieldLegend,
  FieldSet,
  InputGroupAddon,
} from '@/shared/components/ui';
import { useAppDispatch } from '@/shared/hooks';
import { uiActions } from '@/store';
import { useCallback } from 'react';
import { FaUser, FaUserPlus } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { TbNumber123 } from 'react-icons/tb';
import { toast } from 'sonner';
import { AuthCard } from './AuthCard';
import {
  signupAction,
  type ErrorSignupResponse,
  type SignupResponse,
  type SuccessSignupResponse,
} from './action/signup-action';

export function SignupCard() {
  const { renderFields, renderUnexpectedErrors } = useSignupRenders();
  const { onFormError, onFormSuccess } = useSignupStatus();

  return (
    <AuthCard
      title='Sign Up'
      description='Create a new account by filling in the details below.'
    >
      <Form<SignupResponse>
        action={signupAction}
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
            <FaUserPlus /> Sign up
          </>
        }
      />
    </AuthCard>
  );
}

function useSignupStatus() {
  const dispatch = useAppDispatch();

  const onFormSuccess = useCallback(
    (state: SuccessSignupResponse) => {
      dispatch(
        uiActions.toggleEmailVerification({
          name: state.payload.success.user.name,
          email: state.payload.success.user.email,
        })
      );
    },
    [dispatch]
  );

  const onFormError = useCallback((state: ErrorSignupResponse) => {
    const authError = state.payload.errors.auth;
    if (!authError) {
      toast.error('Sign up failed', {
        description: 'An unexpected error occurred. Please try again.',
      });
      return;
    }
    toast.error('Sign in failed', { description: authError.message });
  }, []);

  return {
    onFormSuccess,
    onFormError,
  };
}

function useSignupRenders() {
  const renderFields = useCallback(
    (state: SignupResponse, isPending: boolean) => (
      <FieldSet>
        <FieldLegend>Enter your details</FieldLegend>
        <FieldGroup>
          <FormRow
            kind='input'
            id='name'
            name='name'
            labelText='Name'
            description='Enter your name'
            error={state.payload.errors?.name?.at(0)}
            addons={
              <>
                <InputGroupAddon>
                  <FaUser />
                </InputGroupAddon>
              </>
            }
            autoComplete='name webauthn'
            disabled={isPending}
            defaultValue={state.payload.userEntered?.name}
          />

          <FormRow
            kind='input'
            id='email'
            name='email'
            labelText='Email'
            description='Enter your email address'
            error={state.payload.errors?.email?.at(0)}
            addons={
              <>
                <InputGroupAddon>
                  <MdEmail />
                </InputGroupAddon>
              </>
            }
            autoComplete='email webauthn'
            disabled={isPending}
            defaultValue={state.payload.userEntered?.email}
          />

          <FormRow
            type='password'
            kind='input'
            id='password'
            name='password'
            labelText='Password'
            description='Choose a strong password'
            error={state.payload.errors?.password?.at(0)}
            addons={
              <>
                <InputGroupAddon>
                  <RiLockPasswordFill />
                </InputGroupAddon>
              </>
            }
            autoComplete='new-password webauthn'
            disabled={isPending}
            defaultValue={state.payload.userEntered?.password}
          />

          <FormRow
            type='password'
            kind='input'
            id='confirmedPassword'
            name='confirmedPassword'
            labelText='Confirm your password'
            description='Re-enter your password'
            error={state.payload.errors?.confirmedPassword?.at(0)}
            addons={
              <>
                <InputGroupAddon>
                  <RiLockPasswordFill />
                </InputGroupAddon>
              </>
            }
            autoComplete='new-password webauthn'
            disabled={isPending}
            defaultValue={state.payload.userEntered?.confirmedPassword}
          />

          <FormRow
            kind='input'
            id='favoriteNumber'
            name='favoriteNumber'
            labelText='Your favorite number'
            description='Enter any positive number you like (max 1000)'
            error={state.payload.errors?.favoriteNumber?.at(0)}
            addons={
              <>
                <InputGroupAddon>
                  <TbNumber123 />
                </InputGroupAddon>
              </>
            }
            disabled={isPending}
            defaultValue={state.payload.userEntered?.favoriteNumber}
          />
        </FieldGroup>
      </FieldSet>
    ),
    []
  );

  const renderUnexpectedErrors = useCallback(
    (state: SignupResponse) =>
      state.payload.errors?.unexpected || state.payload.errors?.auth ? (
        <p className='text-destructive text-center'>
          {state.payload.errors?.unexpected}
          {state.payload.errors?.auth?.message}
        </p>
      ) : null,
    []
  );

  return {
    renderFields,
    renderUnexpectedErrors,
  };
}
