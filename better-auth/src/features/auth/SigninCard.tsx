'use client';

import { ActionButton, Form, FormRow } from '@/features/shared/components';
import {
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  FieldGroup,
  FieldLegend,
  FieldSet,
  InputGroupAddon,
} from '@/features/shared/components/ui';
import { useAppDispatch } from '@/features/shared/hooks';
import { authClient } from '@/lib/auth-client';
import { SUPPORTED_OAUTH_PROVIDERS } from '@/lib/o-auth-providers';
import { uiActions } from '@/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useCallback } from 'react';
import { FaSignInAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { toast } from 'sonner';
import { ROUTES } from '../shared/constants';
import { AuthCard } from './AuthCard';
import {
  signinAction,
  type ErrorSigninResponse,
  type SigninResponse,
} from './action/signin-action';

export function SigninCard() {
  const { renderFields, renderUnexpectedErrors } = useSigninForm();
  const { onFormError, onFormSuccess } = useFormStatus();

  return (
    <AuthCard
      title='Sign In'
      description='Enter your credentials to access your account.'
      className='space-y-8'
    >
      <SocialProviders />
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

      <Button variant={'link'} asChild className='mx-auto w-full underline'>
        <Link href={ROUTES.auth.nested['reset-password'].href}>
          Forgot your password?
        </Link>
      </Button>
    </AuthCard>
  );
}

function SocialProviders() {
  return (
    <ButtonGroup className='w-full shadow-md' orientation={'horizontal'}>
      {SUPPORTED_OAUTH_PROVIDERS.map((provider, index) => (
        <Fragment key={provider.name}>
          <ActionButton
            action={async () => {
              await authClient.signIn.social({
                provider: provider.name,
                callbackURL: '/',
              });
            }}
            className='flex-1'
          >
            <provider.icon />
          </ActionButton>
          {index !== SUPPORTED_OAUTH_PROVIDERS.length - 1 ? (
            <ButtonGroupSeparator orientation='vertical' />
          ) : null}
        </Fragment>
      ))}
    </ButtonGroup>
  );
}

function useFormStatus() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onFormSuccess = useCallback(() => {
    toast.success('Sign in successfully!');
    router.refresh();
  }, [router]);

  const onFormError = useCallback(
    (state: ErrorSigninResponse) => {
      const authError = state.payload.errors.auth;
      if (!authError) {
        toast.error('Sign up failed');
        return;
      }
      toast.error(authError.message);

      if (authError.status !== 'EMAIL_NOT_VERIFIED') return;
      dispatch(
        uiActions.toggleEmailVerification({
          email: state.payload.userEntered.email!, // Email here must exist
          name: 'User',
        })
      );
    },
    [dispatch]
  );

  return {
    onFormSuccess,
    onFormError,
  };
}

function useSigninForm() {
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
