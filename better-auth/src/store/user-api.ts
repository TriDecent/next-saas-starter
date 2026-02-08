import { userSchema } from '@/shared/schema';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import z from 'zod';

type UserQuery = { keyword: string };

const getUsersSchema = z.object({
  users: z.array(
    userSchema.extend({
      createdAt: z.string(),
      updatedAt: z.string(),
      banExpires: z.string().nullable(),
    })
  ),
  total: z.coerce.number(),
});

type GetUsersSchema = z.infer<typeof getUsersSchema>;

export const userApi = createApi({
  reducerPath: 'auth-api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['User'],
  endpoints: builder => ({
    getUsers: builder.query<GetUsersSchema, UserQuery>({
      query: (query: UserQuery) => {
        const searchParams = new URLSearchParams({
          ...query,
        });

        return {
          url: `users?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      transformResponse: response => getUsersSchema.parse(response),
      providesTags: result =>
        result
          ? [
              { type: 'User', id: 'LIST' },
              ...result.users.map(item => ({
                type: 'User' as const,
                id: item.id,
              })),
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
  }),
});
export const { useGetUsersQuery, useLazyGetUsersQuery } = userApi;
