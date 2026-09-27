'use client';

import { DropdownMenuItem } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import type { Invitation } from 'better-auth/plugins';
import { startTransition } from 'react';
import { FaArrowRotateLeft } from 'react-icons/fa6';
import { toast } from 'sonner';
import { useOrgContext } from '../../../context/client';
import { cancelInvitationAction } from './cancel-invitation-action';

export function CancelInvitationAction({
  invitationId,
}: {
  invitationId: Invitation['id'];
}) {
  const orgCtx = useOrgContext();

  const handleRemoveMember = () =>
    startTransition(async () => {
      toast.loading(`Canceling invitation ${invitationId}`, {
        id: 'cancel-invitation-action',
        description: `Canceling invitation ${invitationId}...`,
      });

      const response = await cancelInvitationAction(
        invitationId,
        `${ROUTES.organizations.href}/${orgCtx.slug}`
      );

      if (response.type === 'success')
        toast.success(`Successfully canceled invitation ${invitationId}`, {
          id: 'cancel-invitation-action',
          description: `Invitation ${invitationId} has been canceled`,
        });

      if (response.type === 'error')
        toast.error(`Failed to cancel invitation ${invitationId}`, {
          id: 'cancel-invitation-action',
          description: response.payload.message,
        });
    });

  return (
    <DropdownMenuItem onClick={handleRemoveMember} className='text-destructive'>
      <FaArrowRotateLeft className='text-destructive' />
      Revoke
    </DropdownMenuItem>
  );
}
