import type { TableSearchParams } from './schema';

export const DEFAULT_PAGE_INDEX = 0;
export const DEFAULT_PAGE_SIZE = 1;
export const TABLE_SEARCH_PARAMS = {
  pageIndex: 'tablePageIndex',
  pageSize: 'tablePageSize',
  search: 'tableSearch',
  sort: 'tableSort',
} as const satisfies Record<string, keyof TableSearchParams>;
