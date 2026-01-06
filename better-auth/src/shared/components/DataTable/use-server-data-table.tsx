'use client';

import {
  getCoreRowModel,
  useReactTable,
  type RowSelectionState,
  type VisibilityState,
} from '@tanstack/react-table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { TABLE_SEARCH_PARAMS } from './constants';
import type { DataTableBaseProps, DataTableServerProps } from './types';
import { createSortParam } from './utils';

export function useServerDataTable<TData, TValue>(
  props: DataTableBaseProps<TData, TValue> & DataTableServerProps
) {
  const {
    data,
    columns,
    rowCount,
    paginationState,
    sortingState,
    globalFilter,
  } = props;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    rowCount,
    state: {
      pagination: paginationState,
      sorting: sortingState,
      globalFilter,
      columnVisibility,
      rowSelection,
    },

    enableMultiSort: true,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,

    getCoreRowModel: getCoreRowModel(),

    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    onSortingChange: updater => {
      const nextSorting =
        typeof updater === 'function' ? updater(sortingState) : updater;

      const params = new URLSearchParams(searchParams);

      if (nextSorting.length > 0) {
        const sortParam = createSortParam(nextSorting);

        params.set(TABLE_SEARCH_PARAMS.sort, sortParam);
      } else {
        params.delete(TABLE_SEARCH_PARAMS.sort);
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },

    onGlobalFilterChange: updater => {
      const nextFilter =
        typeof updater === 'function' ? updater(globalFilter) : updater;

      const params = new URLSearchParams(searchParams);

      if (nextFilter) {
        params.set(TABLE_SEARCH_PARAMS.search, nextFilter);

        params.set(TABLE_SEARCH_PARAMS.pageIndex, '0');
      } else {
        params.delete(TABLE_SEARCH_PARAMS.search);
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },

    onPaginationChange: updater => {
      const next =
        typeof updater === 'function' ? updater(paginationState) : updater;
      const params = new URLSearchParams(searchParams);

      params.set(TABLE_SEARCH_PARAMS.pageIndex, next.pageIndex.toString());
      params.set(TABLE_SEARCH_PARAMS.pageSize, next.pageSize.toString());

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
  });

  return table;
}
