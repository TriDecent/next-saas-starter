import {
  createSudoToken,
  verifySudoToken,
} from '@/features/auth/authenticate-prior/sudo-mode';
import type { Session, User } from '@/generated/prisma/client';
import { auth, hasPermission } from '@/lib/auth';
import { defineAbilityFor, type CRUD, type UserActionTypes } from '@/lib/casl';
import { ROUTES } from '@/shared/constants';
import { APIError } from 'better-auth';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import { type IUserRepository } from '../../repositories';
import type { ServiceResponse } from '../types';
import type {
  AuthenticatePriorResponse,
  Enable2FAResponse,
  GeneralUserResponse,
  GenerateBackUpCodesResponse,
  GetUsersResponse,
} from './user-dtos';

export class UserService {
  constructor(
    private readonly _actor: User,
    private readonly _currentSession: Session,
    private readonly _repo: IUserRepository,
    private readonly _headers: ReadonlyHeaders
  ) {}

  get self() {
    return this._actor;
  }

  get currentSession() {
    return this._currentSession;
  }

  get headers() {
    return this._headers;
  }

  listMyAccounts() {
    return auth.api.listUserAccounts({ headers: this._headers });
  }

  listMyPasskey() {
    return auth.api.listPasskeys({ headers: this._headers });
  }

  listMySessions() {
    return auth.api.listSessions({ headers: this._headers });
  }

  async getUsers(
    pageIndex: number,
    pageSize: number,
    orderBy?: Record<string, 'asc' | 'desc'>[],
    keyword?: string
  ): Promise<GetUsersResponse> {
    const canListUsers = await hasPermission(this._actor.id, {
      user: ['list'],
    });

    if (!canListUsers)
      return {
        type: 'error',
        payload: { message: 'You do not have permission to list users.' },
      };

    const skip = pageIndex * pageSize;
    const { data, total } = await this._repo.getUsers(
      skip,
      pageSize,
      orderBy,
      keyword
    );

    return { type: 'success', payload: { users: data, total } };
  }

  toggleBanStatus(userId: User['id'], shouldBan: boolean) {
    return this.executeProtectedAction({
      targetUserId: userId,
      requiredRbac: { user: ['ban'] },
      abacAction: 'ban-user',
      permissionError: 'You do not have permission to ban/unban users.',
      action: () =>
        shouldBan
          ? auth.api.banUser({ body: { userId }, headers: this._headers })
          : auth.api.unbanUser({ body: { userId }, headers: this._headers }),
    });
  }

  revokeUser(userId: User['id']) {
    return this.executeProtectedAction({
      targetUserId: userId,
      requiredRbac: { session: ['revoke'] },
      abacAction: 'revoke-user',
      permissionError: 'You do not have permission to revoke sessions.',
      action: () =>
        auth.api.revokeUserSessions({
          body: { userId },
          headers: this._headers,
        }),
    });
  }

  deleteUser(userId: User['id']) {
    return this.executeProtectedAction({
      targetUserId: userId,
      requiredRbac: { user: ['delete'] },
      abacAction: 'delete',
      permissionError: 'You do not have permission to delete users.',
      action: () =>
        auth.api.removeUser({ body: { userId }, headers: this._headers }),
    });
  }

  impersonateUser(userId: User['id']) {
    return this.executeProtectedAction({
      targetUserId: userId,
      requiredRbac: { user: ['impersonate'] },
      abacAction: 'impersonate-user',
      permissionError: 'You do not have permission to impersonate users.',
      action: () =>
        auth.api.impersonateUser({ body: { userId }, headers: this._headers }),
    });
  }

  async stopImpersonate(): Promise<
    ServiceResponse<undefined, { message: string }>
  > {
    return this.runSafely(async () => {
      await auth.api.stopImpersonating({ headers: this._headers });
      return undefined;
    });
  }

  // deleteAccount handles two cases:
  // - No token: send confirmation email
  // - With token: perform account deletion

  // Note: Better Auth does not provide
  //       a separate method for sending only
  //       delete account verification
  async deleteAccount(token?: string): Promise<void> {
    try {
      await auth.api.deleteUser({
        headers: this._headers,
        body: { token, callbackURL: ROUTES.auth.href },
      });

      if (token) await auth.api.signOut({ headers: this._headers }); // prevent client session cache
    } catch (error) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  async revokeSessionWithToken(token: string): Promise<void> {
    try {
      await auth.api.revokeSession({ body: { token }, headers: this._headers });
    } catch (error) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  async authenticatePrior(
    password: string,
    totp?: string
  ): Promise<AuthenticatePriorResponse> {
    return this.runSafely(async () => {
      await auth.api.signInEmail({
        body: { email: this._actor.email, password },
        headers: this._headers,
      });

      if (this._actor.twoFactorEnabled && totp) {
        await auth.api.verifyTOTP({
          body: { code: totp },
          headers: this._headers,
        });
      }

      const sudoToken = await createSudoToken(this._actor.id);
      return { sudoToken };
    });
  }

  async updateProfile(
    {
      email,
      name,
      favoriteNumber,
    }: {
      email: string;
      name: string;
      favoriteNumber: number;
    },
    callbackURL: string
  ): Promise<GeneralUserResponse> {
    return this.runSafely(async () => {
      const promises = [
        auth.api.updateUser({
          body: { name, favoriteNumber },
          headers: this._headers,
        }),
      ];

      if (email !== this._actor.email) {
        promises.push(
          auth.api.changeEmail({
            body: { newEmail: email, callbackURL },
            headers: this._headers,
          })
        );
      }
      await Promise.all(promises);
      return undefined;
    });
  }

  async deletePasskey(
    passkeyId: string,
    sudoToken?: string
  ): Promise<GeneralUserResponse> {
    return this.runWithSudo(
      sudoToken,
      'You must re-authenticate to perform this action',
      async () => {
        await auth.api.deletePasskey({
          body: { id: passkeyId },
          headers: this._headers,
        });
        return undefined;
      }
    );
  }

  async changePassword(
    params: {
      currentPassword: string;
      newPassword: string;
      revokeOtherSessions?: boolean;
    },
    sudoToken?: string
  ): Promise<GeneralUserResponse> {
    return this.runWithSudo(
      sudoToken,
      'Please re-authenticate to change your password.',
      async () => {
        await auth.api.changePassword({
          body: params,
          headers: this._headers,
        });
        return undefined;
      }
    );
  }

  async disable2FA(
    password: string,
    sudoToken?: string
  ): Promise<GeneralUserResponse> {
    return this.runWithSudo(
      sudoToken,
      'You must re-authenticate to disable 2FA authentication.',
      async () => {
        await auth.api.disableTwoFactor({
          body: { password },
          headers: this._headers,
        });
        return undefined;
      }
    );
  }

  async enable2FA(
    password: string,
    sudoToken?: string
  ): Promise<Enable2FAResponse> {
    return this.runWithSudo(
      sudoToken,
      'You must re-authenticate to enable 2FA authentication.',
      async () =>
        auth.api.enableTwoFactor({
          body: { password },
          headers: this._headers,
        })
    );
  }

  async generateBackUpCodes({
    totpCode,
    password,
    trustDevice,
  }: {
    totpCode: string;
    password: string;
    trustDevice?: boolean;
  }): Promise<GenerateBackUpCodesResponse> {
    return this.runSafely(async () => {
      await auth.api.verifyTOTP({
        body: { code: totpCode, trustDevice },
        headers: this._headers,
      });

      const data = await auth.api.generateBackupCodes({
        body: { password },
        headers: this._headers,
      });

      return { backupCodes: data.backupCodes };
    });
  }

  private async runSafely<TSuccess>(
    operation: () => Promise<TSuccess>
  ): Promise<ServiceResponse<TSuccess, { message: string }>> {
    try {
      const data = await operation();
      return { type: 'success', payload: data };
    } catch (error) {
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

  private async runWithSudo<T>(
    token: string | undefined,
    errorMessage: string,
    operation: () => Promise<T>
  ): Promise<ServiceResponse<T, { message: string }>> {
    const isValid = token
      ? await verifySudoToken(token, this._actor.id)
      : false;

    return isValid
      ? this.runSafely(operation)
      : { type: 'error', payload: { message: errorMessage } };
  }

  private async runWithSudoWithExtraErrorReturn<TSuccess, TError>(
    token: string | undefined,
    errorMessage: string,
    operation: () => Promise<TSuccess>,
    extraErrorDetails: TError
  ): Promise<ServiceResponse<TSuccess, { message: string; more: TError }>> {
    const isValid = token
      ? await verifySudoToken(token, this._actor.id)
      : false;

    return isValid
      ? this.runSafelyWithExtraErrorReturn(operation, extraErrorDetails)
      : {
          type: 'error',
          payload: { message: errorMessage, more: extraErrorDetails },
        };
  }

  private async executeProtectedAction(params: {
    targetUserId: string;
    requiredRbac: Parameters<typeof hasPermission>[1];
    abacAction: UserActionTypes | CRUD;
    permissionError: string;
    action: () => Promise<unknown>;
  }): Promise<ServiceResponse<undefined, { message: string }>> {
    const { targetUserId, requiredRbac, abacAction, permissionError, action } =
      params;

    const hasRbac = await hasPermission(this._actor.id, requiredRbac);
    if (!hasRbac) {
      return { type: 'error', payload: { message: permissionError } };
    }

    const targetUser = await this._repo.findUnique({
      where: { id: targetUserId },
    });
    if (!targetUser)
      return { type: 'error', payload: { message: 'User not found.' } };

    const ability = defineAbilityFor(this._actor);
    if (ability.cannot(abacAction, { ...targetUser, kind: 'User' }))
      return {
        type: 'error',
        payload: {
          message: `You do not have permission to ${abacAction.replace(
            '-',
            ' '
          )} this user.`,
        },
      };

    return this.runSafely(async () => {
      await action();
      return undefined;
    });
  }

  private getErrorMessage(error: unknown): string {
    return error instanceof APIError || error instanceof Error
      ? error.message
      : 'Unknown error';
  }
}
