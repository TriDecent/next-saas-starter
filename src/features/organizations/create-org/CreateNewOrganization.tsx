'use client';

import type { CreateOrgInput } from '@/features/organizations/server';
import { BaseFormLayout, useActionForm } from '@/shared/components/form/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition } from 'react';
import { toast } from 'sonner';
import { createNewOrg, Response } from './create-new-org-action';
import { CreateOrgFields } from './CreateOrgFields';
import { CreateNewOrgSchema } from './schema';

export function CreateNewOrganization() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new organization</CardTitle>
        <CardDescription>Start a new workspace for your team.</CardDescription>
      </CardHeader>

      <CardContent>
        <CreateNewOrgForm />
      </CardContent>
    </Card>
  );
}

function CreateNewOrgForm() {
  const { isPending, animationScope, dispatch, methods, state } = useActionForm<
    Response,
    CreateOrgInput
  >({
    action: createNewOrg,
    initialState: { type: 'initial' },
    formConfiguration: {
      resolver: zodResolver(CreateNewOrgSchema),
      mode: 'onTouched',
      defaultValues: { name: '', slug: '' },
    },
    onFormSuccess: () => {
      methods.reset();
      toast.success('Organization created successfully!', {
        id: 'create-new-org',
        description: 'Your new organization is now ready to use.',
      });
    },
    onFormPending: () =>
      toast.loading('Creating organization...', {
        id: 'create-new-org',
        description: 'Please wait while we set things up for you.',
      }),
    onFormError: error =>
      toast.error('Failed to create organization', {
        id: 'create-new-org',
        description: error.payload.message,
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
      error={state.type === 'error' ? state.payload.message : undefined}
    >
      <CreateOrgFields />
    </BaseFormLayout>
  );
}
