import { verifySudoToken } from '@/features/auth';
import type { User } from '@/generated/prisma/client';
import { hasPermission } from '@/lib/auth';
import { APIError } from 'better-auth';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import { type IUserRepository } from '../infrastructure/repositories/user';
import type { ServiceResponse } from './types';

export interface IServiceExecutor {
  runSafely<TSuccess, TError>(
    operation: () => Promise<TSuccess>,
    toErrorPayload: (error: string) => TError
  ): Promise<ServiceResponse<TSuccess, TError>>;
  runWithSudo<TSuccess, TError>(
    token: string | undefined,
    invalidTokenMessage: string,
    operation: () => Promise<TSuccess>,
    toErrorPayload: (error: string) => TError
  ): Promise<ServiceResponse<TSuccess, TError>>;
  executeProtectedAction<TContext, TError>(params: {
    rbac: {
      required: Parameters<typeof hasPermission>[1];
      error: TError;
    };
    abac?: {
      context?: {
        loadContext: () => Promise<TContext>;
        toContextErrorPayload: (error: string) => TError;
        abacError: TError;
        check: (context: TContext) => boolean;
      };
      ['no-context']?: {
        check: () => boolean;
        abacError: TError;
      };
    };
    action: {
      run: () => Promise<void>;

      // this field catches error thrown in the `run` function
      // and transforms it into the specified error payload
      toErrorPayload: (error: string) => TError;
    };
  }): Promise<ServiceResponse<void, TError>>;
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
    abac?: {
      context?: {
        loadContext: () => Promise<TContext>;
        toContextErrorPayload: (error: string) => TError;
        check: (data: TData, context: TContext) => boolean;
        abacError: TError;
      };
      ['no-context']?: {
        check: (data: TData) => boolean;
        abacError: TError;
      };
    };
  }): Promise<ServiceResponse<TData, TError>>;
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

  async runSafely<TSuccess, TError>(
    operation: () => Promise<TSuccess>,
    toErrorPayload: (error: string) => TError
  ): Promise<ServiceResponse<TSuccess, TError>> {
    try {
      const data = await operation();
      return { type: 'success', payload: data };
    } catch (error) {
      return {
        type: 'error',
        payload: toErrorPayload(this.getErrorMessage(error)),
      };
    }
  }

  async runWithSudo<TSuccess, TError>(
    token: string | undefined,
    invalidTokenMessage: string,
    operation: () => Promise<TSuccess>,
    toErrorPayload: (error: string) => TError
  ): Promise<ServiceResponse<TSuccess, TError>> {
    const isValid = token
      ? await verifySudoToken(token, this._actor.id)
      : false;

    return isValid
      ? this.runSafely(operation, error => toErrorPayload(error))
      : { type: 'error', payload: toErrorPayload(invalidTokenMessage) };
  }

  async executeProtectedAction<TContext, TError>(params: {
    rbac: {
      required: Parameters<typeof hasPermission>[1];
      error: TError;
    };
    abac?: {
      context?: {
        loadContext: () => Promise<TContext>;
        toContextErrorPayload: (error: string) => TError;
        abacError: TError;
        check: (context: TContext) => boolean;
      };
      ['no-context']?: {
        check: () => boolean;
        abacError: TError;
      };
    };
    action: {
      run: () => Promise<void>;
      toErrorPayload: (error: string) => TError;
    };
  }): Promise<ServiceResponse<void, TError>> {
    const { rbac, abac, action } = params;
    const hasRbac = await hasPermission(this._actor.id, rbac.required);
    if (!hasRbac) return { type: 'error', payload: rbac.error };

    if (!abac)
      return this.runSafely(action.run, error => action.toErrorPayload(error));

    if (abac['no-context'] && !abac['no-context'].check())
      return { type: 'error', payload: abac['no-context'].abacError };

    if (abac.context) {
      const contextResponse = await this.runSafely(
        abac.context.loadContext,
        error => abac.context!.toContextErrorPayload(error)
      );
      if (contextResponse.type === 'error') return contextResponse;

      if (!abac.context.check(contextResponse.payload))
        return { type: 'error', payload: abac.context.abacError };
    }

    return this.runSafely(action.run, error => action.toErrorPayload(error));
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
    abac?: {
      context?: {
        loadContext: () => Promise<TContext>;
        toContextErrorPayload: (error: string) => TError;
        check: (data: TData, context: TContext) => boolean;
        abacError: TError;
      };
      ['no-context']?: {
        check: (data: TData) => boolean;
        abacError: TError;
      };
    };
  }): Promise<ServiceResponse<TData, TError>> {
    const { rbac, query, abac } = params;

    const hasRbac = await hasPermission(this._actor.id, rbac.required);
    if (!hasRbac) return { type: 'error', payload: rbac.error };

    const queryResult = await this.runSafely(query.run, error =>
      query.toErrorPayload(error)
    );
    if (queryResult.type === 'error') return queryResult;
    const data = queryResult.payload;

    if (!abac) return { type: 'success', payload: data };

    if (abac.context) {
      const contextResult = await this.runSafely(
        abac.context.loadContext,
        error => abac.context!.toContextErrorPayload(error) // keeps yelling undefined without the non-null assertion, even though the existence of abac.context is already checked in the if condition
      );
      if (contextResult.type === 'error') return contextResult;

      if (!abac.context.check(data, contextResult.payload))
        return { type: 'error', payload: abac.context.abacError };
    }

    if (abac['no-context'] && !abac['no-context'].check(data))
      return { type: 'error', payload: abac['no-context'].abacError };

    return { type: 'success', payload: data };
  }

  getErrorMessage(error: unknown): string {
    return error instanceof APIError || error instanceof Error
      ? error.message
      : 'Unknown error';
  }
}
