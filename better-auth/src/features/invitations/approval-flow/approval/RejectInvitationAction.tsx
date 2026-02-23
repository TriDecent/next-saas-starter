'use client';

import { MiniLoader } from '@/shared/components';
import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import type { Invitation } from 'better-auth/plugins';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { handleInvitationApprovalAction } from './handle-invitation-approval-action.ts.js';

export function RejectInvitationAction({
  invitationId,
}: {
  invitationId: Invitation['id'];
}) {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleRejectInvitation = () =>
    startTransition(async () => {
      toast.loading('Rejecting invitation...', {
        id: 'reject-invitation-action',
        description: `Rejecting invitation ${invitationId}`,
      });

      const response = await handleInvitationApprovalAction(
        invitationId,
        'reject',
        `${ROUTES.invitations.href}/${invitationId}`
      );

      if (response.type === 'success') {
        toast.success('Invitation rejected successfully', {
          id: 'reject-invitation-action',
          description: `Invitation ${invitationId} rejected successfully`,
        });

        router.replace(ROUTES.invitations.href);
      }

      if (response.type === 'error')
        toast.error('Failed to reject invitation', {
          id: 'reject-invitation-action',
          description: response.payload.message,
        });
    });

  return (
    <Button
      onClick={handleRejectInvitation}
      variant={'destructive'}
      disabled={isPending}
      className='w-full'
    >
      {isPending ? <MiniLoader /> : <>Reject Invitation</>}
    </Button>
  );
}
