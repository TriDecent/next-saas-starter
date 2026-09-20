'use client';

import { DropdownMenuItem } from '@/shared/components/ui';
import type { User } from 'better-auth';
import type { Organization } from 'better-auth/plugins';
import { startTransition } from 'react';
import { FaTrash } from 'react-icons/fa6';
import { toast } from 'sonner';
import { removeMemberAction } from './remove-member-action';

type RemoveMemberPayload = {
  memberIdOrEmail: User['id'] | User['email'];
  organizationId: Organization['id'];
};

export function RemoveMemberAction({
  payload: { memberIdOrEmail, organizationId },
  callbackUrl,
}: {
  payload: RemoveMemberPayload;
  callbackUrl: string;
}) {
  const handleRemoveMember = () =>
    startTransition(async () => {
      toast.loading(`Removing member ${memberIdOrEmail}`, {
        id: 'remove-member-action',
        description: `Removing member ${memberIdOrEmail} from the organization...`,
      });

      const response = await removeMemberAction(
        { memberIdOrEmail, organizationId },
        callbackUrl
      );

      if (response.type === 'success')
        toast.success(`Successfully removed member ${memberIdOrEmail}`, {
          id: 'remove-member-action',
          description: `Member ${memberIdOrEmail} has been removed from the organization`,
        });

      if (response.type === 'error')
        toast.error(`Failed to remove member ${memberIdOrEmail}`, {
          id: 'remove-member-action',
          description: response.payload.message,
        });
    });

  return (
    <DropdownMenuItem onClick={handleRemoveMember} className='text-destructive'>
      <FaTrash className='text-destructive' />
      Remove
    </DropdownMenuItem>
  );
}
