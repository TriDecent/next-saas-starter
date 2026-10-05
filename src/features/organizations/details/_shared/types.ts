import type { GetOrgResponse } from '@/features/organizations/server';

export type GetFullOrg = NonNullable<
  Extract<GetOrgResponse, { type: 'success' }>['payload']
>;
