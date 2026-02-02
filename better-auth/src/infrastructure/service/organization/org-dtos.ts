import type { auth, OrganizationRole } from '@/lib/auth';
import type { StrictEndpoint, z } from 'better-auth';
import type { ServiceResponse } from '../types';

export type CreateOrgInput = ExtractEndpointBody<
  typeof auth.api.createOrganization
>;
export type CreateInvitationInput = Omit<
  ExtractEndpointBody<typeof auth.api.createInvitation>,
  'role'
> & { role: OrganizationRole };
export type GeneralOrgResponse = ServiceResponse<
  undefined,
  { message: string }
>;

type ExtractEndpointBody<T> =
  T extends StrictEndpoint<string, infer Req, unknown>
    ? Req extends { body: infer B }
      ? z.infer<B>
      : never
    : never;
