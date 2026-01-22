import type { User } from '@/generated/prisma/client';
import { auth, hasPermission } from '@/lib/auth';
import { defineAbilityFor, type CRUD, type UserActionTypes } from '@/lib/casl';
import { APIError } from 'better-auth';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import { type IUserRepository } from '../repositories';
import type { ServiceResponse } from './types';

export class UserService {
  constructor(
    private readonly _actor: User,
    private readonly _repo: IUserRepository
  ) {}

  async getUsers(
    pageIndex: number,
    pageSize: number,
    orderBy?: Record<string, 'asc' | 'desc'>[],
    keyword?: string
  ): Promise<
    ServiceResponse<{ users: User[]; total: number }, { message: string }>
  > {
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

  toggleBanStatus(
    userId: User['id'],
    shouldBan: boolean,
    headers?: ReadonlyHeaders
  ) {
    return this.executeProtectedAction({
      targetUserId: userId,
      requiredRbac: { user: ['ban'] },
      abacAction: 'ban-user',
      action: () =>
        shouldBan
          ? auth.api.banUser({ body: { userId }, headers })
          : auth.api.unbanUser({ body: { userId }, headers }),
      permissionError: 'You do not have permission to ban/unban users.',
    });
  }

  revokeUser(userId: User['id'], headers: ReadonlyHeaders) {
    return this.executeProtectedAction({
      targetUserId: userId,
      requiredRbac: { session: ['revoke'] },
      abacAction: 'revoke-user',
      action: () => auth.api.revokeUserSessions({ body: { userId }, headers }),
      permissionError: 'You do not have permission to revoke sessions.',
    });
  }

  deleteUser(userId: User['id'], headers: ReadonlyHeaders) {
    return this.executeProtectedAction({
      targetUserId: userId,
      requiredRbac: { user: ['delete'] },
      abacAction: 'delete',
      action: () => auth.api.removeUser({ body: { userId }, headers }),
      permissionError: 'You do not have permission to delete users.',
    });
  }

  impersonateUser(userId: User['id'], headers: ReadonlyHeaders) {
    return this.executeProtectedAction({
      targetUserId: userId,
      requiredRbac: { user: ['impersonate'] },
      abacAction: 'impersonate-user',
      action: () => auth.api.impersonateUser({ body: { userId }, headers }),
      permissionError: 'You do not have permission to impersonate users.',
    });
  }

  stopImpersonate(headers: ReadonlyHeaders) {
    return auth.api.stopImpersonating({ headers });
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
    if (!targetUser) {
      return { type: 'error', payload: { message: 'User not found.' } };
    }

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
