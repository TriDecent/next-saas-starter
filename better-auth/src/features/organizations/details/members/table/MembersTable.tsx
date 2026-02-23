'use client';

import { DataTable } from '@/shared/components/DataTable';
import type { GetFullOrg } from '../../_shared';
import { useMembersColumns } from './use-members-columns';

export function MembersTable({ members }: { members: GetFullOrg['members'] }) {
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
