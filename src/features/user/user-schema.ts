import { UserSchema } from '@/shared/schema';
import z from 'zod';

export const GetUsersSchema = z.object({
  users: z.array(UserSchema),
  pagination: z.object({
    totalPages: z.number(),
    currentPage: z.number(),
    hasPreviousPage: z.coerce.boolean(),
    hasNextPage: z.coerce.boolean(),
    limit: z.coerce.number(),
    totalItems: z.coerce.number(),
  }),
});

export type GetUsersSchemaType = z.infer<typeof GetUsersSchema>;
