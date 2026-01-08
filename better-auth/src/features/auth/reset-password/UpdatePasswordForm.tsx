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
import { ROUTES } from '@/shared/constants';
import {
  updatePasswordSchema,
  type UpdatePasswordInput,
} from '@/shared/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { startTransition, useCallback } from 'react';
import { FormProvider, type SubmitHandler } from 'react-hook-form';
import { RiLockPasswordFill } from 'react-icons/ri';
import { toast } from 'sonner';
import { updatePasswordAction } from './update-password-action';

export function UpdatePasswordForm({ token }: { token: string }) {
  const router = useRouter();

  const {
    methods,
    animationScope,
    isPending,
    dispatch: formDispatch,
    state,
  } = useActionForm({
    action: updatePasswordAction,
    initialState: { type: 'initial' },
    formConfiguration: {
      resolver: zodResolver(updatePasswordSchema),
      defaultValues: { password: '', confirmPassword: '', token },
      mode: 'onTouched',
    },
    onFormSuccess: () => {
      methods.reset();
      toast.success('Password updated successfully!', {
        id: 'update-password-form',
        description: 'You can now sign in with your new password.',
      });

      router.push(ROUTES.auth.href);
    },
    onFormError: state => {
      toast.error('Failed to update password', {
        id: 'update-password-form',
        description: state.payload.message,
      });
    },
    onFormPending: () => {
      toast.loading('Submitting update password form...', {
        description: undefined,
        id: 'update-password-form',
      });
    },
  });

  const handleOnValidSubmit: SubmitHandler<UpdatePasswordInput> = useCallback(
    data => {
      startTransition(() => {
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
          <FieldLegend>Enter your new password</FieldLegend>
          <FieldGroup>
            <input type='hidden' name='token' value={token} />

            <FormField
              kind='input'
              type='password'
              id='password'
              name='password'
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
                  Update Password <RiLockPasswordFill />
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
