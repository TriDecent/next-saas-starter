'use client';

import type { OrganizationWithRole } from '@/infrastructure/repositories/organization';
import type { CreateInvitationInput } from '@/infrastructure/service/organization';
import { BaseFormLayout, useActionForm } from '@/shared/components/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FieldGroup,
  FieldSeparator,
  Separator,
} from '@/shared/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition } from 'react';
import { FaArrowRight, FaUserPlus } from 'react-icons/fa';
import { toast } from 'sonner';
import {
  createInvitationAction,
  CreateInvitationResponse,
} from './create-invitation-action';
import { createInvitationSchema } from './schema';
import { SelectOrganization } from './SelectOrganization';
import { SelectRecipient } from './SelectRecipient';
import { SelectRole } from './SelectRole';

export function CreateInvitation({
  organizations,
}: {
  organizations: OrganizationWithRole[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <FaUserPlus className='text-muted-foreground size-4' />
          Invite members
        </CardTitle>
        <CardDescription>
          Choose an organization, then send an invitation by email.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent>
        <CreateInvitationForm>
          <SelectOrganization organizations={organizations} />

          <FieldSeparator />

          <SelectRecipient />

          <FieldSeparator />

          <SelectRole />

          <FieldSeparator />
        </CreateInvitationForm>
      </CardContent>
    </Card>
  );
}

function CreateInvitationForm({ children }: { children: React.ReactNode }) {
  const { methods, animationScope, dispatch, isPending, state } = useActionForm<
    CreateInvitationResponse,
    Omit<CreateInvitationInput, 'organizationId'> & { organizationId: string }
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
    >
      <FieldGroup>{children}</FieldGroup>
    </BaseFormLayout>
  );
}
