import type { ServiceResponse } from '../types';

export type SignInResponse = ServiceResponse<
  { redirect?: string },
  { status?: 'EMAIL_NOT_VERIFIED'; email?: string; message: string }
>;

export type SignUpResponse = ServiceResponse<
  { name: string; email: string },
  { message: string }
>;

export type RequestResetPasswordResponse = ServiceResponse<
  undefined,
  { message: string }
>;
