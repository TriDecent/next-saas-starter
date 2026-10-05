import type { ServiceResponse } from '@/shared/types';

export type SignInResponse = ServiceResponse<
  { redirect?: string },
  { status?: 'EMAIL_NOT_VERIFIED'; email?: string; message: string }
>;

export type SignUpResponse = ServiceResponse<
  { name: string; email: string },
  { message: string }
>;

export type GeneralAuthResponse = ServiceResponse<void, { message: string }>;
