import type { InferSubjects } from '@casl/ability';
import type { AppRole, AuthSession } from '../auth';
import { defineAbilityFor } from './ability';

type BaseRole = { name: AppRole };
type RoleWithType = BaseRole & { kind: 'Role' };
export type RoleSubject = InferSubjects<RoleWithType>;
export type RoleAction = 'assign';

export function getRolePolicyFor(actor: AuthSession['user']) {
  const ability = defineAbilityFor(actor);

  return {
    canAssign: (role?: BaseRole) =>
      role
        ? ability.can('assign', { ...role, kind: 'Role' })
        : ability.can('assign', 'Role'),
  } as const;
}
