'use client';

import type { User } from '@/generated/prisma/client';
import { APP_ROLES } from '@/lib/auth/constants';
import type { UserRole } from '@/lib/auth/types';
import { DropdownMenuCheckboxItem } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { useTransition } from 'react';
import { MdAssignmentAdd } from 'react-icons/md';
import { toast } from 'sonner';
import { setRoleAction } from './set-role-action';

export function SetRoleAction({
  userId,
  role,
  currentRoles,
}: {
  userId: User['id'];
  role: UserRole;
  currentRoles: string;
}) {
  const [isPending, startTransition] = useTransition();

  const normalizedCurrent = normalizeRoles(currentRoles);
  const isChecked = normalizedCurrent.includes(role);

  const computeNextRoles = (nextChecked: boolean): UserRole[] => {
    const set = new Set<UserRole>(normalizedCurrent);

    if (nextChecked) set.add(role);
    else set.delete(role);

    const next = Array.from(set);

    if (next.length === 0) next.push('user');

    return next;
  };

  const handleToggleRole = (nextChecked: boolean) =>
    startTransition(async () => {
      const nextRoles = computeNextRoles(nextChecked);

      toast.loading(`Updating roles for user ${userId}`, {
        id: 'set-role-action',
        description: `→ ${nextRoles.join(', ') || '(none)'}`,
      });

      const response = await setRoleAction(
        { userId, roles: nextRoles },
        ROUTES.admin.href
      );

      if (response.type === 'success')
        toast.success(`Updated roles for user ${userId}`, {
          id: 'set-role-action',
          description: nextRoles.join(', ') || '(none)',
        });

      if (response.type === 'error')
        toast.error(`Failed to update roles for user ${userId}`, {
          id: 'set-role-action',
          description: response.payload.message,
        });
    });

  return (
    <DropdownMenuCheckboxItem
      checked={isChecked}
      onCheckedChange={checked => handleToggleRole(!!checked)}
      disabled={isPending}
    >
      <MdAssignmentAdd />
      <span className='first-letter:uppercase'>{role}</span>
    </DropdownMenuCheckboxItem>
  );
}

function isUserRole(role: string): role is UserRole {
  return Object.hasOwnProperty.call(APP_ROLES, role);
}

function normalizeRoles(input: string): UserRole[] {
  const arr = input.split(',');
  return arr.filter(isUserRole);
}
