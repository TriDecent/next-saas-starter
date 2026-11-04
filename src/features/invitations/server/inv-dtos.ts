import type { OrganizationRole } from '@/features/authorization';
import type { auth } from '@/lib/auth';
import type { ExtractEndpointBody, ServiceResult } from '@/shared/types';

export type CreateInvitationInput = Omit<
  ExtractEndpointBody<typeof auth.api.createInvitation>,
  'role'
> & { role: OrganizationRole };

export type GetInvitationResult = ServiceResult<
  Awaited<ReturnType<typeof auth.api.getInvitation>>,
  { message: string }
>;

export type InvMutationResult = ServiceResult<void, { message: string }>;
