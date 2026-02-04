import { createSudoToken } from '@/features/auth/authenticate-prior/sudo-mode';
import type { Session, User } from '@/generated/prisma/client';
import { auth, hasPermission, type UserRole } from '@/lib/auth';
import { defineAbilityFor } from '@/lib/casl';
import { ROUTES } from '@/shared/constants';
import type { IServiceExecutor } from '../ServiceExecutor';
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
    private readonly _serviceExecutor: IServiceExecutor,
    private readonly _currentSession: Session
  ) {}

  get actor() {
    return this._serviceExecutor.actor;
  }

  get headers() {
    return this._serviceExecutor.headers;
  }

  get currentSession() {
    return this._currentSession;
  }

  listMyAccounts() {
    return auth.api.listUserAccounts({ headers: this.headers });
  }

  listMyPasskey() {
    return auth.api.listPasskeys({ headers: this.headers });
  }

  listMySessions() {
    return auth.api.listSessions({ headers: this.headers });
  }

  async getUsers(
    pageIndex: number,
    pageSize: number,
    orderBy?: Record<string, 'asc' | 'desc'>[],
    keyword?: string
  ): Promise<GetUsersResponse> {
    const canListUsers = await hasPermission(this.actor.id, {
      user: ['list'],
    });

    if (!canListUsers)
      return {
        type: 'error',
        payload: { message: 'You do not have permission to list users.' },
      };

    const skip = pageIndex * pageSize;
    const { data, total } = await this.repo.getUsers(
      skip,
      pageSize,
      orderBy,
      keyword
    );

    return { type: 'success', payload: { users: data, total } };
  }

  toggleBanStatus(userId: User['id'], shouldBan: boolean) {
    return this._serviceExecutor.executeProtectedAction({
      targetUserId: userId,
      requiredRbac: { user: ['ban'] },
      abacAction: 'ban-user',
      permissionError: 'You do not have permission to ban/unban users.',
      action: () =>
        shouldBan
          ? auth.api.banUser({ body: { userId }, headers: this.headers })
          : auth.api.unbanUser({ body: { userId }, headers: this.headers }),
    });
  }

  revokeUser(userId: User['id']) {
    return this._serviceExecutor.executeProtectedAction({
      targetUserId: userId,
      requiredRbac: { session: ['revoke'] },
      abacAction: 'revoke-user',
      permissionError: 'You do not have permission to revoke sessions.',
      action: () =>
        auth.api.revokeUserSessions({
          body: { userId },
          headers: this.headers,
        }),
    });
  }

  deleteUser(userId: User['id']) {
    return this._serviceExecutor.executeProtectedAction({
      targetUserId: userId,
      requiredRbac: { user: ['delete'] },
      abacAction: 'delete',
      permissionError: 'You do not have permission to delete users.',
      action: () =>
        auth.api.removeUser({ body: { userId }, headers: this.headers }),
    });
  }

  impersonateUser(userId: User['id']) {
    return this._serviceExecutor.executeProtectedAction({
      targetUserId: userId,
      requiredRbac: { user: ['impersonate'] },
      abacAction: 'impersonate-user',
      permissionError: 'You do not have permission to impersonate users.',
      action: () =>
        auth.api.impersonateUser({ body: { userId }, headers: this.headers }),
    });
  }

  stopImpersonate(): Promise<ServiceResponse<undefined, { message: string }>> {
    return this._serviceExecutor.runSafely(async () => {
      await auth.api.stopImpersonating({ headers: this.headers });
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
        headers: this.headers,
        body: { token, callbackURL: ROUTES.auth.href },
      });

      if (token) await auth.api.signOut({ headers: this.headers }); // prevent client session cache
    } catch (error) {
      throw new Error(this._serviceExecutor.getErrorMessage(error));
    }
  }

  async revokeSessionWithToken(token: string): Promise<void> {
    try {
      await auth.api.revokeSession({ body: { token }, headers: this.headers });
    } catch (error) {
      throw new Error(this._serviceExecutor.getErrorMessage(error));
    }
  }

  authenticatePrior(
    password: string,
    totp?: string
  ): Promise<AuthenticatePriorResponse> {
    return this._serviceExecutor.runSafely(async () => {
      await auth.api.verifyPassword({
        body: { password },
        headers: this.headers,
      });

      if (this.actor.twoFactorEnabled && totp) {
        await auth.api.verifyTOTP({
          body: { code: totp },
          headers: this.headers,
        });
      }

      const sudoToken = await createSudoToken(this.actor.id);
      return { sudoToken };
    });
  }

  updateProfile(
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
    return this._serviceExecutor.runSafely(async () => {
      const promises = [
        auth.api.updateUser({
          body: { name, favoriteNumber },
          headers: this.headers,
        }),
      ];

      if (email !== this.actor.email) {
        promises.push(
          auth.api.changeEmail({
            body: { newEmail: email, callbackURL },
            headers: this.headers,
          })
        );
      }
      await Promise.all(promises);
      return undefined;
    });
  }

  deletePasskey(
    passkeyId: string,
    sudoToken?: string
  ): Promise<GeneralUserResponse> {
    return this._serviceExecutor.runWithSudo(
      sudoToken,
      'You must re-authenticate to perform this action',
      async () => {
        await auth.api.deletePasskey({
          body: { id: passkeyId },
          headers: this.headers,
        });
        return undefined;
      }
    );
  }

  changePassword(
    params: {
      currentPassword: string;
      newPassword: string;
      revokeOtherSessions?: boolean;
    },
    sudoToken?: string
  ): Promise<GeneralUserResponse> {
    return this._serviceExecutor.runWithSudo(
      sudoToken,
      'Please re-authenticate to change your password.',
      async () => {
        await auth.api.changePassword({
          body: params,
          headers: this.headers,
        });
        return undefined;
      }
    );
  }

  disable2FA(
    password: string,
    sudoToken?: string
  ): Promise<GeneralUserResponse> {
    return this._serviceExecutor.runWithSudo(
      sudoToken,
      'You must re-authenticate to disable 2FA authentication.',
      async () => {
        await auth.api.disableTwoFactor({
          body: { password },
          headers: this.headers,
        });
        return undefined;
      }
    );
  }

  enable2FA(password: string, sudoToken?: string): Promise<Enable2FAResponse> {
    return this._serviceExecutor.runWithSudo(
      sudoToken,
      'You must re-authenticate to enable 2FA authentication.',
      () =>
        auth.api.enableTwoFactor({
          body: { password },
          headers: this.headers,
        })
    );
  }

  generateBackUpCodes({
    totpCode,
    password,
    trustDevice,
  }: {
    totpCode: string;
    password: string;
    trustDevice?: boolean;
  }): Promise<GenerateBackUpCodesResponse> {
    return this._serviceExecutor.runSafely(async () => {
      await auth.api.verifyTOTP({
        body: { code: totpCode, trustDevice },
        headers: this.headers,
      });

      const data = await auth.api.generateBackupCodes({
        body: { password },
        headers: this.headers,
      });

      return { backupCodes: data.backupCodes };
    });
  }

  async setRole({
    userId,
    roles,
  }: {
    userId: string;
    roles: UserRole[];
  }): Promise<GeneralUserResponse> {
    const ability = defineAbilityFor(this.actor);
    for (const role of roles) {
      if (ability.cannot('assign', { name: role, kind: 'Role' }))
        return {
          type: 'error',
          payload: {
            message: `You do not have permission to assign role ${role}`,
          },
        };
    }

    return this._serviceExecutor.executeProtectedAction({
      targetUserId: userId,
      requiredRbac: { user: ['set-role'] },
      abacAction: 'set-role',
      permissionError: 'You do not have permission to set user roles.',
      action: () =>
        auth.api.setRole({
          body: { userId, role: roles },
          headers: this.headers,
        }),
    });
  }

  private get repo() {
    return this._serviceExecutor.repo;
  }
}
