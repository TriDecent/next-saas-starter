'use client';

import { BaseFormLayout, useActionForm } from '@/shared/components/form/client';
import { ROUTES } from '@/shared/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Organization } from 'better-auth/plugins';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';
import { toast } from 'sonner';
import { CreateOrgFields } from '../create-org/client';
import { OrgSchema, type OrgSchemaType } from '../schema';
import type { UpdateOrganizationState } from './update-org-action';
import { updateOrgAction } from './update-org-action';

export function UpdateOrgForm({ id }: { id: Organization['id'] }) {
  const router = useRouter();
  const { isPending, animationScope, dispatch, methods, state } = useActionForm<
    UpdateOrganizationState,
    OrgSchemaType
  >({
    action: updateOrgAction,
    initialState: { type: 'initial' },
    formConfiguration: {
      resolver: zodResolver(OrgSchema),
      mode: 'onTouched',
      defaultValues: { id, name: '', slug: '' },
    },
    onFormSuccess: () => {
      toast.success('Organization updated successfully!', {
        id: 'update-org',
        description: 'Your organization has been updated.',
      });

      const newSlug = methods.getValues('slug');
      router.replace(`${ROUTES.organizations.href}/${newSlug}`);

      methods.reset();
    },
    onFormPending: () =>
      toast.loading('Updating organization...', {
        id: 'update-org',
        description: 'Please wait while we save your changes.',
      }),
    onFormError: error =>
      toast.error('Failed to update organization', {
        id: 'update-org',
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
