'use client';

import type { CreateOrgInput } from '@/services/organization/org-dtos';
import {
  BaseFormLayout,
  FormField,
  useActionForm,
} from '@/shared/components/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  InputGroupAddon,
} from '@/shared/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { CgRename } from 'react-icons/cg';
import { FiLink } from 'react-icons/fi';
import { toast } from 'sonner';
import { createNewOrg, Response } from './create-new-org-action';
import { createNewOrgSchema } from './schema';

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
      resolver: zodResolver(createNewOrgSchema),
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
  const orgName = useWatch({ control: methods.control, name: 'name' });

  useEffect(() => {
    if (methods.formState.dirtyFields.slug) return;

    methods.setValue('slug', slugify(orgName));
  }, [methods, orgName]);

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
      <FormField
        kind='input'
        id='name'
        labelText='Name'
        name='name'
        autoComplete='organization'
        addons={
          <InputGroupAddon>
            <CgRename />
          </InputGroupAddon>
        }
      />

      <FormField
        kind='input'
        id='slug'
        labelText='Slug'
        name='slug'
        addons={
          <InputGroupAddon>
            <FiLink />
          </InputGroupAddon>
        }
      />
    </BaseFormLayout>
  );
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
