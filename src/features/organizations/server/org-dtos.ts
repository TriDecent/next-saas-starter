import type { OrganizationRole } from '@/features/authorization';
import type { Organization } from '@/generated/prisma/client';
import type { FullOrg } from '@/infrastructure/repositories';
import type { auth } from '@/lib/auth';
import type { Pagination, Query } from '@/shared/pagination';
import type { ExtractEndpointBody, ServiceResponse } from '@/shared/types';

export type CreateOrgInput = ExtractEndpointBody<
  typeof auth.api.createOrganization
>;
export type CreateInvitationInput = Omit<
  ExtractEndpointBody<typeof auth.api.createInvitation>,
  'role'
> & { role: OrganizationRole };
export type GetOrgInput = Partial<Pick<Organization, 'id' | 'slug'>> & {
  memberQuery: Query;
  invitationQuery: Query;
};
export type UpdateRoleInput = ExtractEndpointBody<
  typeof auth.api.updateMemberRole
>;
export type RemoveUserInput = ExtractEndpointBody<typeof auth.api.removeMember>;
export type UpdateOrgInput = ExtractEndpointBody<
  typeof auth.api.updateOrganization
>;
export type SetActiveOrgInput = ExtractEndpointBody<
  typeof auth.api.setActiveOrganization
>;

export type GetInvitationResponse = ServiceResponse<
  Awaited<ReturnType<typeof auth.api.getInvitation>>,
  { message: string }
>;

export type GetFullOrgResponse = ServiceResponse<
  GetFullOrgSuccess,
  GetOrgError
>;
type GetFullOrgSuccess = Omit<FullOrg, 'member' | 'invitation'> & {
  member: Omit<FullOrg['member'], 'totalMemberCount'> & {
    pagination: Pagination;
  };
  invitation: Omit<FullOrg['invitation'], 'totalInvitationCount'> & {
    pagination: Pagination;
  };
};
type GetOrgError = { message: string };

export type GeneralOrgResponse = ServiceResponse<
  GeneralOrgSuccess,
  GeneralOrgError
>;
export type GeneralOrgSuccess = void;
export type GeneralOrgError = { message: string };
