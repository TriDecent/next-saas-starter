import type { GetUsersParams } from '@/features/user/server';

export const USER_QUERY_KEYS = {
  all: ['users'] as const,
  lists: () => [...USER_QUERY_KEYS.all, 'list'] as const,
  list: (params?: GetUsersParams) =>
    params
      ? ([...USER_QUERY_KEYS.lists(), params] as const)
      : USER_QUERY_KEYS.lists(),
  infinite: (params?: Omit<GetUsersParams, 'page'>) =>
    params
      ? ([...USER_QUERY_KEYS.all, 'infinite', params] as const)
      : ([...USER_QUERY_KEYS.all, 'infinite'] as const),
} as const;
