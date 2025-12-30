'use client';

import { FormField, MiniLoader } from '@/shared/components';
import {
  Button,
  Field,
  FieldGroup,
  FieldLegend,
  FieldSet,
  InputGroupAddon,
} from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { useActionForm, useAppDispatch } from '@/shared/hooks';
import { signInSchema, type SignInInput } from '@/shared/schema';
import { uiActions } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { startTransition, useCallback, useState } from 'react';
import { FormProvider, type SubmitHandler } from 'react-hook-form';
import { FaSignInAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { toast } from 'sonner';
import { signInAction } from './sign-in-action';

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduxDispatch = useAppDispatch();
  const [targetEmail, setTargetEmail] = useState<string | null>(null);

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
      resolver: zodResolver(signInSchema),
      defaultValues: { email: '', password: '' },
      mode: 'onTouched',
    },
    onFormSuccess: () => {
      methods.reset();
      toast.success('Sign in successfully!', {
        description: 'You have been signed in and will be redirected shortly.',
        id: 'sign-in-form',
      });
      router.replace(searchParams.get('callbackUrl') ?? ROUTES.home.href);
    },
    onFormError: state => {
      toast.error('Sign up failed', {
        description: state.payload.message,
        id: 'sign-in-form',
      });

      if (state.payload.status !== 'EMAIL_NOT_VERIFIED') return;

      reduxDispatch(
        uiActions.toggleEmailVerification({
          email: targetEmail!, // Email here must exist
          name: 'User',
        })
      );
    },
    onFormPending: () => {
      toast.loading('Submitting sign in form...', {
        description: undefined,
        id: 'sign-in-form',
      });
    },
  });

  const handleOnValidSubmit: SubmitHandler<SignInInput> = useCallback(
    data => {
      startTransition(() => {
        setTargetEmail(data.email);
        formDispatch(data);
      });
    },
    [formDispatch]
  );

  return (
    <FormProvider {...methods}>
      <form
        ref={animationScope}
        onSubmit={methods.handleSubmit(handleOnValidSubmit)}
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
                <>
                  <InputGroupAddon>
                    <MdEmail />
                  </InputGroupAddon>
                </>
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
                <>
                  <InputGroupAddon>
                    <RiLockPasswordFill />
                  </InputGroupAddon>
                </>
              }
              autoComplete='new-password webauthn'
              disabled={isPending}
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
            <Button disabled={isPending} className='order-1 md:order-2'>
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
