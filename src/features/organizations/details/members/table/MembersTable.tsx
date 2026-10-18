'use client';

import { DataTable } from '@/shared/components/DataTable/client';
import type { GetFullOrg } from '../../types';
import { useMembersColumns } from './use-members-columns';

export function MembersTable({
  members,
}: {
  members: GetFullOrg['member']['data'];
}) {
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
