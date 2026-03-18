import type { auth, OrganizationRole } from '@/lib/auth';
import type {
  ExtractEndpointBody,
  ExtractEndpointQuery,
  ServiceResponse,
} from '../types';

export type CreateOrgInput = ExtractEndpointBody<
  typeof auth.api.createOrganization
>;
export type CreateInvitationInput = Omit<
  ExtractEndpointBody<typeof auth.api.createInvitation>,
  'role'
> & { role: OrganizationRole };
export type GetOrgInput = ExtractEndpointQuery<
  typeof auth.api.getFullOrganization
>;
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
export type GetOrgResponse = ServiceResponse<
  Awaited<ReturnType<typeof auth.api.getFullOrganization>>,
  { message: string }
>;
export type GeneralOrgResponse = ServiceResponse<void, { message: string }>;
