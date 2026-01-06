'use client';

import {
  DataTable,
  DataTableColumnHeader,
  type DataTableServerProps,
} from '@/shared/components/DataTable';
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
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/shared/components/ui';
import type { ColumnDef, Table } from '@tanstack/react-table';
import type { User } from 'better-auth';
import { format } from 'date-fns';
import {
  Copy,
  Eye,
  MoreHorizontal,
  Pencil,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { useRef } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';
import { toast } from 'sonner';

export function UsersTable(props: {
  users: User[];
  total: number;
  paginationState: DataTableServerProps['paginationState'];
  sortingState: DataTableServerProps['sortingState'];
  globalFilter: DataTableServerProps['globalFilter'];
}) {
  return (
    <DataTable
      mode='server'
      columns={columns}
      data={props.users}
      rowCount={props.total}
      {...props}
      render={table => (
        <div className='px-2 pb-8'>
          <SearchUsers table={table} />
        </div>
      )}
    />
  );
}

function SearchUsers({ table }: { table: Table<User> }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchUsers = () => {
    if (!inputRef.current) return;
    console.log(inputRef.current.value);
    table.setGlobalFilter(inputRef.current.value);
  };

  return (
    <InputGroup>
      <InputGroupAddon>
        <IoSearch />
      </InputGroupAddon>
      <InputGroupInput
        onKeyDown={e => {
          if (e.key === 'Enter') handleSearchUsers();
        }}
        ref={inputRef}
        placeholder='Search users by id, name, email, or status...'
        className='placeholder:truncate placeholder:text-xs'
      />
      <InputGroupAddon align={'inline-end'}>
        <InputGroupButton onClick={handleSearchUsers} variant={'secondary'}>
          Search
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}

const selectColumn: ColumnDef<User> = {
  id: 'select',
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && 'indeterminate')
      }
      onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={value => row.toggleSelected(!!value)}
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
      <div className='flex items-center justify-center gap-3'>
        <Avatar className='text-muted-foreground border-card-foreground/20 size-9 border'>
          <AvatarImage
            src={user.image ?? undefined}
            alt={`${user.name} avatar`}
            loading='lazy'
            className='size-9'
          />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className='flex flex-col'>
          <span className='font-medium'>{user.name}</span>
          <span className='text-muted-foreground truncate text-xs'>
            {user.email}
          </span>
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

const columns: ColumnDef<User>[] = [
  selectColumn,
  nameColumn,
  emailColumn,
  emailVerifiedColumn,
  createdAtColumn,
  actionsColumn,
];
