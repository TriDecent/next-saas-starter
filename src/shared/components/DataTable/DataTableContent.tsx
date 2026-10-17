'use no memo';

import { cn } from '@/shared/utils';
import { flexRender, Table as ReactTable } from '@tanstack/react-table';
import {
  ScrollArea,
  ScrollBar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui';

type DataTableContentProps<TData> = {
  table: ReactTable<TData>;
  headerClassName?: string;
};

export function DataTableContent<TData>({
  table,

  headerClassName,
}: DataTableContentProps<TData>) {
  return (
    <ScrollArea className='relative h-96 lg:h-144 xl:h-192'>
      <div className='**:data-[slot=table-container]:overflow-visible'>
        <Table className='select-none'>
          <TableHeader
            className={cn(
              `sticky top-0 z-10 backdrop-blur-sm`,
              headerClassName
            )}
          >
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={header.colSpan === 1 ? 'text-center' : ''}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className='text-center'>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllLeafColumns().length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
