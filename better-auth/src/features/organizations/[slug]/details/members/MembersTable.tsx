'use client';

import { DataTable } from '@/shared/components/DataTable';
import type { OrganizationDetailsProps } from '../OrganizationDetails';
import { useMembersColumns } from './use-members-columns';

export type Member = OrganizationDetailsProps['members'][number];

export function MembersTable({ members }: { members: Member[] }) {
  const columns = useMembersColumns();

  return (
    <DataTable
      mode='client'
      data={members}
      columns={columns}
      defaultPageSize={5}
    />
  );
}
