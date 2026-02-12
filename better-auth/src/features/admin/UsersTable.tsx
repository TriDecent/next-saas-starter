'use client';

import type { User } from '@/generated/prisma/client';
import {
  DataTable,
  type DataTableServerProps,
} from '@/shared/components/DataTable';
import {
  AlertDialog,
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/shared/components/ui';
import type { Table } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { FiRefreshCcw } from 'react-icons/fi';
import { IoSearch } from 'react-icons/io5';
import { useColumns } from './columns';

export function UsersTable(props: {
  users: User[];
  total: number;
  paginationState: DataTableServerProps['paginationState'];
  sortingState: DataTableServerProps['sortingState'];
  globalFilter: DataTableServerProps['globalFilter'];
}) {
  const columns = useColumns();

  return (
    <div className='rounded-lg border p-2'>
      <AlertDialog>
        <DataTable
          mode='server'
          headerClassName='shadow-sm'
          columns={columns}
          data={props.users}
          rowCount={props.total}
          {...props}
          render={table => (
            <div className='flex flex-row items-center justify-between gap-x-4'>
              <SearchUsers table={table} />
              <RefreshTable />
            </div>
          )}
        />
      </AlertDialog>
    </div>
  );
}

function RefreshTable() {
  const router = useRouter();

  return (
    <Button
      size={'icon-sm'}
      variant={'outline'}
      onClick={() => router.refresh()}
    >
      <FiRefreshCcw />
    </Button>
  );
}

function SearchUsers({ table }: { table: Table<User> }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchUsers = () => {
    if (!inputRef.current) return;
    table.setGlobalFilter(inputRef.current.value);
  };

  return (
    <InputGroup>
      <InputGroupAddon>
        <IoSearch />
      </InputGroupAddon>
      <InputGroupInput
        id='search-user'
        onKeyDown={e => {
          if (e.key === 'Enter') handleSearchUsers();
        }}
        defaultValue={table.getState().globalFilter}
        ref={inputRef}
        placeholder='Search users by id, name, or email..'
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
