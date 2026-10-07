import { ORG_ROLES } from '@/features/authorization';
import type { Member } from 'better-auth/plugins';
import { UpdateRoleAction } from './UpdateRoleAction';

export function UpdateRolesActions({
  member,
  callbackUrl,
}: {
  member: Member;
  callbackUrl: string;
}) {
  const updateRolePayload = {
    memberId: member.id,
    organizationId: member.organizationId,
    role: 'member',
    currentRoles: member.role,
  } as const satisfies Parameters<typeof UpdateRoleAction>['0']['payload'];

  return Object.values(ORG_ROLES).map(role => (
    <UpdateRoleAction
      key={role}
      payload={{ ...updateRolePayload, role }}
      callbackUrl={callbackUrl}
    />
  ));
}
