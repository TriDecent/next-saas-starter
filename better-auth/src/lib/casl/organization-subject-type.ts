import type { Organization } from '@/generated/prisma/client';
import type { InferSubjects } from '@casl/ability';

type OrganizationWithType = Organization & { kind: 'Organization' };
export type OrganizationSubject = InferSubjects<OrganizationWithType>;
export type OrganizationAction = '';

type MembersContext = { members: string[] };
type OrganizationWithMembersContext = Organization & {
  kind: 'OrganizationWithMembers';
} & MembersContext;
export type OrganizationWithMembersSubject =
  InferSubjects<OrganizationWithMembersContext>;
export type OrganizationWithMembersAction = '';
