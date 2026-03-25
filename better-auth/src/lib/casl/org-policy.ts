import type { Organization } from '@/generated/prisma/client';
import type { InferSubjects } from '@casl/ability';
import type { AuthSession } from '../auth';
import { defineAbilityFor } from './ability';

type BaseOrg = Organization & { members?: string[] };
type OrganizationWithType = BaseOrg & {
  kind: 'Organization';
};
export type OrganizationSubject = InferSubjects<OrganizationWithType>;
export type OrganizationAction = '';

type OrgWithRequiredMembers = Organization & { members: string[] };
export function getOrgPolicyFor(actor: AuthSession['user']) {
  const ability = defineAbilityFor(actor);

  return {
    canRead: (org?: OrgWithRequiredMembers) =>
      org
        ? ability.can('read', { ...org, kind: 'Organization' })
        : ability.can('read', 'Organization'),
  } as const;
}
