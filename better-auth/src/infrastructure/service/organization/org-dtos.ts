import type { auth } from '@/lib/auth';
import type { ServiceResponse } from '../types';

export type CreateOrgInput = NonNullable<
  NonNullable<Parameters<typeof auth.api.createOrganization>>[0]
>['body'];
export type GeneralOrgResponse = ServiceResponse<
  undefined,
  { message: string }
>;
