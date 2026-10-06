'use client';

import { SignInSchema } from '@/features/auth/schema';
import { MiniLoader, TrustDeviceField } from '@/shared/components';
import { FormField, useActionForm } from '@/shared/components/form/client';
import { Button, InputGroupAddon } from '@/shared/components/ui';
import {
  Field,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/shared/components/ui/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition } from 'react';
import { FormProvider } from 'react-hook-form';
import { FaSignInAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { toast } from 'sonner';
import { signInAction } from './sign-in-action';

export type SignInSuccessData = Extract<
  Awaited<ReturnType<typeof signInAction>>,
  { type: 'success' }
>['payload'];
export type SignInErrorData = Extract<
  Awaited<ReturnType<typeof signInAction>>,
  { type: 'error' }
>['payload'];

export function SignInForm({
  onSuccess,
  onError,
}: {
  onSuccess: (data: SignInSuccessData) => void;
  onError: (data: SignInErrorData) => void;
}) {
  const {
    methods,
    animationScope,
    isPending,
    dispatch: formDispatch,
    state,
  } = useActionForm({
    action: signInAction,
    initialState: { type: 'initial' },
    formConfiguration: {
      resolver: zodResolver(SignInSchema),
      defaultValues: { email: '', password: '', trustDevice: false },
      mode: 'onTouched',
    },
    onFormSuccess: state => {
      methods.reset();
      toast.success('Sign in successfully!', {
        description: 'You have been signed in.',
        id: 'sign-in-form',
      });

      onSuccess(state.payload);
    },
    onFormError: state => {
      toast.error('Sign in failed!', {
        description: state.payload.message,
        id: 'sign-in-form',
      });

      onError(state.payload);
    },
    onFormPending: () => {
      toast.loading('Submitting sign in form...', {
        description: undefined,
        id: 'sign-in-form',
      });
    },
  });

  return (
    <FormProvider {...methods}>
      <form
        ref={animationScope}
        onSubmit={methods.handleSubmit(data =>
          startTransition(() => formDispatch(data))
        )}
      >
        <FieldSet>
          <FieldLegend>Enter your details</FieldLegend>
          <FieldGroup>
            <FormField
              kind='input'
              id='email'
              name='email'
              labelText='Email'
              description='Enter your email address'
              placeholder='example@domain.com'
              addons={
                <InputGroupAddon>
                  <MdEmail />
                </InputGroupAddon>
              }
              autoComplete='email webauthn'
              disabled={isPending}
            />

            <FormField
              type='password'
              kind='input'
              id='password'
              name='password'
              labelText='Password'
              description='Enter your password'
              placeholder='********'
              addons={
                <InputGroupAddon>
                  <RiLockPasswordFill />
                </InputGroupAddon>
              }
              autoComplete='current-password webauthn'
              disabled={isPending}
            />

            <TrustDeviceField isPending={isPending} />
          </FieldGroup>

          <div className='flex w-full flex-col gap-4 md:ml-auto md:w-fit md:flex-row md:justify-end'>
            <Button
              variant='ghost'
              type='reset'
              disabled={isPending}
              className='order-2 md:order-1'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isPending}
              className='order-1 md:order-2'
            >
              {isPending ? (
                <MiniLoader />
              ) : (
                <>
                  Sign in <FaSignInAlt />
                </>
              )}
            </Button>
          </div>

          {state.type === 'error' ? (
            <Field>
              <p className='text-center text-red-500 first-letter:uppercase'>
                {state.payload.message}
              </p>
            </Field>
          ) : null}
        </FieldSet>
      </form>
    </FormProvider>
  );
}
