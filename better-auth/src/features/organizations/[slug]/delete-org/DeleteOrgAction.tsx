'use client';

import { MiniLoader } from '@/shared/components';
import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import type { Organization } from 'better-auth/plugins';
import { useTransition } from 'react';
import { PiTrashSimpleFill } from 'react-icons/pi';
import { toast } from 'sonner';
import { useOrgContext } from '../context';
import { deleteOrgAction } from './delete-org-action';

export function DeleteOrgAction({
  organizationId,
}: {
  organizationId: Organization['id'];
}) {
  const [isPending, startTransition] = useTransition();
  const orgCtx = useOrgContext();

  const handleRemoveMember = () =>
    startTransition(async () => {
      toast.loading('Deleting the organization...', {
        id: 'delete-org-action',
        description: `Deleting organization ${organizationId}...`,
      });

      const response = await deleteOrgAction(
        organizationId,
        `${ROUTES.organization.href}/${orgCtx.slug}`
      );

      if (response.type === 'success')
        toast.success(`Organization ${organizationId} has been deleted`, {
          id: 'delete-org-action',
          description: `Organization ${organizationId} has been deleted successfully`,
        });

      if (response.type === 'error')
        toast.error(`Failed to delete organization ${organizationId}`, {
          id: 'delete-org-action',
          description: response.payload.message,
        });
    });

  return (
    <Button
      onClick={handleRemoveMember}
      variant={'destructive'}
      disabled={isPending}
    >
      {isPending ? (
        <MiniLoader />
      ) : (
        <>
          <PiTrashSimpleFill />
          Delete
        </>
      )}
    </Button>
  );
}
