'use client';

import { BaseFormLayout, useActionForm } from '@/shared/components/form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { startTransition } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { toast } from 'sonner';
import {
  createInvitationAction,
  CreateInvitationResponse,
} from './create-invitation-action';
import { createInvitationSchema, type CreateInvitationSchema } from './schema';

export function BaseCreateInvitationForm({
  children,
  shouldRenderSubmitButton = true,
  renderActions,
}: {
  children: React.ReactNode;
  shouldRenderSubmitButton?: boolean;
  renderActions?: (isPending: boolean) => React.ReactNode;
}) {
  const { methods, animationScope, dispatch, isPending, state } = useActionForm<
    CreateInvitationResponse,
    CreateInvitationSchema
  >({
    action: createInvitationAction,
    initialState: { type: 'initial' },
    formConfiguration: {
      resolver: zodResolver(createInvitationSchema),
      defaultValues: { email: '', organizationId: '', role: 'member' },
    },
    onFormSuccess: () => {
      toast.success('Invitation sent!', {
        description: 'The invitation has been sent successfully.',
        id: 'create-invitation',
      });
      methods.reset();
    },
    onFormError: error =>
      toast.error('Error', {
        description: error.payload.message,
        id: 'create-invitation',
      }),
    onFormPending: () =>
      toast.loading('Sending invitation...', {
        description: 'This may take a few seconds.',
        id: 'create-invitation',
      }),
  });

  return (
    <BaseFormLayout
      methods={methods}
      isPending={isPending}
      animationRef={animationScope}
      onSubmit={data => {
        startTransition(() => dispatch(data));
      }}
      submit={
        <>
          Send invitation <FaArrowRight className='size-4' />
        </>
      }
      error={state.type === 'error' ? state.payload.message : undefined}
      shouldRenderSubmitButton={shouldRenderSubmitButton}
    >
      {children}
      {renderActions?.(isPending)}
    </BaseFormLayout>
  );
}
