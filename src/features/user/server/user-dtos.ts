import type { Prisma, User } from '@/generated/prisma/client';
import type { Pagination } from '@/shared/pagination';
import type { ServiceResult } from '@/shared/types';

export type ListUsersQuery = {
  page: number;
  limit: number;
  orderBy?: Prisma.UserOrderByWithRelationInput[];
  keyword?: string;
};
export type ListUsersResult = ServiceResult<ListUsersData, { message: string }>;
export type ListUsersData = { users: User[]; pagination: Pagination };
export type GetUserByIdResult = ServiceResult<User | null, { message: string }>;
export type AuthenticatePriorResult = ServiceResult<
  { sudoToken: string },
  { message: string }
>;
export type UserMutationResult = ServiceResult<void, { message: string }>;
export type Enable2FAResult = ServiceResult<
  {
    totpURI: string;
    backupCodes: string[];
  },
  { message: string }
>;
export type GenerateBackUpCodesResult = ServiceResult<
  { backupCodes: string[] },
  { message: string }
>;
