import { verifySudoToken } from '@/features/auth/authenticate-prior/sudo-mode';
import type { User } from '@/generated/prisma/client';
import { hasPermission } from '@/lib/auth';
import { defineAbilityFor, type CRUD, type UserActionTypes } from '@/lib/casl';
import { APIError } from 'better-auth';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import { type IUserRepository } from '../repositories/user';
import type { ServiceResponse } from './types';

export interface IServiceExecutor {
  runSafely<TSuccess>(
    operation: () => Promise<TSuccess>
  ): Promise<ServiceResponse<TSuccess, { message: string }>>;
  runSafelyWithExtraErrorReturn<TSuccess, TError>(
    operation: () => Promise<TSuccess>,
    extraErrorDetails: TError
  ): Promise<ServiceResponse<TSuccess, { message: string; more: TError }>>;
  runWithSudo<T>(
    token: string | undefined,
    errorMessage: string,
    operation: () => Promise<T>
  ): Promise<ServiceResponse<T, { message: string }>>;
  runWithSudoWithExtraErrorReturn<TSuccess, TError>(
    token: string | undefined,
    errorMessage: string,
    operation: () => Promise<TSuccess>,
    extraErrorDetails: TError
  ): Promise<ServiceResponse<TSuccess, { message: string; more: TError }>>;
  executeProtectedAction(params: {
    targetUserId: string;
    requiredRbac: Parameters<typeof hasPermission>[1];
    abacAction: UserActionTypes | CRUD;
    permissionError: string;
    action: () => Promise<unknown>;
  }): Promise<ServiceResponse<undefined, { message: string }>>;
  getErrorMessage(error: unknown): string;

  get actor(): User;
  get headers(): ReadonlyHeaders;
  get repo(): IUserRepository;
}

export class ServiceExecutor implements IServiceExecutor {
  constructor(
    private readonly _actor: User,
    private readonly _repo: IUserRepository,
    private readonly _headers: ReadonlyHeaders
  ) {}

  get actor() {
    return this._actor;
  }
  get headers() {
    return this._headers;
  }
  get repo() {
    return this._repo;
  }

  async runSafely<TSuccess>(
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

  async runSafelyWithExtraErrorReturn<TSuccess, TError>(
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

  async runWithSudo<T>(
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

  async runWithSudoWithExtraErrorReturn<TSuccess, TError>(
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

  async executeProtectedAction(params: {
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

  getErrorMessage(error: unknown): string {
    return error instanceof APIError || error instanceof Error
      ? error.message
      : 'Unknown error';
  }
}
