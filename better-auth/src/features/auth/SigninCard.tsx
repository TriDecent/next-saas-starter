'use client';
import { Form, FormRow } from '@/features/shared/components';
import {
  FieldGroup,
  FieldLegend,
  FieldSet,
  InputGroupAddon,
} from '@/features/shared/components/ui';
import { useCallback } from 'react';
import { FaSignInAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { toast } from 'sonner';
import { AuthCard } from './AuthCard';
import { signinAction, type SigninResponse } from './action/signin-action';

export function SigninCard() {
  const { renderFields, renderUnexpectedErrors, onFormError, onFormSuccess } =
    useSignupForm();

  return (
    <AuthCard
      title='Sign In'
      description='Enter your credentials to access your account.'
    >
      <Form<SigninResponse>
        action={signinAction}
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
            Sign in <FaSignInAlt />
          </>
        }
      />
    </AuthCard>
  );
}

function useSignupForm() {
  const renderFields = useCallback(
    (state: SigninResponse, isPending: boolean) => (
      <FieldSet>
        <FieldLegend>Enter your details</FieldLegend>
        <FieldGroup>
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
        </FieldGroup>
      </FieldSet>
    ),
    []
  );

  const renderUnexpectedErrors = useCallback(
    (state: SigninResponse) =>
      state.payload.errors?.unexpected ? (
        <p className='text-destructive text-center'>
          {state.payload.errors?.unexpected}
        </p>
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
