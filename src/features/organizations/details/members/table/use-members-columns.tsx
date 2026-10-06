'use client';

import { formatDate } from '@/features/organizations/utils';
import { UserSummary } from '@/shared/components';
import { DataTableColumnHeader } from '@/shared/components/DataTable';
import { Badge, Checkbox } from '@/shared/components/ui';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import type { GetFullOrg } from '../../types';
import { MemberActionsCell } from './MemberActionsCell';

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
} satisfies ColumnDef<Member>;

const memberColumn = {
  id: 'member',
  accessorFn: row => row.user.name,
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Member' />
  ),
  cell: ({ row }) => {
    const user = row.original.user;

    return (
      <UserSummary
        name={user.name}
        email={user.email}
        image={user.image ?? null}
        className='mx-auto w-fit flex-nowrap'
      />
    );
  },
} satisfies ColumnDef<Member>;

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
} satisfies ColumnDef<Member>;

const createdAtColumn = {
  id: 'createdAt',
  accessorKey: 'createdAt',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Joined' />
  ),
  cell: ({ row }) => (
    <div className='text-muted-foreground text-center text-sm'>
      {formatDate(row.original.createdAt)}
    </div>
  ),
} satisfies ColumnDef<Member>;

const actionsColumn: ColumnDef<Member> = {
  id: 'actions',
  cell: ctx => <MemberActionsCell {...ctx} />,
};

const columns: ColumnDef<Member>[] = [
  selectColumn,
  memberColumn,
  roleColumn,
  createdAtColumn,
  actionsColumn,
];

type Member = GetFullOrg['members'][number];

export function useMembersColumns() {
  return useMemo(() => columns, []);
}
