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
