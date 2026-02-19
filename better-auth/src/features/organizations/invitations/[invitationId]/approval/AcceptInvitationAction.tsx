'use client';

import { MiniLoader } from '@/shared/components';
import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import type { Invitation } from 'better-auth/plugins';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { handleInvitationApprovalAction } from './handle-invitation-approval-action.ts';

export function AcceptInvitationAction({
  invitationId,
}: {
  invitationId: Invitation['id'];
}) {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleRemoveMember = () =>
    startTransition(async () => {
      toast.loading('Accepting invitation...', {
        id: 'accept-invitation-action',
        description: `Accepting invitation ${invitationId}`,
      });

      const response = await handleInvitationApprovalAction(
        invitationId,
        'accept',
        `${ROUTES.invitations.href}/${invitationId}`
      );

      if (response.type === 'success') {
        toast.success('Invitation accepted successfully', {
          id: 'accept-invitation-action',
          description: `Invitation ${invitationId} accepted successfully`,
        });

        router.replace(ROUTES.organizations.href);
      }

      if (response.type === 'error')
        toast.error('Failed to accept invitation', {
          id: 'accept-invitation-action',
          description: response.payload.message,
        });
    });

  return (
    <Button
      onClick={handleRemoveMember}
      disabled={isPending}
      className='w-full'
    >
      {isPending ? <MiniLoader /> : <>Accept Invitation</>}
    </Button>
  );
}
