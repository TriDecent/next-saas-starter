'use client';

import type { AuthSession } from '@/lib/auth';
import {
  BaseFormLayout,
  FormField,
  useActionForm,
} from '@/shared/components/form/client';
import { InputGroupAddon } from '@/shared/components/ui';
import {
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/shared/components/ui/client';
import { updateProfileSchema } from '@/shared/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { startTransition } from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import { IoSaveOutline } from 'react-icons/io5';
import { TbNumber123 } from 'react-icons/tb';
import { toast } from 'sonner';
import { updateProfileFormAction } from './update-profile-action';

export function EditProfileForm({ user }: { user: AuthSession['user'] }) {
  const router = useRouter();
  const updateProfileAction = updateProfileFormAction.bind(null, usePathname());

  const {
    methods,
    animationScope,
    isPending,
    dispatch: formDispatch,
  } = useActionForm({
    action: updateProfileAction,
    initialState: { type: 'initial' },
    formConfiguration: {
      resolver: zodResolver(updateProfileSchema),
      defaultValues: {
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
    <BaseFormLayout
      onSubmit={data =>
        startTransition(() => {
          formDispatch(data);
        })
      }
      methods={methods}
      isPending={isPending}
      animationRef={animationScope}
      submit={
        <>
          <IoSaveOutline />
          Save changes
        </>
      }
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
            autoComplete='name webauthn'
          />

          <FormField
            kind='input'
            id='favoriteNumber'
            name='favoriteNumber'
            labelText='Favorite number'
            description='Enter any positive number you like (max 1000)'
            addons={
              <>
                <InputGroupAddon>
                  <TbNumber123 />
                </InputGroupAddon>
              </>
            }
            disabled={isPending}
            autoComplete=''
          />
        </FieldGroup>
      </FieldSet>
    </BaseFormLayout>
  );
}
