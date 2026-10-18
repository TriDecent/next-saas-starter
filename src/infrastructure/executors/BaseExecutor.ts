import { type IUserRepository } from '@/infrastructure/repositories';
import type { ServiceResult } from '@/shared/types';
import { APIError } from 'better-auth';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

export interface IBaseExecutor {
  runSafely<TSuccess, TError>(
    operation: () => Promise<TSuccess>,
    toErrorPayload: (error: string) => TError
  ): Promise<ServiceResult<TSuccess, TError>>;
  get headers(): ReadonlyHeaders;
  get repo(): IUserRepository;

  getErrorMessage(error: unknown): string;
}

export class BaseExecutor implements IBaseExecutor {
  constructor(
    private readonly _repo: IUserRepository,
    private readonly _headers: ReadonlyHeaders
  ) {}

  get headers() {
    return this._headers;
  }
  get repo() {
    return this._repo;
  }

  async runSafely<TSuccess, TError>(
    operation: () => Promise<TSuccess>,
    toErrorPayload: (error: string) => TError
  ): Promise<ServiceResult<TSuccess, TError>> {
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

  getErrorMessage(error: unknown): string {
    return error instanceof APIError || error instanceof Error
      ? error.message
      : 'Unknown error';
  }
}
