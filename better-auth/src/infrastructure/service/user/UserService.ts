import {
  createSudoToken,
  verifySudoToken,
} from '@/features/auth/authenticate-prior/sudo-mode';
import type { User } from '@/generated/prisma/client';
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
    private readonly _repo: IUserRepository,
    private readonly _headers: ReadonlyHeaders
  ) {}

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
      action: () =>
        shouldBan
          ? auth.api.banUser({ body: { userId }, headers: this._headers })
          : auth.api.unbanUser({ body: { userId }, headers: this._headers }),
      permissionError: 'You do not have permission to ban/unban users.',
    });
  }

  revokeUser(userId: User['id']) {
    return this.executeProtectedAction({
      targetUserId: userId,
      requiredRbac: { session: ['revoke'] },
      abacAction: 'revoke-user',
      action: () =>
        auth.api.revokeUserSessions({
          body: { userId },
          headers: this._headers,
        }),
      permissionError: 'You do not have permission to revoke sessions.',
    });
  }

  deleteUser(userId: User['id']) {
    return this.executeProtectedAction({
      targetUserId: userId,
      requiredRbac: { user: ['delete'] },
      abacAction: 'delete',
      action: () =>
        auth.api.removeUser({ body: { userId }, headers: this._headers }),
      permissionError: 'You do not have permission to delete users.',
    });
  }

  impersonateUser(userId: User['id']) {
    return this.executeProtectedAction({
      targetUserId: userId,
      requiredRbac: { user: ['impersonate'] },
      abacAction: 'impersonate-user',
      action: () =>
        auth.api.impersonateUser({ body: { userId }, headers: this._headers }),
      permissionError: 'You do not have permission to impersonate users.',
    });
  }

  async stopImpersonate(): Promise<
    ServiceResponse<undefined, { message: string }>
  > {
    try {
      await auth.api.stopImpersonating({ headers: this._headers });

      return { type: 'success', payload: undefined };
    } catch (error) {
      return {
        type: 'error',
        payload: {
          message:
            error instanceof APIError || error instanceof Error
              ? error.message
              : 'Unknown error',
        },
      };
    }
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
      throw new Error(
        error instanceof APIError ? error.message : 'Unknown error'
      );
    }
  }

  async authenticatePrior(
    password: string,
    totp?: string
  ): Promise<AuthenticatePriorResponse> {
    try {
      await auth.api.signInEmail({
        body: { email: this._actor.email, password },
        headers: this._headers,
      });

      if (this._actor.twoFactorEnabled && totp)
        await auth.api.verifyTOTP({
          body: { code: totp },
          headers: this._headers,
        });

      const sudoToken = await createSudoToken(this._actor.id);

      return { type: 'success', payload: { sudoToken } };
    } catch (error) {
      return {
        type: 'error',
        payload: {
          message:
            error instanceof APIError || error instanceof Error
              ? error.message || 'Unknown error'
              : 'Unknown error',
        },
      };
    }
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
    try {
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

  async deletePasskey(
    passkeyId: string,
    sudoToken?: string | undefined
  ): Promise<GeneralUserResponse> {
    if (!sudoToken || !this.validateSudoToken(sudoToken))
      return {
        type: 'error',
        payload: { message: 'You must re-authenticate to perform this action' },
      };

    try {
      await auth.api.deletePasskey({
        body: { id: passkeyId },
        headers: this._headers,
      });

      return { type: 'success', payload: undefined };
    } catch (error) {
      return {
        type: 'error',
        payload: {
          message:
            error instanceof APIError || error instanceof Error
              ? error.message || 'Unknown error'
              : 'Unknown error',
        },
      };
    }
  }

  async changePassword(
    {
      currentPassword,
      newPassword,
      revokeOtherSessions,
    }: {
      currentPassword: string;
      newPassword: string;
      revokeOtherSessions?: boolean;
    },
    sudoToken?: string | undefined
  ): Promise<GeneralUserResponse> {
    if (!sudoToken || !this.validateSudoToken(sudoToken))
      return {
        type: 'error',
        payload: { message: 'Please re-authenticate to change your password.' },
      };

    try {
      await auth.api.changePassword({
        body: { currentPassword, newPassword, revokeOtherSessions },
        headers: this._headers,
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

  async disable2FA(
    password: string,
    sudoToken?: string
  ): Promise<GeneralUserResponse> {
    if (!sudoToken || !this.validateSudoToken(sudoToken))
      return {
        type: 'error',
        payload: {
          message: 'You must re-authenticate to disable 2FA authentication.',
        },
      };

    try {
      await auth.api.disableTwoFactor({
        body: { password },
        headers: this._headers,
      });

      return { type: 'success', payload: undefined };
    } catch (error) {
      return {
        type: 'error',
        payload: {
          message:
            error instanceof APIError || error instanceof Error
              ? error.message || 'Unknown error'
              : 'Unknown error',
        },
      };
    }
  }

  async enable2FA(
    password: string,
    sudoToken?: string
  ): Promise<Enable2FAResponse> {
    if (!sudoToken || !this.validateSudoToken(sudoToken))
      return {
        type: 'error',
        payload: {
          message: 'You must re-authenticate to enable 2FA authentication.',
        },
      };

    try {
      const data = await auth.api.enableTwoFactor({
        body: { password },
        headers: this._headers,
      });

      return { type: 'success', payload: data };
    } catch (error) {
      return {
        type: 'error',
        payload: {
          message:
            error instanceof APIError || error instanceof Error
              ? error.message || 'Unknown error'
              : 'Unknown error',
        },
      };
    }
  }

  async verifyTOTP({
    code,
    trustDevice,
  }: {
    code: string;
    trustDevice?: boolean;
  }): Promise<GeneralUserResponse> {
    try {
      await auth.api.verifyTOTP({
        body: { code, trustDevice },
        headers: this._headers,
      });

      return { type: 'success', payload: undefined };
    } catch (error) {
      return {
        type: 'error',
        payload: {
          message:
            error instanceof APIError || error instanceof Error
              ? error.message || 'Unknown error'
              : 'Unknown error',
        },
      };
    }
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
    try {
      await auth.api.verifyTOTP({
        body: { code: totpCode, trustDevice },
        headers: this._headers,
      });

      const data = await auth.api.generateBackupCodes({
        body: { password },
        headers: this._headers,
      });

      return { type: 'success', payload: { backupCodes: data.backupCodes } };
    } catch (error) {
      return {
        type: 'error',
        payload: {
          message:
            error instanceof APIError || error instanceof Error
              ? error.message || 'Unknown error'
              : 'Unknown error',
        },
      };
    }
  }

  private async validateSudoToken(token: string): Promise<boolean> {
    return !!(await verifySudoToken(token, this._actor.id));
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
    if (!hasRbac)
      return { type: 'error', payload: { message: permissionError } };

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
          message: `You do not have permission to ${abacAction.replace('-', ' ')} this user.`,
        },
      };

    try {
      await action();
      return { type: 'success', payload: undefined };
    } catch (error) {
      return {
        type: 'error',
        payload: {
          message:
            error instanceof APIError || error instanceof Error
              ? error.message
              : 'Unknown error',
        },
      };
    }
  }
}
