'use client';

import { DataTable } from '@/shared/components/DataTable';
import type { OrganizationDetailsProps } from '../OrganizationDetails';
import { useInvitationsColumns } from './use-invitations-columns';

export function InvitationsTable({
  invitations,
}: {
  invitations: OrganizationDetailsProps['invitations'];
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
