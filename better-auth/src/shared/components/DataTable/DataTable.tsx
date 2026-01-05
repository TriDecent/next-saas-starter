'use no memo';

import { DataTableContent } from './DataTableContent';
import { DataTablePagination } from './DataTablePagination';
import { DataTableViewOptions } from './DataTableViewOptions';
import type {
  DataTableBaseProps,
  DataTableClientProps,
  DataTableProps,
  DataTableServerProps,
} from './types';
import { useClientDataTable } from './use-client-data-table';
import { useServerDataTable } from './use-server-data-table';

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  if (props.mode === 'server') return <ServerDataTable {...props} />;

  return <ClientDataTable {...props} />;
}

function ClientDataTable<TData, TValue>(
  props: DataTableBaseProps<TData, TValue> & DataTableClientProps
) {
  const table = useClientDataTable(props);
  return (
    <DataTableContent table={table}>
      <div className='flex flex-col items-center justify-between gap-4 px-2 py-4 pb-4 sm:flex-row'>
        <DataTablePagination table={table} />
        <DataTableViewOptions table={table} />
      </div>

      {props.render?.(table)}
    </DataTableContent>
  );
}

function ServerDataTable<TData, TValue>(
  props: DataTableBaseProps<TData, TValue> & DataTableServerProps
) {
  const table = useServerDataTable(props);
  return (
    <DataTableContent table={table}>
      <div className='flex flex-col items-center justify-between gap-4 px-2 py-4 pb-4 sm:flex-row'>
        <DataTablePagination table={table} />
        <DataTableViewOptions table={table} />
      </div>
      {props.render?.(table)}
    </DataTableContent>
  );
}
