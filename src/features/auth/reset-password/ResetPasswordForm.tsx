'use client';

import { MiniLoader } from '@/shared/components';
import { FormField, useActionForm } from '@/shared/components/form/client';
import { Button, InputGroupAddon } from '@/shared/components/ui';
import {
  Field,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/shared/components/ui/client';
import { resetPasswordSchema } from '@/shared/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition } from 'react';
import { FormProvider } from 'react-hook-form';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { toast } from 'sonner';
import { resetPasswordAction } from './reset-password-action';

export function ResetPasswordForm() {
  const {
    methods,
    animationScope,
    isPending,
    dispatch: formDispatch,
    state,
  } = useActionForm({
    action: resetPasswordAction,
    initialState: { type: 'initial' },
    formConfiguration: {
      resolver: zodResolver(resetPasswordSchema),
      defaultValues: { email: '' },
      mode: 'onTouched',
    },
    onFormSuccess: () => {
      methods.reset();
      toast.success('Password reset link sent!', {
        id: 'reset-password-form',
        description:
          'Check your email for instructions to reset your password.',
      });
    },
    onFormError: state => {
      toast.error('Failed to send reset link', {
        id: 'reset-password-form',
        description: state.payload.message,
      });
    },
    onFormPending: () => {
      toast.loading('Submitting reset password form...', {
        description: undefined,
        id: 'reset-password-form',
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
          <FieldLegend>Enter your email</FieldLegend>
          <FieldGroup>
            <FormField
              kind='input'
              id='email'
              name='email'
              labelText='Email Address'
              description='We will send a password reset link to this email'
              addons={
                <>
                  <InputGroupAddon>
                    <MdEmail />
                  </InputGroupAddon>
                </>
              }
              autoComplete='email'
              disabled={isPending}
              placeholder='your.email@example.com'
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
                  Send Reset Link <RiLockPasswordFill />
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
