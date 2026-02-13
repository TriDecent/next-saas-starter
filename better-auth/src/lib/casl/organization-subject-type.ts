import type { Organization } from '@/generated/prisma/client';
import type { InferSubjects } from '@casl/ability';
import type { CRUD } from './ability';

type OrganizationWithType = Organization & { kind: 'Organization' };
export type OrganizationSubject = InferSubjects<OrganizationWithType>;
export type OrganizationActionTypes = '';

type MembersContext = { members: string[] };
type OrganizationWithMembersContext = Organization & {
  kind: 'OrganizationWithMembers';
} & MembersContext;
export type OrganizationWithMembersSubject =
  InferSubjects<OrganizationWithMembersContext>;
export type OrganizationWithMembersActionTypes = Extract<CRUD, 'read'>;
