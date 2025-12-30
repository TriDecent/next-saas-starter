'use client';

import type { AuthSession } from '@/lib';
import { FormField, MiniLoader } from '@/shared/components';
import {
  Button,
  Field,
  FieldGroup,
  FieldLegend,
  FieldSet,
  InputGroupAddon,
} from '@/shared/components/ui';
import { useActionForm } from '@/shared/hooks';
import { updateProfileSchema } from '@/shared/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';
import { FormProvider } from 'react-hook-form';
import { BsFillPersonFill } from 'react-icons/bs';
import { IoSaveOutline } from 'react-icons/io5';
import { MdEmail } from 'react-icons/md';
import { TbNumber123 } from 'react-icons/tb';
import { toast } from 'sonner';
import { updateProfileAction } from './update-profile-action';

export function EditProfileForm({ user }: { user: AuthSession['user'] }) {
  const router = useRouter();

  const {
    methods,
    animationScope,
    isPending,
    dispatch: formDispatch,
    state,
  } = useActionForm({
    action: updateProfileAction,
    initialState: { type: 'initial' },
    formConfiguration: {
      resolver: zodResolver(updateProfileSchema),
      defaultValues: {
        email: user.email,
        favoriteNumber: user.favoriteNumber,
        name: user.name,
      },
      mode: 'onTouched',
    },
    onFormSuccess: () => {
      toast.success('Profile updated successfully', {
        description: undefined,
        id: 'update-profile-form',
      });
      router.refresh();
    },
    onFormError: state => {
      toast.error('Failed to update profile', {
        description: state.payload.message,
        id: 'update-profile-form',
      });
    },
    onFormPending: () => {
      toast.loading('Submitting update profile form...', {
        description: undefined,
        id: 'update-profile-form',
      });
    },
  });

  return (
    <FormProvider {...methods}>
      <form
        ref={animationScope}
        onSubmit={methods.handleSubmit(data => {
          startTransition(() => {
            formDispatch(data);
          });
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
              description='Your display name'
              disabled={isPending}
              addons={
                <>
                  <InputGroupAddon>
                    <BsFillPersonFill />
                  </InputGroupAddon>
                </>
              }
            />

            <FormField
              kind='input'
              id='email'
              name='email'
              type='email'
              labelText='Email'
              description='Change email will require re-verification'
              disabled={isPending}
              addons={
                <>
                  <InputGroupAddon>
                    <MdEmail />
                  </InputGroupAddon>
                </>
              }
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
                  <IoSaveOutline />
                  Save changes
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
