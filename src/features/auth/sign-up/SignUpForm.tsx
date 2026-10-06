'use client';

import { SignUpSchema } from '@/features/auth/schema';
import { MiniLoader } from '@/shared/components';
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
import { FaUser, FaUserPlus } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { TbNumber123 } from 'react-icons/tb';
import { toast } from 'sonner';
import { useVerificationStore } from '../store';
import { signUpAction } from './sign-up-action';

export function SignUpForm() {
  const setInfo = useVerificationStore(
    state => state.actions.setVerificationInfo
  );

  const {
    methods,
    animationScope,
    isPending,
    dispatch: formDispatch,
    state,
  } = useActionForm({
    action: signUpAction,
    initialState: { type: 'initial' },
    formConfiguration: {
      resolver: zodResolver(SignUpSchema),
      defaultValues: {
        email: '',
        password: '',
        confirmedPassword: '',
        favoriteNumber: 0,
        name: '',
      },
      mode: 'onTouched',
    },
    onFormSuccess: state => {
      toast.success('Sign up successfully!', {
        description:
          'Your account has been created successfully. Please verify your email to complete the registration.',
        id: 'sign-up-form',
      });
      methods.reset();
      setInfo(state.payload);
    },
    onFormError: state => {
      toast.error('Sign up failed', {
        description: state.payload.message,
        id: 'sign-up-form',
      });
    },
    onFormPending: () => {
      toast.loading('Submitting sign up form...', {
        description: undefined,
        id: 'sign-up-form',
      });
    },
  });

  return (
    <FormProvider {...methods}>
      <form
        ref={animationScope}
        onSubmit={methods.handleSubmit(data => {
          startTransition(() => formDispatch(data));
        })}
      >
        <FieldSet>
          <FieldLegend>Enter your details</FieldLegend>
          <FieldGroup>
            <FormField
              kind='input'
              id='name'
              name='name'
              labelText='Name'
              description='Enter your name'
              addons={
                <>
                  <InputGroupAddon>
                    <FaUser />
                  </InputGroupAddon>
                </>
              }
              autoComplete='name webauthn'
              disabled={isPending}
              placeholder='Trí Decent...'
            />

            <FormField
              kind='input'
              id='email'
              name='email'
              labelText='Email'
              description='Enter your email address'
              addons={
                <>
                  <InputGroupAddon>
                    <MdEmail />
                  </InputGroupAddon>
                </>
              }
              autoComplete='email webauthn'
              disabled={isPending}
              placeholder='you@example.com'
            />

            <FormField
              type='password'
              kind='input'
              id='password'
              name='password'
              labelText='Password'
              description='Choose a strong password'
              addons={
                <>
                  <InputGroupAddon>
                    <RiLockPasswordFill />
                  </InputGroupAddon>
                </>
              }
              autoComplete='new-password webauthn'
              disabled={isPending}
              placeholder='********'
            />

            <FormField
              type='password'
              kind='input'
              id='confirmedPassword'
              name='confirmedPassword'
              labelText='Confirm your password'
              description='Re-enter your password'
              addons={
                <>
                  <InputGroupAddon>
                    <RiLockPasswordFill />
                  </InputGroupAddon>
                </>
              }
              autoComplete='new-password webauthn'
              disabled={isPending}
              placeholder='********'
            />

            <FormField
              kind='input'
              id='favoriteNumber'
              name='favoriteNumber'
              labelText='Your favorite number'
              description='Enter any positive number you like (max 1000)'
              addons={
                <>
                  <InputGroupAddon>
                    <TbNumber123 />
                  </InputGroupAddon>
                </>
              }
              disabled={isPending}
              placeholder='e.g. 42'
            />
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
                  <FaUserPlus /> Sign up
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
