import { AppPolicy } from '@/features/authorization/core';
import type { Session, User } from '@/generated/prisma/client';
import type { IBaseExecutor } from '@/infrastructure/executors';
import { auth } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import { APIError } from 'better-auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import type {
  AuthMutationResult,
  SignInResult,
  SignUpResult,
} from './auth-dtos';

export class AuthService {
  constructor(
    private readonly _executor: IBaseExecutor,
    private readonly _headers: Headers,
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
  }): Promise<SignInResult> {
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
        payload: { message: this._executor.getErrorMessage(error) },
      };
    }
  }

  signUp(params: {
    name: string;
    email: string;
    password: string;
    favoriteNumber: number;
  }): Promise<SignUpResult> {
    return this._executor.runSafely(
      async () => {
        const { user } = await auth.api.signUpEmail({
          headers: this._headers,
          body: { ...params, welcomeSent: false },
        });

        return { name: user.name, email: user.email };
      },
      error => ({ message: error })
    );
  }

  requestResetPassword({
    email,
    redirectTo,
  }: {
    email: string;
    redirectTo: string;
  }): Promise<AuthMutationResult> {
    return this._executor.runSafely(
      async () => {
        await auth.api.requestPasswordReset({ body: { email, redirectTo } });
      },
      error => ({ message: error })
    );
  }

  resetPassword(
    token: string,
    newPassword: string
  ): Promise<AuthMutationResult> {
    return this._executor.runSafely(
      async () => {
        await auth.api.resetPassword({
          headers: this._headers,
          body: { token, newPassword },
        });
      },
      error => ({ message: error })
    );
  }

  verifyBackupCode(
    code: string,
    trustDevice?: boolean
  ): Promise<AuthMutationResult> {
    return this._executor.runSafely(
      async () => {
        // Format code: XXXXX-XXXXX
        const formattedCode = code.slice(0, 5) + '-' + code.slice(5);

        await auth.api.verifyBackupCode({
          headers: this._headers,
          body: { code: formattedCode, trustDevice },
        });
      },
      error => ({ message: error })
    );
  }

  async sendVerificationEmail({
    email,
    callbackURL,
  }: {
    email: string;
    callbackURL: string;
  }): Promise<AuthMutationResult> {
    if (this._actor && this._actor.email !== email) {
      return {
        type: 'error',
        payload: {
          message: 'You can only send verification emails to your own email.',
        },
      };
    }

    return this._executor.runSafely(
      async () => {
        await auth.api.sendVerificationEmail({
          body: { email, callbackURL },
        });
      },
      error => ({ message: error })
    );
  }

  verifyTOTP({
    code,
    trustDevice,
  }: {
    code: string;
    trustDevice?: boolean;
  }): Promise<AuthMutationResult> {
    return this._executor.runSafely(
      async () => {
        // actor shouldn't be undefined here,
        // because this method is only called after the user has signed in and is authenticated
        if (!AppPolicy.getUserPolicyFor(this._actor!).canEnable2FA())
          throw new Error('You do not have permission to enable 2FA.');

        await auth.api.verifyTOTP({
          body: { code, trustDevice },
          headers: this._headers,
        });
      },
      error => ({ message: error })
    );
  }

  private get2FARedirectUrl(): string {
    const requestReferer = this._headers.get('referer');
    const requestUrl = requestReferer ? new URL(requestReferer) : undefined;
    const hasCallbackUrl = requestUrl?.searchParams.has('callbackUrl');

    return hasCallbackUrl
      ? `${ROUTES.auth.nested['verify-2fa'].href}?${requestUrl!.searchParams.toString()}`
      : ROUTES.auth.nested['verify-2fa'].href;
  }
}
