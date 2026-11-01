import type { Organization, User } from '@/generated/prisma/client';
import type {
  OrgDetails,
  OrgDetailsQuery,
  OrgMembershipSummary,
} from './types';

export interface IOrgRepository {
  listOrganizationsForUser(userId: User['id']): Promise<OrgMembershipSummary[]>;
  getAuthorizedUserIdsForOrg(orgId: Organization['id']): Promise<string[]>;
  getOrgDetails(params: OrgDetailsQuery): Promise<OrgDetails | null>;
}
