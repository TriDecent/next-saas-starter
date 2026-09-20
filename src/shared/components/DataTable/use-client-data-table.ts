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
import { useCallback, useState } from 'react';
import { TABLE_SEARCH_PARAMS } from './constants';
import type { DataTableBaseProps, DataTableClientProps } from './types';
import { createSortingState, createSortParam } from './utils';

export function useClientDataTable<TData, TValue>(
  props: DataTableBaseProps<TData, TValue> & DataTableClientProps
) {
  const { data, columns, defaultPageSize } = props;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [sorting, setSorting] = useState<SortingState>(() => {
    const sortParam = searchParams.get(TABLE_SEARCH_PARAMS.sort);
    if (!sortParam) return [];

    return createSortingState(sortParam);
  });

  const [pageSize, setPageSize] = useState<number>(() => {
    return (
      Number(searchParams.get(TABLE_SEARCH_PARAMS.pageSize)) || defaultPageSize
    );
  });

  const [pageIndex, setPageIndex] = useState<number>(() => {
    const page = Number(searchParams.get(TABLE_SEARCH_PARAMS.pageIndex));

    return page || page < 0 ? 0 : page;
  });

  const [globalFilter, setGlobalFilter] = useState<string>(() => {
    return searchParams.get(TABLE_SEARCH_PARAMS.search) ?? '';
  });

  const updateUrl = useCallback(
    (updates: Record<string, string>) => {
      const currentParams = new URLSearchParams(window.location.search);

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          currentParams.set(key, value);
          return;
        }

        currentParams.delete(key);
      });

      const newUrl = `${pathname}?${currentParams.toString()}`;
      window.history.replaceState(
        { ...window.history.state, as: newUrl, url: newUrl },
        '',
        newUrl
      );
    },
    [pathname]
  );

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

    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    onSortingChange: updater => {
      const nextSorting =
        typeof updater === 'function' ? updater(sorting) : updater;

      setSorting(nextSorting);

      const sortParam = createSortParam(nextSorting);

      updateUrl({ [TABLE_SEARCH_PARAMS.sort]: sortParam });
    },

    onGlobalFilterChange: updaterOrValue => {
      const nextValue =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(globalFilter)
          : updaterOrValue;

      setGlobalFilter(nextValue);
      setPageIndex(0);

      updateUrl({
        [TABLE_SEARCH_PARAMS.search]: nextValue,
        [TABLE_SEARCH_PARAMS.pageIndex]: '0',
      });
    },

    onPaginationChange: updater => {
      const next =
        typeof updater === 'function'
          ? updater({ pageSize, pageIndex })
          : updater;

      setPageSize(next.pageSize);
      setPageIndex(next.pageIndex);

      updateUrl({
        [TABLE_SEARCH_PARAMS.pageSize]: next.pageSize.toString(),
        [TABLE_SEARCH_PARAMS.pageIndex]: next.pageIndex.toString(),
      });
    },
  });

  return table;
}
