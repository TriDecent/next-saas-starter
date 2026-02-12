'use client';

import { DataTableColumnHeader } from '@/shared/components/DataTable';
import {
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui';
import type { ColumnDef } from '@tanstack/react-table';
import type { Invitation } from 'better-auth/plugins';
import { Clock, Mail, MoreHorizontal, Users } from 'lucide-react';
import { useMemo } from 'react';
import { FaArrowRotateLeft, FaCopy } from 'react-icons/fa6';
import { formatDate } from '../../_shared';

const selectColumn = {
  id: 'select',
  header: ({ table }) => (
    <div className='flex justify-center'>
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
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
  cell: ({ row }) => <StatusBadge status={row.original.status} />,
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
  cell: ({ row }) => {
    const invitation = row.original;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost'>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end'>
          <DropdownMenuLabel className='max-w-52 truncate'>
            {invitation.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel className='text-muted-foreground text-xs'>
              Actions
            </DropdownMenuLabel>

            <DropdownMenuItem>
              <FaCopy />
              Copy invite link
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className='text-muted-foreground text-xs'>
              Danger zone
            </DropdownMenuLabel>

            <DropdownMenuItem className='text-destructive'>
              <FaArrowRotateLeft className='text-destructive' />
              Revoke
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
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

function StatusBadge({ status }: { status: Invitation['status'] }) {
  const cls =
    status === 'pending'
      ? 'border-amber-200/50 bg-amber-500/10 text-amber-700'
      : status === 'accepted'
        ? 'border-emerald-200/50 bg-emerald-500/10 text-emerald-700'
        : status === 'rejected'
          ? 'border-rose-200/50 bg-rose-500/10 text-rose-700'
          : 'border-border bg-muted/30 text-muted-foreground';

  return (
    <Badge
      className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium capitalize ${cls}`}
    >
      {status}
    </Badge>
  );
}
