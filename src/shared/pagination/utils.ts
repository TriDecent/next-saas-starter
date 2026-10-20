import type { Pagination } from './schema';

export function buildPagination({
  totalItems,
  currentPage,
  limit,
}: Pick<Pagination, 'totalItems' | 'currentPage' | 'limit'>): Pagination {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    currentPage,
    limit,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    totalPages,
    totalItems,
  } as const;
}

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 5,
  maxLimit: 100,
} as const;
