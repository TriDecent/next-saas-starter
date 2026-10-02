'use client';

import {
  BaseFormLayout,
  FormField,
  useActionForm,
} from '@/shared/components/form/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import { startTransition } from 'react';
import { toast } from 'sonner';
import z from 'zod';
import { changeEmailFormAction } from './change-email-action';

export function ChangeEmailForm() {
  const changeEmailAction = changeEmailFormAction.bind(null, usePathname());

  const { methods, animationScope, dispatch, isPending, state } = useActionForm(
    {
      formConfiguration: {
        mode: 'onTouched',
        resolver: zodResolver(z.object({ newEmail: z.email() })),
        defaultValues: { newEmail: '' },
      },
      action: changeEmailAction,
      initialState: { type: 'initial' },
      onFormSuccess: () => {
        toast.success('Email changed successfully', {
          description:
            'Email changed successfully! Check your inbox for a confirmation email.',
          id: 'change-email-form',
        });
      },
      onFormPending: () => {
        toast.loading('Submitting change email form...', {
          description: '',
          id: 'change-email-form',
        });
      },
      onFormError: () => {
        toast.error('Failed to change email', {
          description: state.type !== 'error' ? '' : state.payload.message,
          id: 'change-email-form',
        });
      },
    }
  );

  return (
    <BaseFormLayout
      onSubmit={data => {
        startTransition(() => {
          dispatch(data);
        });
      }}
      methods={methods}
      isPending={isPending}
      animationRef={animationScope}
    >
      <FormField
        kind='input'
        id='new-email'
        name='newEmail'
        labelText='New Email'
        disabled={isPending}
      />
    </BaseFormLayout>
  );
}
