import { UserSchema } from '@/features/user/schema';
import { PaginationSchema } from '@/shared/pagination';
import { z } from 'zod';

export const GetUsersSchema = z.object({
  users: z.array(UserSchema),
  pagination: PaginationSchema,
});

export type GetUsersSchemaType = z.infer<typeof GetUsersSchema>;
