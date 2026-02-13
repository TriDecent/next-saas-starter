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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/shared/components/ui';
import { cn } from '@/shared/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useMemo } from 'react';
import { FaTrash } from 'react-icons/fa';
import { TbArrowsExchange2 } from 'react-icons/tb';
import { formatDate, getInitials } from '../../_shared';
import { GetFullOrg } from '../_shared';

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
  cell: ({ row }) => {
    const user = row.original.user;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost'>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>
            <UserSummary
              name={user.name}
              email={user.email}
              image={user.image ?? null}
              className='p-0'
              contentClassName='items-start'
            />
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className='text-muted-foreground text-xs'>
              Actions
            </DropdownMenuLabel>

            <DropdownMenuItem>
              <TbArrowsExchange2 />
              Change role
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className='text-muted-foreground text-xs'>
              Danger zone
            </DropdownMenuLabel>

            <DropdownMenuItem className='text-destructive'>
              <FaTrash className='text-destructive' />
              Remove from org
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
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

function UserSummary({
  name,
  email,
  image,
  className,
  contentClassName,
}: Pick<User, 'name' | 'email' | 'image'> & {
  className?: string;
  contentClassName?: string;
}) {
  return (
    <Item className={cn('p-0', className)}>
      <ItemMedia variant='image'>
        <Avatar>
          <AvatarImage src={image ?? undefined} alt={name} />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent className={cn('max-w-52 items-center', contentClassName)}>
        <ItemTitle className='w-full min-w-0'>
          <span className='truncate'>{name}</span>
        </ItemTitle>
        <ItemDescription className='truncate'>{email}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
