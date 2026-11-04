import type { Organization } from '@/generated/prisma/client';
import { ForbiddenError, type InferSubjects } from '@casl/ability';
import type { AuthSession } from '../../../../lib/auth';
import { defineAbilityFor } from '../ability';

type BaseOrg = Organization & { members?: string[] };
type OrganizationWithType = BaseOrg & {
  kind: 'Organization';
};
export type OrganizationSubject = InferSubjects<OrganizationWithType>;
export type OrganizationAction = '';

export function getOrgPolicyFor(actor: AuthSession['user']) {
  const ability = defineAbilityFor(actor);
  const forbiddenError = ForbiddenError.from(ability);

  return {
    assertCanCreateOrg: () =>
      forbiddenError
        .setMessage('You are not authorized to create an organization.')
        .throwUnlessCan('create', 'Organization'),
  } as const;
}
