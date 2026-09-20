import type { GetOrgResponse } from '@/services/organization';

export type GetFullOrg = NonNullable<
  Extract<GetOrgResponse, { type: 'success' }>['payload']
>;
