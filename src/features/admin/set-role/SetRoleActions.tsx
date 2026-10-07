import { APP_ROLES } from '@/features/authorization';
import type { User } from '@/generated/prisma/client';
import { SetRoleAction } from './SetRoleAction';

export function SetRoleActions({ user }: { user: User }) {
  return Object.values(APP_ROLES).map(role => (
    <SetRoleAction
      key={role}
      userId={user.id}
      role={role}
      currentRoles={user.role}
    />
  ));
}
