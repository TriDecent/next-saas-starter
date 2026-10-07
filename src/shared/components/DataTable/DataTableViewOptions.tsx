'use no memo';

import type { Table } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui';

export function DataTableViewOptions<TData>({
  table,
}: {
  table: Table<TData>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant='outline' size='sm' className='h-8 lg:flex'>
            <Settings2 />
            View
          </Button>
        }
      />
      <DropdownMenuContent align='end' className='w-37.5'>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllLeafColumns()
            .filter(
              column =>
                typeof column.accessorFn !== 'undefined' && column.getCanHide()
            )
            .map(column => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className='capitalize'
                  checked={column.getIsVisible()}
                  onCheckedChange={value => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
