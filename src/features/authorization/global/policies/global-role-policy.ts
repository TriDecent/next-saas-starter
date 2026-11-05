import type { User } from '@/generated/prisma/client';
import { ForbiddenError, type InferSubjects } from '@casl/ability';
import type { AppRole } from '../../constants';
import { defineGlobalAbilityFor } from '../global-ability';

type BaseRole = { name: AppRole };
type RoleWithType = BaseRole & { kind: 'Role' };
export type RoleSubject = InferSubjects<RoleWithType>;
export type RoleAction = 'assign';

export function getGlobalRolePolicyFor(actor: User) {
  const ability = defineGlobalAbilityFor(actor);
  const forbiddenError = ForbiddenError.from(ability);

  return {
    assertCanAssignRole: (role?: BaseRole) =>
      role
        ? forbiddenError.throwUnlessCan('assign', { ...role, kind: 'Role' })
        : forbiddenError.throwUnlessCan('assign', 'Role'),
  } as const;
}
