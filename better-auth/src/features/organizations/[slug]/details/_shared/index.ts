import type { GetOrgResponse } from '@/infrastructure/service/organization';

export type GetFullOrg = NonNullable<
  Extract<GetOrgResponse, { type: 'success' }>['payload']
>;
