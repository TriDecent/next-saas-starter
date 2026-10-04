import type { Prisma, User } from '@/generated/prisma/client';
import type { Pagination } from '@/shared/utils';
import type { ServiceResponse } from '../types';

export type GetUsersParams = {
  page: number;
  limit: number;
  orderBy?: Prisma.UserOrderByWithRelationInput[];
  keyword?: string;
};
export type GetUsersResponse = ServiceResponse<GetUsersSuccess, GetUsersError>;
export type GetUsersSuccess = { users: User[]; pagination: Pagination };
export type GetUsersError = { message: string };
export type GetUserByIdResponse = ServiceResponse<
  User | null,
  { message: string }
>;
export type AuthenticatePriorResponse = ServiceResponse<
  { sudoToken: string },
  { message: string }
>;
export type GeneralUserResponse = ServiceResponse<void, { message: string }>;
export type Enable2FAResponse = ServiceResponse<
  {
    totpURI: string;
    backupCodes: string[];
  },
  { message: string }
>;
export type GenerateBackUpCodesResponse = ServiceResponse<
  { backupCodes: string[] },
  { message: string }
>;
