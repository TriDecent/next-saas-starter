import { verifySudoToken } from '@/features/auth';
import type { User } from '@/generated/prisma/client';
import { hasPermission } from '@/lib/auth';
import { APIError } from 'better-auth';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import { type IUserRepository } from '../infrastructure/repositories/user';
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
  executeProtectedAction<TResource>(params: {
    requiredRbac: Parameters<typeof hasPermission>[1];
    rbacError: string;
    loadResource: () => Promise<
      ServiceResponse<TResource | null, { message: string }>
    >;
    notFoundMessage: string;
    abacError: string;
    action: () => Promise<void>;
    abacCheck?: (target: TResource) => boolean;
  }): Promise<ServiceResponse<void, { message: string }>>;
  executeProtectedQuery<TData, TError, TContext>(params: {
    rbac: {
      required: Parameters<typeof hasPermission>[1];
      error: TError;
    };
    query: () => Promise<ServiceResponse<TData, TError>>;
    abac?: {
      context?: {
        load: () => Promise<ServiceResponse<TContext, TError>>;
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

  async executeProtectedAction<TResource>(params: {
    requiredRbac: Parameters<typeof hasPermission>[1];
    rbacError: string;
    loadResource: () => Promise<
      ServiceResponse<TResource | null, { message: string }>
    >;
    notFoundMessage: string;
    abacError: string;
    action: () => Promise<void>;
    abacCheck?: (target: TResource) => boolean;
  }): Promise<ServiceResponse<void, { message: string }>> {
    const {
      requiredRbac,
      rbacError,
      loadResource,
      abacCheck,
      abacError,
      action,
      notFoundMessage,
    } = params;

    const hasRbac = await hasPermission(this._actor.id, requiredRbac);
    if (!hasRbac) return { type: 'error', payload: { message: rbacError } };

    const resource = await loadResource();
    if (resource.type === 'error') return resource;
    if (!resource)
      return { type: 'error', payload: { message: notFoundMessage } };

    if (abacCheck && !abacCheck(resource.payload as TResource))
      return { type: 'error', payload: { message: abacError } };

    return this.runSafely(() => action());
  }

  async executeProtectedQuery<TData, TError, TContext>(params: {
    rbac: {
      required: Parameters<typeof hasPermission>[1];
      error: TError;
    };
    query: () => Promise<ServiceResponse<TData, TError>>;
    abac?: {
      context?: {
        load: () => Promise<ServiceResponse<TContext, TError>>;
        check: (data: TData, context: TContext) => boolean;
        abacError: TError;
      };
      ['no-context']?: {
        check: (data: TData) => boolean;
        abacError: TError;
      };
    };
  }): Promise<ServiceResponse<TData, TError>> {
    const hasRbac = await hasPermission(this._actor.id, params.rbac.required);
    if (!hasRbac) return { type: 'error', payload: params.rbac.error };

    const queryResult = await params.query();
    if (queryResult.type === 'error') return queryResult;
    const data = queryResult.payload;

    if (!params.abac) return { type: 'success', payload: data };

    if (params.abac.context) {
      const contextResult = await params.abac.context.load();
      if (contextResult.type === 'error') return contextResult;

      if (!params.abac.context.check(data, contextResult.payload))
        return {
          type: 'error',
          payload: params.abac.context.abacError,
        };
    }

    if (params.abac['no-context']) {
      if (!params.abac['no-context'].check(data))
        return {
          type: 'error',
          payload: params.abac['no-context'].abacError,
        };
    }

    return { type: 'success', payload: data };
  }

  getErrorMessage(error: unknown): string {
    return error instanceof APIError || error instanceof Error
      ? error.message
      : 'Unknown error';
  }
}
