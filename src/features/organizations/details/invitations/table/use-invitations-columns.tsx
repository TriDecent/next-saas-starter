'use client';

import { formatDate } from '@/features/organizations/utils';
import { DataTableColumnHeader } from '@/shared/components/DataTable';
import { Badge, Checkbox } from '@/shared/components/ui';
import type { ColumnDef } from '@tanstack/react-table';
import type { Invitation } from 'better-auth/plugins';
import { Clock, Mail, Users } from 'lucide-react';
import { useMemo } from 'react';
import { InvitationActionsCell } from './InvitationActionsCell';

const selectColumn = {
  id: 'select',
  header: ({ table }) => (
    <div className='flex justify-center'>
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
      />
    </div>
  ),
  cell: ({ row }) => (
    <div className='flex justify-center'>
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
      />
    </div>
  ),
} satisfies ColumnDef<Invitation>;

const emailColumn = {
  id: 'email',
  accessorKey: 'email',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Email' />
  ),
  cell: ({ row }) => (
    <div className='flex items-center justify-center gap-2'>
      <Mail className='text-muted-foreground size-4' />
      <p className='max-w-52 truncate text-sm font-medium'>
        {row.original.email}
      </p>
    </div>
  ),
} satisfies ColumnDef<Invitation>;

const roleColumn = {
  accessorKey: 'role',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Role' />
  ),
  cell: ({ row }) => (
    <Badge
      variant={
        row.original.role.toLowerCase().includes('owner')
          ? 'destructive'
          : row.original.role.toLowerCase().includes('admin')
            ? 'secondary'
            : 'outline'
      }
      className='uppercase'
    >
      {row.original.role}
    </Badge>
  ),
} satisfies ColumnDef<Invitation>;

const statusColumn = {
  id: 'status',
  accessorKey: 'status',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Status' />
  ),
  cell: ({ row }) => {
    const status = row.original.status;

    return (
      <Badge
        variant={
          status === 'accepted'
            ? 'success'
            : status === 'rejected'
              ? 'error'
              : status === 'canceled'
                ? 'warning'
                : 'default'
        }
      >
        {status}
      </Badge>
    );
  },
} satisfies ColumnDef<Invitation>;

const expiresAtColumn = {
  id: 'expiresAt',
  accessorKey: 'expiresAt',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Expires' />
  ),
  cell: ({ row }) => (
    <div className='text-muted-foreground flex items-center justify-center gap-2 text-sm'>
      <Clock className='size-4' />
      <span>{formatDate(row.original.expiresAt)}</span>
    </div>
  ),
} satisfies ColumnDef<Invitation>;

const teamColumn = {
  id: 'teamId',
  accessorKey: 'teamId',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Team' />
  ),
  cell: ({ row }) => {
    const teamId = row.original.teamId;
    return teamId ? (
      <div className='flex items-center gap-2 text-sm'>
        <Users className='text-muted-foreground size-4' />
        <span className='font-mono text-xs'>{teamId}</span>
      </div>
    ) : (
      <span className='text-muted-foreground text-sm'>—</span>
    );
  },
} satisfies ColumnDef<Invitation>;

const createdAtColumn = {
  id: 'createdAt',
  accessorKey: 'createdAt',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Created' />
  ),
  cell: ({ row }) => (
    <div className='text-muted-foreground text-center text-sm'>
      {formatDate(row.original.createdAt)}
    </div>
  ),
} satisfies ColumnDef<Invitation>;

const actionsColumn = {
  id: 'actions',
  enableSorting: false,
  enableHiding: false,
  cell: ({ row }) => <InvitationActionsCell invitation={row.original} />,
} satisfies ColumnDef<Invitation>;

export function useInvitationsColumns() {
  return useMemo(() => columns, []);
}

const columns = [
  selectColumn,
  emailColumn,
  roleColumn,
  statusColumn,
  expiresAtColumn,
  teamColumn,
  createdAtColumn,
  actionsColumn,
] satisfies ColumnDef<Invitation>[];
