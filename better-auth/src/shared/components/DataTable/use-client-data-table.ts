'use client';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { TABLE_SEARCH_PARAMS } from './constants';
import type { DataTableBaseProps, DataTableClientProps } from './types';

export function useClientDataTable<TData, TValue>(
  props: DataTableBaseProps<TData, TValue> & DataTableClientProps
) {
  const { data, columns, defaultPageSize } = props;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [pageSize, setPageSize] = useState<number>(() => {
    return (
      Number(searchParams.get(TABLE_SEARCH_PARAMS.pageSize)) || defaultPageSize
    );
  });

  const [pageIndex, setPageIndex] = useState<number>(() => {
    const page = Number(searchParams.get(TABLE_SEARCH_PARAMS.pageIndex));
    return isNaN(page) || page < 0 ? 0 : page;
  });

  const [globalFilter, setGlobalFilter] = useState<string>(() => {
    return searchParams.get(TABLE_SEARCH_PARAMS.search) ?? '';
  });

  const table = useReactTable({
    data,
    columns,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: { pageSize, pageIndex },
      globalFilter,
    },

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    onGlobalFilterChange: updaterOrValue => {
      const nextValue =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(globalFilter)
          : updaterOrValue;

      setGlobalFilter(nextValue);
      setPageIndex(0);

      const params = new URLSearchParams(searchParams.toString());

      if (nextValue) {
        params.set(TABLE_SEARCH_PARAMS.search, String(nextValue));
      } else {
        params.delete(TABLE_SEARCH_PARAMS.search);
      }

      params.set(TABLE_SEARCH_PARAMS.pageIndex, '0');

      const newUrl = `${pathname}?${params.toString()}`;
      history.replaceState(
        { ...history.state, as: newUrl, url: newUrl },
        '',
        newUrl
      );
    },

    onPaginationChange: updater => {
      const next =
        typeof updater === 'function'
          ? updater({ pageSize, pageIndex })
          : updater;

      setPageSize(next.pageSize);
      if (next.pageIndex !== pageIndex) setPageIndex(next.pageIndex);

      const params = new URLSearchParams(searchParams.toString());
      params.set(TABLE_SEARCH_PARAMS.pageIndex, next.pageIndex.toString());
      params.set(TABLE_SEARCH_PARAMS.pageSize, next.pageSize.toString());
      const newUrl = `${pathname}?${params.toString()}`;
      history.replaceState(
        { ...history.state, as: newUrl, url: newUrl },
        '',
        newUrl
      );
    },
  });

  return table;
}
