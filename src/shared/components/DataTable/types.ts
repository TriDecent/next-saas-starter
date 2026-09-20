import type {
  ColumnDef,
  PaginationState,
  SortingState,
  Table,
} from '@tanstack/react-table';
import type { JSX } from 'react';

export type DataTableBaseProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  render?: (table: Table<TData>) => JSX.Element;

  headerClassName?: string;
};

export type DataTableClientProps = {
  mode: 'client';
  defaultPageSize: number;
};

export type DataTableServerProps = {
  mode: 'server';
  rowCount: number;
  paginationState: PaginationState;
  sortingState: SortingState;
  globalFilter: string;
};

export type DataTableProps<TData, TValue> = DataTableBaseProps<TData, TValue> &
  (DataTableClientProps | DataTableServerProps);
