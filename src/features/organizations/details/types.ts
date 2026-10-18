import type { GetOrgDetailsResult } from '@/features/organizations/server';

export type OrgDetailsData = NonNullable<
  Extract<GetOrgDetailsResult, { type: 'success' }>['payload']
>;
