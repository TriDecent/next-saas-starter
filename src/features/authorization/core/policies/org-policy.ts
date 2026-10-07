import type { Organization } from '@/generated/prisma/client';
import type { InferSubjects } from '@casl/ability';
import type { AuthSession } from '../../../../lib/auth';

type BaseOrg = Organization & { members?: string[] };
type OrganizationWithType = BaseOrg & {
  kind: 'Organization';
};
export type OrganizationSubject = InferSubjects<OrganizationWithType>;
export type OrganizationAction = '';

export function getOrgPolicyFor(actor: AuthSession['user']) {
  return {} as const;
}
