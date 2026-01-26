import { auth } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import { APIError } from 'better-auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import type {
  RequestResetPasswordResponse,
  SignInResponse,
  SignUpResponse,
} from './auth-dtos';

export class AuthService {
  constructor(private readonly _headers: ReadonlyHeaders) {}

  async signIn({
    email,
    password,
    rememberMe,
  }: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<SignInResponse> {
    try {
      const response = await auth.api.signInEmail({
        headers: this._headers,
        body: { email, password, rememberMe },
      });

      if (!('twoFactorRedirect' in response))
        return { type: 'success', payload: {} };

      const requestReferer = this._headers.get('referer');
      const requestUrl = requestReferer ? new URL(requestReferer) : undefined;
      const hasCallbackUrl = requestUrl?.searchParams.has('callbackUrl');

      return {
        type: 'success',
        payload: {
          redirect: hasCallbackUrl
            ? `${ROUTES.auth.nested['verify-2fa'].href}?${requestUrl!.searchParams.toString()}`
            : ROUTES.auth.nested['verify-2fa'].href,
        },
      };
    } catch (error) {
      if (isRedirectError(error)) throw error;

      const isEmailNotVerified =
        error instanceof APIError &&
        error.status === 'FORBIDDEN' &&
        error.statusCode === 403;

      return {
        type: 'error',
        payload: {
          status: isEmailNotVerified ? 'EMAIL_NOT_VERIFIED' : undefined,
          email: isEmailNotVerified ? email : undefined,
          message:
            error instanceof Error || error instanceof APIError
              ? error.message
              : 'Unknown error',
        },
      };
    }
  }

  async signUp({
    name,
    email,
    password,
    favoriteNumber,
  }: {
    name: string;
    email: string;
    password: string;
    favoriteNumber: number;
  }): Promise<SignUpResponse> {
    try {
      const signUpResult = await auth.api.signUpEmail({
        headers: this._headers,
        body: { name, email, password, favoriteNumber, welcomeSent: false },
      });

      return {
        type: 'success',
        payload: {
          name: signUpResult.user.name,
          email: signUpResult.user.email,
        },
      };
    } catch (error) {
      return {
        type: 'error',
        payload: {
          message:
            error instanceof Error || error instanceof APIError
              ? error.message
              : 'Unknown error',
        },
      };
    }
  }

  async requestResetPassword({
    email,
    redirectTo,
  }: {
    email: string;
    redirectTo: string;
  }): Promise<RequestResetPasswordResponse> {
    try {
      await auth.api.requestPasswordReset({
        body: { email, redirectTo },
      });

      return { type: 'success', payload: undefined };
    } catch (error) {
      return {
        type: 'error',
        payload: {
          message:
            error instanceof Error || error instanceof APIError
              ? error.message
              : 'Unknown error',
        },
      };
    }
  }
}
