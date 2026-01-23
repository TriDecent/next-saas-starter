'use client';

import { DropdownMenuItem } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import type { User } from 'better-auth';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { FaKeycdn } from 'react-icons/fa';
import { toast } from 'sonner';
import { impersonateUserAction } from './impersonate-user-action';

export function ImpersonateUserAction({ userId }: { userId: User['id'] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleImpersonateUser = () =>
    startTransition(async () => {
      toast.loading(`Impersonating user ${userId}'s sessions`, {
        id: 'impersonate-action',
        description: '',
      });
      const response = await impersonateUserAction(userId, ROUTES.admin.href);

      if (response.type === 'error') {
        toast.error(`Failed to impersonate ${userId}!`, {
          id: 'impersonate-action',
          description: response.payload.message,
        });

        return;
      }

      if (response.type !== 'success') return;
      toast.success(`Impersonate user ${userId} successfully!`, {
        id: 'impersonate-action',
        description: '',
      });

      router.push(ROUTES.settings.nested.profile.href);
    });

  return (
    <DropdownMenuItem disabled={isPending} onClick={handleImpersonateUser}>
      <FaKeycdn /> Impersonate
    </DropdownMenuItem>
  );
}
