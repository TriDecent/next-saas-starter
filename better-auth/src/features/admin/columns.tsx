'use client';

import type { User } from '@/generated/prisma/client';
import { DataTableColumnHeader } from '@/shared/components/DataTable';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  Ban,
  Copy,
  Eye,
  LockKeyhole,
  LockKeyholeOpen,
  MoreHorizontal,
  Pencil,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { toast } from 'sonner';

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
  cell: ({ row }) => {
    const user = row.original;
    const initials = user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <div className='flex justify-center'>
        <div className='flex items-center gap-3'>
          <Avatar className='text-muted-foreground border-card-foreground/20 size-9 border'>
            <AvatarImage
              src={user.image ?? undefined}
              alt={`${user.name} avatar`}
              loading='lazy'
              className='size-9'
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className='flex w-32 flex-col items-start xl:w-36'>
            <span className='max-w-32 truncate font-medium xl:max-w-36'>
              {user.name}
            </span>
            <span className='text-muted-foreground max-w-32 truncate text-xs xl:max-w-36'>
              {user.email}
            </span>
          </div>
        </div>
      </div>
    );
  },
};

const emailColumn: ColumnDef<User> = {
  accessorKey: 'email',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Email' />
  ),
  cell: ({ row }) => (
    <div className='mx-auto max-w-[200px] truncate font-medium'>
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
        row.original.role.includes('admin') ? 'destructive' : 'secondary'
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
              <Ban className='h-3 w-3' /> Banned
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
        <LockKeyhole className='h-4 w-4 text-green-500' />
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
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel className='text-muted-foreground'>
            Actions
          </DropdownMenuLabel>

          <DropdownMenuItem
            onClick={async () => {
              await navigator.clipboard.writeText(user.id);
              toast.success('User ID copied to clipboard');
            }}
          >
            <Copy className='mr-2 h-4 w-4' />
            Copy ID
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel className='text-muted-foreground'>
            Settings
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <Eye /> View details
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Pencil /> Edit user
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel className='text-muted-foreground'>
            Danger Zone
          </DropdownMenuLabel>
          <DropdownMenuItem className='text-red-600'>
            <FaRegTrashAlt className='text-red-600' />
            Delete user
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const columns: ColumnDef<User>[] = [
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
