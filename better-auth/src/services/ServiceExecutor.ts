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

    return this.runSafely(
      () => action(),
      error => ({ message: error })
    );
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
    const { rbac, query, abac } = params;

    const hasRbac = await hasPermission(this._actor.id, rbac.required);
    if (!hasRbac) return { type: 'error', payload: rbac.error };

    const queryResult = await query();
    if (queryResult.type === 'error') return queryResult;
    const data = queryResult.payload;

    if (!abac) return { type: 'success', payload: data };

    if (abac.context) {
      const contextResult = await abac.context.load();
      if (contextResult.type === 'error') return contextResult;

      if (!abac.context.check(data, contextResult.payload))
        return { type: 'error', payload: abac.context.abacError };
    }

    if (abac['no-context']) {
      if (!abac['no-context'].check(data))
        return { type: 'error', payload: abac['no-context'].abacError };
    }

    return { type: 'success', payload: data };
  }

  getErrorMessage(error: unknown): string {
    return error instanceof APIError || error instanceof Error
      ? error.message
      : 'Unknown error';
  }
}
