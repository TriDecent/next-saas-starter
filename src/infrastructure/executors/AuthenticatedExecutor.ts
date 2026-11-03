import { verifySudoToken } from '@/features/auth';
import type { User } from '@/generated/prisma/client';
import type { ServiceResult } from '@/shared/types';
import { BaseExecutor, type IBaseExecutor } from './BaseExecutor';

export interface IAuthenticatedExecutor extends IBaseExecutor {
  runWithSudo<TSuccess, TError>(
    token: string | undefined,
    invalidTokenMessage: string,
    operation: () => Promise<TSuccess>,
    toErrorPayload: (error: unknown) => TError
  ): Promise<ServiceResult<TSuccess, TError>>;

  get actor(): User;
}

export class AuthenticatedExecutor
  extends BaseExecutor
  implements IAuthenticatedExecutor
{
  constructor(private readonly _actor: User) {
    super();
  }

  get actor() {
    return this._actor;
  }

  async runWithSudo<TSuccess, TError>(
    token: string | undefined,
    invalidTokenMessage: string,
    operation: () => Promise<TSuccess>,
    toErrorPayload: (error: unknown) => TError
  ): Promise<ServiceResult<TSuccess, TError>> {
    const isValid = token
      ? await verifySudoToken(token, this._actor.id)
      : false;

    return isValid
      ? this.runSafely(operation, toErrorPayload)
      : { type: 'error', payload: toErrorPayload(invalidTokenMessage) };
  }
}
