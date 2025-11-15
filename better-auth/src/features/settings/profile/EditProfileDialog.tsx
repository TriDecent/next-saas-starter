'use client';

import type { AuthSession } from '@/lib/auth';
import { FormRow } from '@/shared/components';
import { Form } from '@/shared/components/Form';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  InputGroupAddon,
  ScrollArea,
  Separator,
} from '@/shared/components/ui';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';
import { TbNumber123 } from 'react-icons/tb';
import { toast } from 'sonner';
import {
  updateProfileAction,
  type ErrorUpdateProfileResponse,
  type UpdateProfileResponse,
} from './update-profile-action';

export function EditProfileDialog({ user }: { user: AuthSession['user'] }) {
  const [open, setOpen] = useState(false);
  const {
    renderFields,
    renderUnexpectedErrors,
    onFormSuccess,
    onFormError,
    initialState,
  } = useUpdateProfileForm({ user });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'outline'}>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <div className='flex justify-center py-4'>
          <Avatar className='h-12 w-12 border-2'>
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className='text-3xl'>
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <Separator />

        <ScrollArea className='h-48'>
          <Form
            action={updateProfileAction}
            initialState={initialState}
            renderFields={renderFields}
            renderUnexpectedErrors={renderUnexpectedErrors}
            onFormSuccess={onFormSuccess}
            onFormError={onFormError}
            submitNode='Save changes'
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function useUpdateProfileForm({ user }: { user: AuthSession['user'] }) {
  const router = useRouter();

  const initialState: UpdateProfileResponse = {
    type: 'initial',
    payload: {
      userEntered: null,
      errors: null,
    },
  };

  const onFormSuccess = useCallback(() => {
    toast.success('Profile updated successfully');
    router.refresh();
  }, [router]);

  const onFormError = useCallback((state: ErrorUpdateProfileResponse) => {
    console.log(state);
    toast.error('Failed to update profile', {
      description: state.payload.errors.unexpected,
    });
  }, []);

  const renderFields = useCallback(
    (state: UpdateProfileResponse, isPending: boolean) => (
      <>
        <FormRow
          kind='input'
          id='name'
          name='name'
          labelText='Name'
          description='Your display name'
          defaultValue={state.payload.userEntered?.name ?? user.name}
          error={state.payload.errors?.name?.[0]}
          disabled={isPending}
          addons={
            <>
              <InputGroupAddon>
                <BsFillPersonFill />
              </InputGroupAddon>
            </>
          }
        />

        <FormRow
          kind='input'
          id='email'
          name='email'
          type='email'
          labelText='Email'
          description='Change email will require re-verification'
          defaultValue={state.payload.userEntered?.email ?? user.email}
          disabled={isPending}
          addons={
            <>
              <InputGroupAddon>
                <MdEmail />
              </InputGroupAddon>
            </>
          }
        />

        <FormRow
          kind='input'
          id='favoriteNumber'
          name='favoriteNumber'
          labelText='Your favorite number'
          description='Enter any positive number you like (max 1000)'
          defaultValue={
            state.payload.userEntered?.favoriteNumber ?? user.favoriteNumber
          }
          error={state.payload.errors?.favoriteNumber?.at(0)}
          addons={
            <>
              <InputGroupAddon>
                <TbNumber123 />
              </InputGroupAddon>
            </>
          }
          disabled={isPending}
        />
      </>
    ),
    [user]
  );

  const renderUnexpectedErrors = useCallback((state: UpdateProfileResponse) => {
    if (!state.payload.errors?.unexpected) return null;
    return (
      <div className='border-destructive bg-destructive/10 text-destructive rounded-md border p-3 text-sm'>
        {state.payload.errors.unexpected}
      </div>
    );
  }, []);

  return {
    initialState,
    renderFields,
    renderUnexpectedErrors,
    onFormSuccess,
    onFormError,
  };
}
