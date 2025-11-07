'use client';
import { Form, FormRow } from '@/features/shared/components';

import {
  FieldGroup,
  FieldLegend,
  FieldSet,
  InputGroupAddon,
} from '@/features/shared/components/ui';
import { useCallback } from 'react';
import { FaUser, FaUserPlus } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { toast } from 'sonner';
import { AuthCard } from './AuthCard';
import { signupAction, type SignupResponse } from './action/signup-action';

export function SignupCard() {
  const { renderFields, renderUnexpectedErrors, onFormError, onFormSuccess } =
    useSignupForm();

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

function useSignupForm() {
  const renderFields = useCallback(
    (state: SignupResponse, isPending: boolean) => (
      <FieldSet>
        <FieldLegend></FieldLegend>
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
          />

          <FormRow
            type='password'
            kind='input'
            id='passwordConfirmation'
            name='passwordConfirmation'
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
          />
        </FieldGroup>
      </FieldSet>
    ),
    []
  );

  const renderUnexpectedErrors = useCallback(
    (state: SignupResponse) =>
      state.payload.errors?.unexpected ? (
        <>{state.payload.errors?.unexpected}</>
      ) : null,
    []
  );

  const onFormSuccess = useCallback(
    () => toast.success('Sign up successfully!'),
    []
  );

  const onFormError = useCallback(() => toast.error('Sign up failed'), []);

  return {
    renderFields,
    renderUnexpectedErrors,
    onFormSuccess,
    onFormError,
  };
}
