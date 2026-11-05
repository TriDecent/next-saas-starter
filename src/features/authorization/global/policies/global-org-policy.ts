import type { Organization, User } from '@/generated/prisma/client';
import { ForbiddenError, type InferSubjects } from '@casl/ability';
import { defineGlobalAbilityFor } from '../global-ability';

type BaseOrg = Organization & { members?: string[] };
type OrganizationWithType = BaseOrg & {
  kind: 'Organization';
};
export type OrganizationSubject = InferSubjects<OrganizationWithType>;
export type OrganizationAction = '';

export function getGlobalOrgPolicyFor(actor: User) {
  const ability = defineGlobalAbilityFor(actor);
  const forbiddenError = ForbiddenError.from(ability);

  return {
    assertCanCreateOrg: () =>
      forbiddenError
        .setMessage('You are not authorized to create an organization.')
        .throwUnlessCan('create', 'Organization'),
  } as const;
}
