'use client';

import type { User } from '@/generated/prisma/client';
import {
  DataTable,
  type DataTableServerProps,
} from '@/shared/components/DataTable';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/shared/components/ui';
import type { Table } from '@tanstack/react-table';
import { useRef } from 'react';
import { IoSearch } from 'react-icons/io5';
import { columns } from './columns';

export function UsersTable(props: {
  users: User[];
  total: number;
  paginationState: DataTableServerProps['paginationState'];
  sortingState: DataTableServerProps['sortingState'];
  globalFilter: DataTableServerProps['globalFilter'];
}) {
  return (
    <div className='rounded-lg border p-2'>
      <DataTable
        mode='server'
        headerClassName='shadow-sm'
        columns={columns}
        data={props.users}
        rowCount={props.total}
        {...props}
        render={table => <SearchUsers table={table} />}
      />
    </div>
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
