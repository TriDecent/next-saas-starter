'use client';

import type { User } from '@/generated/prisma/client';
import { UserSummary } from '@/shared/components';
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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  Ban,
  LockKeyhole,
  LockKeyholeOpen,
  MoreHorizontal,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { useMemo } from 'react';
import { BanUserAction } from './ban-user';
import { CopyUserAction } from './copy-user';
import { DeleteUserAction } from './delete-user';
import { ImpersonateUserAction } from './impersonation';
import { RevokeUserSessionsAction } from './revoke-sessions';
import { SetRoleActions } from './set-role';

const selectColumn: ColumnDef<User> = {
  id: 'select',
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && 'indeterminate')
      }
      onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
      className='mr-2'
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={value => row.toggleSelected(!!value)}
      className='mr-2'
    />
  ),
};

const nameColumn: ColumnDef<User> = {
  accessorKey: 'name',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='User' />
  ),
  cell: ({ row }) => (
    <UserSummary {...row.original} contentClassName='items-start' />
  ),
};

const emailColumn: ColumnDef<User> = {
  accessorKey: 'email',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Email' />
  ),
  cell: ({ row }) => (
    <div className='mx-auto max-w-50 truncate font-medium'>
      {row.getValue('email')}
    </div>
  ),
};

const emailVerifiedColumn: ColumnDef<User> = {
  accessorKey: 'emailVerified',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Status' />
  ),
  cell: ({ row }) => {
    const isVerified = row.original.emailVerified;

    return (
      <Badge variant={isVerified ? 'success' : 'warning'} className='w-22'>
        {isVerified ? (
          <>
            <ShieldCheck className='h-3 w-3' /> Verified
          </>
        ) : (
          <>
            <ShieldAlert className='h-3 w-3' /> Unverified
          </>
        )}
      </Badge>
    );
  },
};

const createdAtColumn: ColumnDef<User> = {
  accessorKey: 'createdAt',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Joined' />
  ),
  cell: ({ row }) => (
    <div className='text-muted-foreground text-sm'>
      {format(row.original.createdAt, 'PPPP')}
    </div>
  ),
};

const roleColumn: ColumnDef<User> = {
  accessorKey: 'role',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Role' />
  ),
  cell: ({ row }) => (
    <Badge
      variant={
        row.original.role.includes('admin')
          ? 'destructive'
          : row.original.role.includes('moderator')
            ? 'secondary'
            : 'outline'
      }
      className='uppercase'
    >
      {row.original.role}
    </Badge>
  ),
};

const bannedColumn: ColumnDef<User> = {
  accessorKey: 'banned',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Ban Status' />
  ),
  cell: ({ row }) => {
    const isBanned = row.original.banned;
    const banReason = row.original.banReason;
    const banExpires = row.original.banExpires;

    if (isBanned) {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Badge
              variant='destructive'
              className='hover:bg-destructive/80 mx-auto flex w-fit cursor-pointer items-center gap-1'
            >
              <Ban className='size-3' /> Banned
            </Badge>
          </PopoverTrigger>
          <PopoverContent className='p-4' align='start'>
            <div className='space-y-2'>
              <h4 className='text-destructive flex items-center gap-2 leading-none font-medium'>
                <ShieldAlert className='size-4' /> Account Banned
              </h4>
              <p className='text-muted-foreground text-sm'>
                {banReason || 'No reason provided by administrator.'}
              </p>
              <div className='mt-2 border-t pt-2'>
                <p className='text-muted-foreground text-xs'>
                  Expires:{' '}
                  <span className='text-foreground font-medium'>
                    {banExpires ? format(banExpires, 'PPP') : 'Permanent'}
                  </span>
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <Badge
        variant='outline'
        className='text-muted-foreground border-dashed font-normal'
      >
        Active
      </Badge>
    );
  },
};

const twoFactorColumn: ColumnDef<User> = {
  accessorKey: 'twoFactorEnabled',
  header: ({ column }) => <DataTableColumnHeader column={column} title='2FA' />,
  cell: ({ row }) => (
    <div className='flex items-center justify-center'>
      {row.original.twoFactorEnabled ? (
        <LockKeyhole className='size-4 text-green-500' />
      ) : (
        <LockKeyholeOpen className='text-muted-foreground h-4 w-4' />
      )}
    </div>
  ),
};

const actionsColumn: ColumnDef<User> = {
  id: 'actions',
  cell: ({ row }) => {
    const user = row.original;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='size-8 p-0'>
            <MoreHorizontal className='size-4' />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>
            <div className='flex items-center gap-2'>
              <UserSummary {...user} />

              <Badge variant='outline' className='ml-auto uppercase'>
                <span className='max-w-24 truncate'>{user.role}</span>
              </Badge>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className='text-muted-foreground'>
              Quick actions
            </DropdownMenuLabel>
            <CopyUserAction user={user} />
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className='text-muted-foreground'>
              Access & Security
            </DropdownMenuLabel>
            <ImpersonateUserAction userId={user.id} />
            <RevokeUserSessionsAction userId={user.id} />
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Shield className='size-4' />
              Role
            </DropdownMenuSubTrigger>

            <DropdownMenuSubContent>
              <DropdownMenuLabel className='text-muted-foreground'>
                Set role
              </DropdownMenuLabel>

              <DropdownMenuItem disabled className='opacity-70'>
                Current
                <span className='ml-auto max-w-24 overflow-x-clip text-ellipsis uppercase'>
                  {user.role}
                </span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <SetRoleActions user={user} />
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Ban className='size-4' />
              Moderation
            </DropdownMenuSubTrigger>

            <DropdownMenuSubContent>
              <BanUserAction userId={user.id} shouldBan={!user.banned} />
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className='text-muted-foreground'>
              Danger zone
            </DropdownMenuLabel>
            <DeleteUserAction userId={user.id} />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export function useColumns() {
  return useMemo(() => columns, []);
}

const columns: ColumnDef<User>[] = [
  selectColumn,
  nameColumn,
  emailColumn,
  emailVerifiedColumn,
  roleColumn,
  bannedColumn,
  twoFactorColumn,
  createdAtColumn,
  actionsColumn,
];
