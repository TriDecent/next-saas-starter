import type { GetUsersParams } from '@/features/user/server';
import { apiClient } from '@/lib/client';
import { ROUTES } from '@/shared/constants';
import { PAGINATION_DEFAULTS } from '@/shared/utils';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { GetUsersSchema } from '../user-schema';
import { USER_QUERY_KEYS } from './user-keys';

export function getUsersQueryOptions(params?: GetUsersParams) {
  return queryOptions({
    queryKey: USER_QUERY_KEYS.list(params),
    queryFn: () => fetchUsers(params),
  });
}

export function getUsersInfiniteQueryOptions(
  params?: Omit<GetUsersParams, 'page'>
) {
  return infiniteQueryOptions({
    queryKey: USER_QUERY_KEYS.infinite(params),
    queryFn: ({ pageParam }) =>
      fetchUsers({
        ...params,
        page: pageParam,
        limit: params?.limit ?? PAGINATION_DEFAULTS.limit,
      }),
    initialPageParam: Number(PAGINATION_DEFAULTS.page),
    getNextPageParam: lastPage =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
    getPreviousPageParam: firstPage =>
      firstPage.pagination.currentPage > 1
        ? firstPage.pagination.currentPage - 1
        : undefined,
  });
}

async function fetchUsers(params?: GetUsersParams) {
  const searchParams = params
    ? new URLSearchParams(
        params.keyword
          ? {
              page: params.page.toString(),
              limit: params.limit.toString(),
              keyword: params.keyword,
            }
          : { page: params.page.toString(), limit: params.limit.toString() }
      )
    : undefined;
  const { data } = await apiClient.get(
    `${ROUTES.api.users.href}?${searchParams}`
  );
  const parsed = GetUsersSchema.parse(data);

  return parsed;
}
