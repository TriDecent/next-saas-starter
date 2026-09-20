'use client';

import type { User } from '@/generated/prisma/client';
import { DropdownMenuItem } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { useTransition } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { toast } from 'sonner';
import { deleteUserAction } from '../delete-user/delete-user-action';

export function DeleteUserAction({ userId }: { userId: User['id'] }) {
  const [isPending, startTransition] = useTransition();

  const handleDeleteUser = () =>
    startTransition(async () => {
      toast.loading(`Deleting user ${userId}`, {
        id: 'delete-user-action',
        description: '',
      });
      const response = await deleteUserAction(userId, ROUTES.admin.href);

      if (response.type === 'success')
        toast.success(`Delete ${userId} successfully!`, {
          id: 'delete-user-action',
          description: '',
        });

      if (response.type === 'error')
        toast.error(`Failed to delete ${userId}!`, {
          id: 'delete-user-action',
          description: response.payload.message,
        });
    });

  const handleClickOnDelete = () => {
    toast.warning(`Delete user ${userId}`, {
      action: { label: 'Confirm', onClick: handleDeleteUser },
    });
  };

  return (
    <DropdownMenuItem
      onClick={handleClickOnDelete}
      disabled={isPending}
      className='text-red-600'
    >
      <FaRegTrashAlt className='text-red-600' />
      Delete user
    </DropdownMenuItem>
  );
}
