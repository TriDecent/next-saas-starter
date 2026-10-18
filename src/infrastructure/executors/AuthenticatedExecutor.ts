import { verifySudoToken } from '@/features/auth';
import type { User } from '@/generated/prisma/client';
import { type IUserRepository } from '@/infrastructure/repositories';
import { hasPermission } from '@/lib/auth';
import type { ServiceResult } from '@/shared/types';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import { BaseExecutor, type IBaseExecutor } from './BaseExecutor';

export interface IAuthenticatedExecutor extends IBaseExecutor {
  runWithSudo<TSuccess, TError>(
    token: string | undefined,
    invalidTokenMessage: string,
    operation: () => Promise<TSuccess>,
    toErrorPayload: (error: string) => TError
  ): Promise<ServiceResult<TSuccess, TError>>;
  executeProtectedAction<TContext, TError>(params: {
    rbac: {
      required: Parameters<typeof hasPermission>[1];
      error: TError;
    };
    abac?: AbacAction<TContext, TError>;
    action: {
      run: () => Promise<void>;

      // this field catches error thrown in the `run` function
      // and transforms it into the specified error payload
      toErrorPayload: (error: string) => TError;
    };
  }): Promise<ServiceResult<void, TError>>;
  executeProtectedQuery<TData, TError, TContext>(params: {
    rbac: {
      required: Parameters<typeof hasPermission>[1];
      error: TError;
    };
    query: {
      run: () => Promise<TData>;

      // this field catches error thrown in the `run` function
      // and transforms it into the specified error payload
      toErrorPayload: (error: string) => TError;
    };
    abac?: AbacQuery<TContext, TData, TError>;
  }): Promise<ServiceResult<TData, TError>>;

  get actor(): User;
}

type AbacAction<TContext, TError> =
  | {
      context: {
        loadContext: () => Promise<TContext>;
        toContextErrorPayload: (error: string) => TError;
        check: (context: TContext) => boolean;
        abacError: TError;
      };
      ['no-context']?: undefined;
    }
  | {
      context?: undefined;
      ['no-context']: {
        check: () => boolean;
        abacError: TError;
      };
    };

type AbacQuery<TContext, TData, TError> =
  | {
      context: {
        loadContext: () => Promise<TContext>;
        toContextErrorPayload: (error: string) => TError;
        check: (data: TData, context: TContext) => boolean;
        abacError: TError;
      };
      ['no-context']?: undefined;
    }
  | {
      context?: undefined;
      ['no-context']: {
        check: (data: TData) => boolean;
        abacError: TError;
      };
    };

export class AuthenticatedExecutor
  extends BaseExecutor
  implements IAuthenticatedExecutor
{
  constructor(
    private readonly _actor: User,
    repo: IUserRepository,
    headers: ReadonlyHeaders
  ) {
    super(repo, headers);
  }

  get actor() {
    return this._actor;
  }

  async runWithSudo<TSuccess, TError>(
    token: string | undefined,
    invalidTokenMessage: string,
    operation: () => Promise<TSuccess>,
    toErrorPayload: (error: string) => TError
  ): Promise<ServiceResult<TSuccess, TError>> {
    const isValid = token
      ? await verifySudoToken(token, this._actor.id)
      : false;

    return isValid
      ? this.runSafely(operation, toErrorPayload)
      : { type: 'error', payload: toErrorPayload(invalidTokenMessage) };
  }

  async executeProtectedAction<TContext, TError>(params: {
    rbac: {
      required: Parameters<typeof hasPermission>[1];
      error: TError;
    };
    abac?: AbacAction<TContext, TError>;
    action: {
      run: () => Promise<void>;
      toErrorPayload: (error: string) => TError;
    };
  }): Promise<ServiceResult<void, TError>> {
    const { rbac, abac, action } = params;
    const hasRbac = await hasPermission(this._actor.id, rbac.required);
    if (!hasRbac) return { type: 'error', payload: rbac.error };

    if (!abac) return this.runSafely(action.run, action.toErrorPayload);

    if (abac['no-context'] && !abac['no-context'].check())
      return { type: 'error', payload: abac['no-context'].abacError };

    if (abac.context) {
      const contextResponse = await this.runSafely(
        abac.context.loadContext,
        abac.context!.toContextErrorPayload
      );
      if (contextResponse.type === 'error') return contextResponse;

      if (!abac.context.check(contextResponse.payload))
        return { type: 'error', payload: abac.context.abacError };
    }

    return this.runSafely(action.run, action.toErrorPayload);
  }

  async executeProtectedQuery<TData, TError, TContext>(params: {
    rbac: {
      required: Parameters<typeof hasPermission>[1];
      error: TError;
    };
    query: {
      run: () => Promise<TData>;
      toErrorPayload: (error: string) => TError;
    };
    abac?: AbacQuery<TContext, TData, TError>;
  }): Promise<ServiceResult<TData, TError>> {
    const { rbac, query, abac } = params;

    const hasRbac = await hasPermission(this._actor.id, rbac.required);
    if (!hasRbac) return { type: 'error', payload: rbac.error };

    const queryResult = await this.runSafely(query.run, query.toErrorPayload);
    if (queryResult.type === 'error') return queryResult;
    const data = queryResult.payload;

    if (!abac) return { type: 'success', payload: data };

    if (abac.context) {
      const contextResult = await this.runSafely(
        abac.context.loadContext,
        abac.context!.toContextErrorPayload // keeps yelling undefined without the non-null assertion, even though the existence of abac.context is already checked in the if condition
      );
      if (contextResult.type === 'error') return contextResult;

      if (!abac.context.check(data, contextResult.payload))
        return { type: 'error', payload: abac.context.abacError };
    }

    if (abac['no-context'] && !abac['no-context'].check(data))
      return { type: 'error', payload: abac['no-context'].abacError };

    return { type: 'success', payload: data };
  }
}
