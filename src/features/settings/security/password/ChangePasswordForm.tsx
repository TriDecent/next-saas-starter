'use client';

import { MiniLoader } from '@/shared/components';
import { FormField, useActionForm } from '@/shared/components/form';
import {
  Button,
  Field,
  FieldGroup,
  FieldLegend,
  FieldSet,
  InputGroupAddon,
} from '@/shared/components/ui';
import { changePasswordSchema } from '@/shared/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition } from 'react';
import { FormProvider } from 'react-hook-form';
import { CgPassword } from 'react-icons/cg';
import { RiLockPasswordFill } from 'react-icons/ri';
import { toast } from 'sonner';
import { changePasswordAction } from './change-password-action';

export function ChangePasswordForm({
  currentPassword,
}: {
  currentPassword: string;
}) {
  const {
    methods,
    animationScope,
    isPending,
    dispatch: formDispatch,
    state,
  } = useActionForm({
    action: changePasswordAction,
    initialState: { type: 'initial' },
    formConfiguration: {
      resolver: zodResolver(changePasswordSchema),
      defaultValues: {
        confirmPassword: '',
        currentPassword,
        newPassword: '',
        revokeOtherSessions: false,
      },
      mode: 'onTouched',
    },
    onFormSuccess: () => {
      methods.reset();
      toast.success('Password changed successfully!', {
        id: 'change-password-form',
        description: 'You can now sign in with your new password.',
      });
    },
    onFormError: state => {
      toast.error('Failed to change password', {
        id: 'change-password-form',
        description: state.payload.message,
      });
    },
    onFormPending: () => {
      toast.loading('Submitting change password form...', {
        description: undefined,
        id: 'change-password-form',
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
          <FieldLegend>Enter your new password</FieldLegend>
          <FieldGroup>
            <FormField
              kind='input'
              type='password'
              id='currentPassword'
              name='currentPassword'
              labelText='Current Password'
              description='Enter your current password'
              addons={
                <InputGroupAddon>
                  <RiLockPasswordFill />
                </InputGroupAddon>
              }
              autoComplete='current-password'
              readOnly
              placeholder='Enter your current password'
            />

            <FormField
              kind='input'
              type='password'
              id='newPassword'
              name='newPassword'
              labelText='New Password'
              description='Must be at least 8 characters long'
              addons={
                <InputGroupAddon>
                  <RiLockPasswordFill />
                </InputGroupAddon>
              }
              autoComplete='new-password'
              disabled={isPending}
              placeholder='Enter your new password'
            />

            <FormField
              kind='input'
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              labelText='Confirm Password'
              description='Re-enter your new password'
              addons={
                <InputGroupAddon>
                  <RiLockPasswordFill />
                </InputGroupAddon>
              }
              autoComplete='new-password'
              disabled={isPending}
              placeholder='Confirm your new password'
            />

            <FormField
              kind='checkbox'
              variant='card'
              id='revokeOtherSessions'
              name='revokeOtherSessions'
              disabled={isPending}
              labelText='Log out other sessions'
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
                  <CgPassword /> Change Password
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
