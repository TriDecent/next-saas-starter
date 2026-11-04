import { createSudoToken } from '@/features/auth';
import type { AppRole } from '@/features/authorization';
import { AppPolicy } from '@/features/authorization/core';
import type { Session, User } from '@/generated/prisma/client';
import type { IAuthenticatedExecutor } from '@/infrastructure/executors';
import { auth } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import { buildPagination } from '@/shared/pagination';
import { getErrorMessage } from '@/shared/utils';
import type { IUserRepository } from '../repo';
import type {
  AuthenticatePriorResult,
  Enable2FAResult,
  GenerateBackUpCodesResult,
  GetUserByIdResult,
  ListUsersQuery,
  ListUsersResult,
  UserMutationResult,
} from './user-dtos';

export class UserService {
  private readonly _userPolicy = AppPolicy.getUserPolicyFor(this.actor);
  private readonly _rolePolicy = AppPolicy.getRolePolicyFor(this.actor);

  constructor(
    private readonly _repo: IUserRepository,
    private readonly _serviceExecutor: IAuthenticatedExecutor,
    private readonly _currentSession: Session,
    private readonly _headers: Headers
  ) {}

  get actor() {
    return this._serviceExecutor.actor;
  }

  get currentSession() {
    return this._currentSession;
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

  async getUserById(id: User['id']): Promise<GetUserByIdResult> {
    return this._serviceExecutor.runSafely(async () => {
      this._userPolicy.assertCanGetUser();

      const user = await this._repo.getUserById(id);

      if (!user) return user;

      this._userPolicy.assertCanRead(user);

      return user;
    }, this.handleError);
  }

  async *getUsersForExport(): AsyncGenerator<User> {
    // ! This is intentional; we'll let the outer pipeline catch the error
    this._userPolicy.assertCanExportUsers();

    const batchSize = 100;

    yield* this._repo.iterateUsers({ batchSize });
  }

  listUsers({
    page,
    limit,
    orderBy,
    keyword,
  }: ListUsersQuery): Promise<ListUsersResult> {
    return this._serviceExecutor.runSafely(async () => {
      this._userPolicy.assertCanList();

      const offset = (page - 1) * limit;
      const { data: users, total } = await this._repo.getUsers(
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
    }, this.handleError);
  }

  toggleBanStatus(userId: User['id']): Promise<UserMutationResult> {
    return this._serviceExecutor.runSafely(async () => {
      this._userPolicy.assertCanBan();

      const target = await this.retrieveUserOrFail(userId);
      console.log('target', target);
      this._userPolicy.assertCanBan(target);

      if (target.banned) {
        await auth.api.unbanUser({
          body: { userId },
          headers: this._headers,
        });
        return;
      }

      await auth.api.banUser({
        body: { userId },
        headers: this._headers,
      });
    }, this.handleError);
  }

  revokeUser(userId: User['id']): Promise<UserMutationResult> {
    return this._serviceExecutor.runSafely(async () => {
      this._userPolicy.assertCanRevoke();

      const target = await this.retrieveUserOrFail(userId);
      this._userPolicy.assertCanRevoke(target);

      await auth.api.revokeUserSessions({
        body: { userId },
        headers: this._headers,
      });
    }, this.handleError);
  }

  deleteUser(userId: User['id']): Promise<UserMutationResult> {
    return this._serviceExecutor.runSafely(async () => {
      this._userPolicy.assertCanDelete();

      const target = await this.retrieveUserOrFail(userId);
      this._userPolicy.assertCanDelete(target);

      await auth.api.removeUser({
        body: { userId },
        headers: this._headers,
      });
    }, this.handleError);
  }

  impersonateUser(userId: User['id']): Promise<UserMutationResult> {
    return this._serviceExecutor.runSafely(async () => {
      this._userPolicy.assertCanImpersonate();

      const target = await this.retrieveUserOrFail(userId);
      this._userPolicy.assertCanImpersonate(target);

      await auth.api.impersonateUser({
        body: { userId },
        headers: this._headers,
      });
    }, this.handleError);
  }

  stopImpersonate(): Promise<UserMutationResult> {
    return this._serviceExecutor.runSafely(async () => {
      await auth.api.stopImpersonating({ headers: this._headers });
    }, this.handleError);
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
      throw new Error(getErrorMessage(error));
    }
  }

  async revokeSessionWithToken(token: string): Promise<void> {
    try {
      await auth.api.revokeSession({ body: { token }, headers: this._headers });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  authenticatePrior(
    password: string,
    totp?: string
  ): Promise<AuthenticatePriorResult> {
    return this._serviceExecutor.runSafely(async () => {
      await auth.api.verifyPassword({
        body: { password },
        headers: this._headers,
      });

      if (this.actor.twoFactorEnabled && totp) {
        await auth.api.verifyTOTP({
          body: { code: totp },
          headers: this._headers,
        });
      }

      const sudoToken = await createSudoToken(this.actor.id);
      return { sudoToken };
    }, this.handleError);
  }

  updateProfile({
    name,
    favoriteNumber,
  }: {
    name: string;
    favoriteNumber: number;
  }): Promise<UserMutationResult> {
    return this._serviceExecutor.runSafely(async () => {
      await auth.api.updateUser({
        body: { name, favoriteNumber },
        headers: this._headers,
      });
    }, this.handleError);
  }

  changeEmail(
    { newEmail, callbackURL }: { newEmail: string; callbackURL: string },
    sudoToken?: string
  ): Promise<UserMutationResult> {
    return this._serviceExecutor.runWithSudo(
      sudoToken,
      'You must re-authenticate to change your email address.',
      async () => {
        this._userPolicy.assertCanChangeEmail();

        await auth.api.changeEmail({
          body: { newEmail, callbackURL },
          headers: this._headers,
        });
      },
      this.handleError
    );
  }

  deletePasskey(
    passkeyId: string,
    sudoToken?: string
  ): Promise<UserMutationResult> {
    return this._serviceExecutor.runWithSudo(
      sudoToken,
      'You must re-authenticate to perform this action',
      async () => {
        await auth.api.deletePasskey({
          body: { id: passkeyId },
          headers: this._headers,
        });
      },
      this.handleError
    );
  }

  changePassword(
    params: {
      currentPassword: string;
      newPassword: string;
      revokeOtherSessions?: boolean;
    },
    sudoToken?: string
  ): Promise<UserMutationResult> {
    return this._serviceExecutor.runWithSudo(
      sudoToken,
      'Please re-authenticate to change your password.',
      async () => {
        this._userPolicy.assertCanChangePassword();

        await auth.api.changePassword({
          body: params,
          headers: this._headers,
        });
      },
      this.handleError
    );
  }

  disable2FA(
    password: string,
    sudoToken?: string
  ): Promise<UserMutationResult> {
    return this._serviceExecutor.runWithSudo(
      sudoToken,
      'You must re-authenticate to disable 2FA authentication.',
      async () => {
        await auth.api.disableTwoFactor({
          body: { password },
          headers: this._headers,
        });
      },
      this.handleError
    );
  }

  enable2FA(password: string, sudoToken?: string): Promise<Enable2FAResult> {
    return this._serviceExecutor.runWithSudo(
      sudoToken,
      'You must re-authenticate to enable 2FA authentication.',
      () => {
        this._userPolicy.assertCanEnable2FA();

        return auth.api.enableTwoFactor({
          body: { password },
          headers: this._headers,
        });
      },
      this.handleError
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
  }): Promise<GenerateBackUpCodesResult> {
    return this._serviceExecutor.runSafely(async () => {
      await auth.api.verifyTOTP({
        body: { code: totpCode, trustDevice },
        headers: this._headers,
      });

      const data = await auth.api.generateBackupCodes({
        body: { password },
        headers: this._headers,
      });

      return { backupCodes: data.backupCodes };
    }, this.handleError);
  }

  async setRole({
    userId,
    roles,
  }: {
    userId: string;
    roles: AppRole[];
  }): Promise<UserMutationResult> {
    return this._serviceExecutor.runSafely(async () => {
      for (const role of roles)
        this._rolePolicy.assertCanAssignRole({ name: role });

      this._userPolicy.assertCanSetRole();

      const target = await this.retrieveUserOrFail(userId);
      this._userPolicy.assertCanSetRole(target);

      await auth.api.setRole({
        body: { userId, role: roles },
        headers: this._headers,
      });
    }, this.handleError);
  }

  private async retrieveUserOrFail(userId: User['id']): Promise<User> {
    const response = await this.getUserById(userId);

    if (response.type === 'error') throw new Error(response.payload.message);
    if (!response.payload) throw new Error('User not found.');

    return response.payload;
  }

  private handleError(error: unknown): { message: string } {
    return { message: getErrorMessage(error) };
  }
}
