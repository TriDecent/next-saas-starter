import type { GetFullOrgResponse } from '@/features/organizations/server';

export type GetFullOrg = NonNullable<
  Extract<GetFullOrgResponse, { type: 'success' }>['payload']
>;
