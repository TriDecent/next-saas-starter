import type { ServiceResult } from '@/shared/types';
import { APIError } from 'better-auth';

export interface IBaseExecutor {
  runSafely<TSuccess, TError>(
    operation: () => Promise<TSuccess>,
    toErrorPayload: (error: string) => TError
  ): Promise<ServiceResult<TSuccess, TError>>;

  getErrorMessage(error: unknown): string;
}

export class BaseExecutor implements IBaseExecutor {
  constructor() {}

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
