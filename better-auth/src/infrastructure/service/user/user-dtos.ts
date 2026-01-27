import type { User } from '@/generated/prisma/client';
import type { ServiceResponse } from '../types';

export type GetUsersResponse = ServiceResponse<
  { users: User[]; total: number },
  { message: string }
>;
export type AuthenticatePriorResponse = ServiceResponse<
  { sudoToken: string },
  { message: string }
>;
export type GeneralUserResponse = ServiceResponse<
  undefined,
  { message: string }
>;
export type Enable2FAResponse = ServiceResponse<
  {
    totpURI: string;
    backupCodes: string[];
  },
  { message: string }
>;
