'use client';

import type { User } from '@/generated/prisma/client';
import { DropdownMenuItem } from '@/shared/components/ui';
import { useTransition } from 'react';
import { FaArrowRotateLeft } from 'react-icons/fa6';
import { toast } from 'sonner';
import { revokeUserSessionsAction } from './revoke-user-sessions-action';

export function RevokeUserSessionsAction({ userId }: { userId: User['id'] }) {
  const [isPending, startTransition] = useTransition();

  const handleRevokeSessions = () =>
    startTransition(async () => {
      toast.loading(`Revoking user ${userId}'s sessions`, {
        id: 'revoke-sessions-action',
        description: '',
      });
      const response = await revokeUserSessionsAction(userId);

      if (response.type === 'success')
        toast.success(`Revoked ${userId}'s sessions successfully`, {
          id: 'revoke-sessions-action',
          description: '',
        });

      if (response.type === 'error')
        toast.error(`Failed to revoke ${userId}'s sessions!`, {
          id: 'revoke-sessions-action',
          description: response.payload.message,
        });
    });

  return (
    <DropdownMenuItem onClick={handleRevokeSessions} disabled={isPending}>
      <FaArrowRotateLeft /> Revoke sessions
    </DropdownMenuItem>
  );
}
