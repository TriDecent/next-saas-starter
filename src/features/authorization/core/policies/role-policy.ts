import type { AuthSession } from '@/lib/auth';
import { ForbiddenError, type InferSubjects } from '@casl/ability';
import type { AppRole } from '../../constants';
import { defineAbilityFor } from '../ability';

type BaseRole = { name: AppRole };
type RoleWithType = BaseRole & { kind: 'Role' };
export type RoleSubject = InferSubjects<RoleWithType>;
export type RoleAction = 'assign';

export function getRolePolicyFor(actor: AuthSession['user']) {
  const ability = defineAbilityFor(actor);
  const forbiddenError = ForbiddenError.from(ability);

  return {
    assertCanAssignRole: (role?: BaseRole) =>
      role
        ? forbiddenError.throwUnlessCan('assign', { ...role, kind: 'Role' })
        : forbiddenError.throwUnlessCan('assign', 'Role'),
  } as const;
}
