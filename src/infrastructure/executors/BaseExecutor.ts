import type { ServiceResult } from '@/shared/types';

export interface IBaseExecutor {
  runSafely<TSuccess, TError>(
    operation: () => Promise<TSuccess>,
    toErrorPayload: (error: unknown) => TError
  ): Promise<ServiceResult<TSuccess, TError>>;
}

export class BaseExecutor implements IBaseExecutor {
  constructor() {}

  async runSafely<TSuccess, TError>(
    operation: () => Promise<TSuccess>,
    toErrorPayload: (error: unknown) => TError
  ): Promise<ServiceResult<TSuccess, TError>> {
    try {
      const data = await operation();
      return { type: 'success', payload: data };
    } catch (error) {
      return { type: 'error', payload: toErrorPayload(error) };
    }
  }
}
