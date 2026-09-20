'use client';

import { DataTable } from '@/shared/components/DataTable';
import type { Invitation } from 'better-auth/plugins';
import { useInvitationsColumns } from './use-invitations-columns';

export function InvitationsTable({
  invitations,
}: {
  invitations: Invitation[];
}) {
  const columns = useInvitationsColumns();

  return (
    <DataTable
      mode='client'
      data={invitations}
      columns={columns}
      defaultPageSize={5}
    />
  );
}
