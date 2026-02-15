'use client';

import type { User } from '@/generated/prisma/client';
import { ROLES } from '@/lib/auth/constants';
import type { OrganizationRole } from '@/lib/auth/types';
import { DropdownMenuCheckboxItem } from '@/shared/components/ui';
import type { Organization } from 'better-auth/plugins';
import { useTransition } from 'react';
import { MdAssignmentAdd } from 'react-icons/md';
import { toast } from 'sonner';
import { updateRoleAction } from './update-role-action';

type UpdateRolePayload = {
  memberId: User['id'];
  organizationId: Organization['id'];
  role: OrganizationRole;
  currentRoles: string;
};

export function UpdateRoleAction({
  payload: { memberId, organizationId, role, currentRoles },
  callbackUrl,
}: {
  payload: UpdateRolePayload;
  callbackUrl: string;
}) {
  const [isPending, startTransition] = useTransition();

  const normalizedCurrent = normalizeRoles(currentRoles);
  const isChecked = normalizedCurrent.includes(role);

  const computeNextRoles = (nextChecked: boolean): OrganizationRole[] => {
    const set = new Set<OrganizationRole>(normalizedCurrent);

    if (nextChecked) set.add(role);
    else set.delete(role);

    const next = Array.from(set);

    if (next.length === 0) next.push('member');

    return next;
  };

  const handleToggleRole = (nextChecked: boolean) =>
    startTransition(async () => {
      const nextRoles = computeNextRoles(nextChecked);

      toast.loading(`Updating roles for member ${memberId}`, {
        id: 'update-role-action',
        description: `→ ${nextRoles.join(', ') || '(none)'}`,
      });

      const response = await updateRoleAction(
        { memberId, organizationId, role: nextRoles },
        callbackUrl
      );

      if (response.type === 'success')
        toast.success(`Updated roles for member ${memberId}`, {
          id: 'update-role-action',
          description: nextRoles.join(', ') || '(none)',
        });

      if (response.type === 'error')
        toast.error(`Failed to update roles for member ${memberId}`, {
          id: 'update-role-action',
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

function isAppRole(role: string): role is OrganizationRole {
  return Object.hasOwnProperty.call(ROLES, role);
}

function normalizeRoles(input: string): OrganizationRole[] {
  const arr = input.split(',');
  return arr.filter(isAppRole);
}
