import type { ServiceResult } from '@/shared/types';

export type SignInResult = ServiceResult<
  { redirect?: string },
  { status?: 'EMAIL_NOT_VERIFIED'; email?: string; message: string }
>;

export type SignUpResult = ServiceResult<
  { name: string; email: string },
  { message: string }
>;

export type AuthMutationResult = ServiceResult<void, { message: string }>;
