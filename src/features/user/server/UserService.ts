import { createSudoToken } from '@/features/auth';
import type { AppRole } from '@/features/authorization';
import { AppPolicy } from '@/features/authorization/core';
import type { Session, User } from '@/generated/prisma/client';
import type { IAuthenticatedExecutor } from '@/infrastructure/executors';
import { auth, hasPermission } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import { buildPagination } from '@/shared/utils';
import type {
  AuthenticatePriorResponse,
  Enable2FAResponse,
  GeneralUserResponse,
  GenerateBackUpCodesResponse,
  GetUserByIdResponse,
  GetUsersError,
  GetUsersParams,
  GetUsersResponse,
  GetUsersSuccess,
} from './user-dtos';

export class UserService {
  private readonly _userPolicy = AppPolicy.getUserPolicyFor(this.actor);
  private readonly _rolePolicy = AppPolicy.getRolePolicyFor(this.actor);

  constructor(
    private readonly _serviceExecutor: IAuthenticatedExecutor,
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

  async getUserById(id: User['id']): Promise<GetUserByIdResponse> {
    const canGetUser = await hasPermission(this.actor.id, { user: ['get'] });
    if (!canGetUser)
      return {
        type: 'error',
        payload: { message: 'You do not have permission to get user details.' },
      };

    const user = await this.repo.getUserById(id);

    if (!user) return { type: 'success', payload: user };

    if (!this._userPolicy.canRead(user))
      return {
        type: 'error',
        payload: {
          message: 'You do not have permission to get this user details.',
        },
      };

    return { type: 'success', payload: user };
  }

  getUsers({
    page,
    limit,
    orderBy,
    keyword,
  }: GetUsersParams): Promise<GetUsersResponse> {
    return this._serviceExecutor.executeProtectedQuery<
      GetUsersSuccess,
      GetUsersError,
      void
    >({
      rbac: {
        required: { user: ['list'] },
        error: { message: 'You do not have permission to list users.' },
      },
      query: {
        run: async () => {
          const offset = (page - 1) * limit;
          const { data: users, total } = await this.repo.getUsers(
            offset,
            limit,
            orderBy,
            keyword
          );

          return {
            users,
            pagination: buildPagination({
              currentPage: page,
              limit,
              totalItems: total,
            }),
          };
        },
        toErrorPayload: error => ({ message: error }),
      },
    });
  }

  toggleBanStatus(
    userId: User['id'],
    shouldBan: boolean
  ): Promise<GeneralUserResponse> {
    return this._serviceExecutor.executeProtectedAction<
      User,
      { message: string }
    >({
      rbac: {
        required: { user: ['ban'] },
        error: { message: 'You do not have permission to ban/unban users.' },
      },
      abac: {
        context: {
          loadContext: () => this.retrieveUserOrFail(userId),
          toContextErrorPayload: error => ({ message: error }),
          check: target => this._userPolicy.canBan(target),
          abacError: {
            message: 'You do not have permission to ban/unban this user.',
          },
        },
      },
      action: {
        run: async () => {
          if (shouldBan) {
            await auth.api.banUser({ body: { userId }, headers: this.headers });
            return;
          }
          await auth.api.unbanUser({ body: { userId }, headers: this.headers });
        },
        toErrorPayload: error => ({ message: error }),
      },
    });
  }

  revokeUser(userId: User['id']): Promise<GeneralUserResponse> {
    return this._serviceExecutor.executeProtectedAction<
      User,
      { message: string }
    >({
      rbac: {
        required: { session: ['revoke'] },
        error: { message: 'You do not have permission to revoke sessions.' },
      },
      abac: {
        context: {
          loadContext: () => this.retrieveUserOrFail(userId),
          toContextErrorPayload: error => ({ message: error }),
          check: target => this._userPolicy.canBan(target),
          abacError: {
            message:
              'You do not have permission to revoke sessions for this user.',
          },
        },
      },
      action: {
        run: async () => {
          await auth.api.revokeUserSessions({
            body: { userId },
            headers: this.headers,
          });
        },
        toErrorPayload: error => ({ message: error }),
      },
    });
  }

  deleteUser(userId: User['id']): Promise<GeneralUserResponse> {
    return this._serviceExecutor.executeProtectedAction({
      rbac: {
        required: { user: ['delete'] },
        error: { message: 'You do not have permission to delete users.' },
      },
      abac: {
        context: {
          loadContext: () => this.retrieveUserOrFail(userId),
          toContextErrorPayload: error => ({ message: error }),
          check: context => this._userPolicy.canDelete(context),
          abacError: {
            message: 'You do not have permission to delete this user.',
          },
        },
      },
      action: {
        run: async () => {
          await auth.api.removeUser({
            body: { userId },
            headers: this.headers,
          });
        },
        toErrorPayload: error => ({ message: error }),
      },
    });
  }

  impersonateUser(userId: User['id']): Promise<GeneralUserResponse> {
    return this._serviceExecutor.executeProtectedAction<
      User,
      { message: string }
    >({
      rbac: {
        required: { user: ['impersonate'] },
        error: { message: 'You do not have permission to impersonate users.' },
      },
      abac: {
        context: {
          loadContext: () => this.retrieveUserOrFail(userId),
          toContextErrorPayload: error => ({ message: error }),
          check: target => this._userPolicy.canImpersonate(target),
          abacError: {
            message: 'You do not have permission to impersonate this user.',
          },
        },
      },
      action: {
        run: async () => {
          await auth.api.impersonateUser({
            body: { userId },
            headers: this.headers,
          });
        },
        toErrorPayload: error => ({ message: error }),
      },
    });
  }

  stopImpersonate(): Promise<GeneralUserResponse> {
    return this._serviceExecutor.runSafely(
      async () => {
        await auth.api.stopImpersonating({ headers: this.headers });
      },
      error => ({ message: error })
    );
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
    return this._serviceExecutor.runSafely(
      async () => {
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
      },
      error => ({ message: error })
    );
  }

  updateProfile({
    name,
    favoriteNumber,
  }: {
    name: string;
    favoriteNumber: number;
  }): Promise<GeneralUserResponse> {
    return this._serviceExecutor.runSafely(
      async () => {
        await auth.api.updateUser({
          body: { name, favoriteNumber },
          headers: this.headers,
        });
      },
      error => ({ message: error })
    );
  }

  changeEmail(
    { newEmail, callbackURL }: { newEmail: string; callbackURL: string },
    sudoToken?: string
  ): Promise<GeneralUserResponse> {
    return this._serviceExecutor.runWithSudo(
      sudoToken,
      'You must re-authenticate to change your email address.',
      async () => {
        if (!this._userPolicy.canChangeEmail(this.actor))
          throw new Error(
            'You do not have permission to change this email address.'
          );

        await auth.api.changeEmail({
          body: { newEmail, callbackURL },
          headers: this.headers,
        });
      },
      error => ({ message: error })
    );
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
      },
      error => ({ message: error })
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
        if (!this._userPolicy.canChangePassword(this.actor))
          throw new Error('You do not have permission to change the password.');

        await auth.api.changePassword({
          body: params,
          headers: this.headers,
        });
      },
      error => ({ message: error })
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
      },
      error => ({ message: error })
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
        }),
      error => ({ message: error })
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
    return this._serviceExecutor.runSafely(
      async () => {
        await auth.api.verifyTOTP({
          body: { code: totpCode, trustDevice },
          headers: this.headers,
        });

        const data = await auth.api.generateBackupCodes({
          body: { password },
          headers: this.headers,
        });

        return { backupCodes: data.backupCodes };
      },
      error => ({ message: error })
    );
  }

  async setRole({
    userId,
    roles,
  }: {
    userId: string;
    roles: AppRole[];
  }): Promise<GeneralUserResponse> {
    for (const role of roles) {
      if (!this._rolePolicy.canAssign({ name: role }))
        return {
          type: 'error',
          payload: {
            message: `You do not have permission to assign role ${role}`,
          },
        };
    }

    return this._serviceExecutor.executeProtectedAction<
      User,
      { message: string }
    >({
      rbac: {
        required: { user: ['set-role'] },
        error: { message: 'You do not have permission to set user roles.' },
      },
      abac: {
        context: {
          loadContext: () => this.retrieveUserOrFail(userId),
          toContextErrorPayload: error => ({ message: error }),
          check: target => this._userPolicy.canSetRole(target),
          abacError: {
            message: `You do not have permission to assign ${roles.join(', ')} roles.`,
          },
        },
      },
      action: {
        run: async () => {
          await auth.api.setRole({
            body: { userId, role: roles },
            headers: this.headers,
          });
        },
        toErrorPayload: error => ({ message: error }),
      },
    });
  }

  private async retrieveUserOrFail(userId: User['id']): Promise<User> {
    const response = await this.getUserById(userId);

    if (response.type === 'error') throw new Error(response.payload.message);
    if (!response.payload) throw new Error('User not found.');

    return response.payload;
  }

  private get repo() {
    return this._serviceExecutor.repo;
  }
}
