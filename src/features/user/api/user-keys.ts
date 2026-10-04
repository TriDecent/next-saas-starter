import type { GetUsersParams } from '@/services';

export const USER_QUERY_KEYS = {
  all: ['users'] as const,
  lists: () => [...USER_QUERY_KEYS.all, 'list'] as const,
  list: (params?: GetUsersParams) =>
    params
      ? ([...USER_QUERY_KEYS.lists(), params] as const)
      : USER_QUERY_KEYS.lists(),
} as const;
