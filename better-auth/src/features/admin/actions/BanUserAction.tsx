'use client';

import type { User } from '@/generated/prisma/client';
import { DropdownMenuItem } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { useTransition } from 'react';
import { FaRegCircle } from 'react-icons/fa';
import { FaBan } from 'react-icons/fa6';
import { toast } from 'sonner';
import { banUserAction } from './ban-user-action';

export function BanUserAction({
  userId,
  shouldBan,
}: {
  userId: User['id'];
  shouldBan: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleBanUser = () =>
    startTransition(async () => {
      const action = shouldBan ? 'Banning' : 'Unbanning';
      const successMessage = shouldBan
        ? 'User has been banned successfully'
        : 'User has been unbanned successfully';

      toast.loading(`${action} user ${userId}`, {
        id: 'ban-user-action',
        description: '',
      });
      const response = await banUserAction(
        userId,
        shouldBan,
        ROUTES.admin.href
      );

      if (response.type === 'success')
        toast.success(successMessage, {
          id: 'ban-user-action',
          description: '',
        });

      if (response.type === 'error')
        toast.error(`${action.toLowerCase()} user ${userId} failed!`, {
          id: 'ban-user-action',
          description: response.payload.message,
        });
    });

  return (
    <DropdownMenuItem onClick={handleBanUser} disabled={isPending}>
      {!shouldBan ? (
        <>
          <FaRegCircle /> Unban
        </>
      ) : (
        <>
          <FaBan /> Ban
        </>
      )}
    </DropdownMenuItem>
  );
}
