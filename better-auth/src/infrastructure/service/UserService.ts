import type { User } from '@/generated/prisma/client';
import { auth, hasPermission } from '@/lib/auth';
import { defineAbilityFor } from '@/lib/casl';
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

  async toggleBanStatus(
    userId: User['id'],
    shouldBan: boolean,
    headersList?: ReadonlyHeaders
  ): Promise<ServiceResponse<undefined, { message: string }>> {
    const banPermission = hasPermission(this._actor.id, { user: ['ban'] });
    if (!banPermission)
      return {
        type: 'error',
        payload: {
          message: 'You do not have permission to ban/unban users.',
        },
      };

    const targetUser = await this._repo.findUnique({ where: { id: userId } });
    if (!targetUser)
      return { type: 'error', payload: { message: 'User not found.' } };

    const ability = defineAbilityFor(this._actor);
    if (ability.cannot('ban-user', { ...targetUser, kind: 'User' }))
      return {
        type: 'error',
        payload: {
          message: 'You do not have permission to ban/unban this user.',
        },
      };

    try {
      if (shouldBan) {
        await auth.api.banUser({ body: { userId }, headers: headersList });
      } else {
        await auth.api.unbanUser({ body: { userId }, headers: headersList });
      }

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

  async revokeUser(
    userId: User['id'],
    headersList: ReadonlyHeaders
  ): Promise<ServiceResponse<undefined, { message: string }>> {
    const revokePermission = hasPermission(this._actor.id, {
      session: ['revoke'],
    });
    if (!revokePermission)
      return {
        type: 'error',
        payload: {
          message: 'You do not have permission to revoke sessions.',
        },
      };

    const targetUser = await this._repo.findUnique({ where: { id: userId } });
    if (!targetUser)
      return { type: 'error', payload: { message: 'User not found.' } };

    const ability = defineAbilityFor(this._actor);
    if (ability.cannot('revoke-user', { ...targetUser, kind: 'User' }))
      return {
        type: 'error',
        payload: { message: 'You do not have permission to revoke this user.' },
      };

    try {
      await auth.api.revokeUserSessions({
        body: { userId },
        headers: headersList,
      });

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
