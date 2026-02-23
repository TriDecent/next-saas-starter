import type { Session, User } from '@/generated/prisma/client';
import { auth } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import { APIError } from 'better-auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import type { ServiceResponse } from '../types';
import type {
  GeneralAuthResponse,
  SignInResponse,
  SignUpResponse,
} from './auth-dtos';

export class AuthService {
  constructor(
    private readonly _headers: ReadonlyHeaders,
    private readonly _actor?: User,
    private readonly _currentSession?: Session
  ) {}

  get actor() {
    return this._actor;
  }

  get currentSession() {
    return this._currentSession;
  }

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

      return {
        type: 'success',
        payload: { redirect: this.get2FARedirectUrl() },
      };
    } catch (error) {
      if (isRedirectError(error)) throw error;

      if (
        error instanceof APIError &&
        error.status === 'FORBIDDEN' &&
        error.statusCode === 403
      ) {
        return {
          type: 'error',
          payload: {
            status: 'EMAIL_NOT_VERIFIED',
            email: email,
            message: error.message,
          },
        };
      }

      return {
        type: 'error',
        payload: { message: this.getErrorMessage(error) },
      };
    }
  }

  signUp(params: {
    name: string;
    email: string;
    password: string;
    favoriteNumber: number;
  }): Promise<SignUpResponse> {
    return this.runSafely(async () => {
      const { user } = await auth.api.signUpEmail({
        headers: this._headers,
        body: { ...params, welcomeSent: false },
      });

      return { name: user.name, email: user.email };
    });
  }

  requestResetPassword({
    email,
    redirectTo,
  }: {
    email: string;
    redirectTo: string;
  }): Promise<GeneralAuthResponse> {
    return this.runSafely(async () => {
      await auth.api.requestPasswordReset({ body: { email, redirectTo } });
      return undefined;
    });
  }

  resetPassword(
    token: string,
    newPassword: string
  ): Promise<GeneralAuthResponse> {
    return this.runSafely(async () => {
      await auth.api.resetPassword({
        headers: this._headers,
        body: { token, newPassword },
      });
      return undefined;
    });
  }

  verifyBackupCode(
    code: string,
    trustDevice?: boolean
  ): Promise<GeneralAuthResponse> {
    return this.runSafely(async () => {
      // Format code: XXXXX-XXXXX
      const formattedCode = code.slice(0, 5) + '-' + code.slice(5);

      await auth.api.verifyBackupCode({
        headers: this._headers,
        body: { code: formattedCode, trustDevice },
      });
      return undefined;
    });
  }

  async sendVerificationEmail({
    email,
    callbackURL,
  }: {
    email: string;
    callbackURL: string;
  }): Promise<GeneralAuthResponse> {
    if (this._actor && this._actor.email !== email) {
      return {
        type: 'error',
        payload: {
          message: 'You can only send verification emails to your own email.',
        },
      };
    }

    return this.runSafely(async () => {
      await auth.api.sendVerificationEmail({
        body: { email, callbackURL },
      });
      return undefined;
    });
  }

  verifyTOTP({
    code,
    trustDevice,
  }: {
    code: string;
    trustDevice?: boolean;
  }): Promise<GeneralAuthResponse> {
    return this.runSafely(async () => {
      await auth.api.verifyTOTP({
        body: { code, trustDevice },
        headers: this._headers,
      });
      return undefined;
    });
  }

  private async runSafely<T>(
    operation: () => Promise<T>
  ): Promise<ServiceResponse<T, { message: string }>> {
    try {
      const data = await operation();
      return { type: 'success', payload: data };
    } catch (error) {
      if (isRedirectError(error)) throw error;
      return {
        type: 'error',
        payload: { message: this.getErrorMessage(error) },
      };
    }
  }

  private async runSafelyWithExtraErrorReturn<TSuccess, TError>(
    operation: () => Promise<TSuccess>,
    extraErrorDetails: TError
  ): Promise<ServiceResponse<TSuccess, { message: string; more: TError }>> {
    try {
      const data = await operation();
      return { type: 'success', payload: data };
    } catch (error) {
      return {
        type: 'error',
        payload: {
          message: this.getErrorMessage(error),
          more: extraErrorDetails,
        },
      };
    }
  }

  private get2FARedirectUrl(): string {
    const requestReferer = this._headers.get('referer');
    const requestUrl = requestReferer ? new URL(requestReferer) : undefined;
    const hasCallbackUrl = requestUrl?.searchParams.has('callbackUrl');

    return hasCallbackUrl
      ? `${ROUTES.auth.nested['verify-2fa'].href}?${requestUrl!.searchParams.toString()}`
      : ROUTES.auth.nested['verify-2fa'].href;
  }

  private getErrorMessage(error: unknown): string {
    return error instanceof APIError || error instanceof Error
      ? error.message
      : 'Unknown error';
  }
}
