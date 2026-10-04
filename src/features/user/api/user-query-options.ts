import { apiClient } from '@/lib/client';
import type { GetUsersParams } from '@/services';
import { ROUTES } from '@/shared/constants';
import { queryOptions } from '@tanstack/react-query';
import { GetUsersSchema } from '../user-schema';
import { USER_QUERY_KEYS } from './user-keys';

export function getUsersQueryOptions(params?: GetUsersParams) {
  return queryOptions({
    queryKey: USER_QUERY_KEYS.list(params),
    queryFn: () => fetchUsers(params),
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
