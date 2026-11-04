import { AppPolicy } from '@/features/authorization/core';
import type { IAuthenticatedExecutor } from '@/infrastructure/executors';
import { auth } from '@/lib/auth';
import { getErrorMessage } from '@/shared/utils';
import type {
  CreateInvitationInput,
  GetInvitationResult,
  InvMutationResult,
} from './inv-dtos';

export class InvService {
  private readonly _policy = AppPolicy.getInvitationPolicyFor(this.actor);

  constructor(
    private readonly _serviceExecutor: IAuthenticatedExecutor,
    private readonly _headers: Headers
  ) {}

  async createInvitation(
    params: CreateInvitationInput
  ): Promise<InvMutationResult> {
    return this._serviceExecutor.runSafely(async () => {
      this._policy.assertCanCreateInvitation();

      await auth.api.createInvitation({
        body: params,
        headers: this._headers,
      });
    }, this.handleError);
  }

  getInvitation(id: string): Promise<GetInvitationResult> {
    return this._serviceExecutor.runSafely(
      () =>
        auth.api.getInvitation({
          query: { id },
          headers: this._headers,
        }),
      this.handleError
    );
  }

  acceptInvitation(invitationId: string): Promise<InvMutationResult> {
    return this._serviceExecutor.runSafely(async () => {
      await auth.api.acceptInvitation({
        body: { invitationId },
        headers: this._headers,
      });
    }, this.handleError);
  }

  rejectInvitation(invitationId: string): Promise<InvMutationResult> {
    return this._serviceExecutor.runSafely(async () => {
      await auth.api.rejectInvitation({
        body: { invitationId },
        headers: this._headers,
      });
    }, this.handleError);
  }

  cancelInvitation(invitationId: string): Promise<InvMutationResult> {
    return this._serviceExecutor.runSafely(async () => {
      await auth.api.cancelInvitation({
        body: { invitationId },
        headers: this._headers,
      });
    }, this.handleError);
  }

  get actor() {
    return this._serviceExecutor.actor;
  }
  private handleError(error: unknown): { message: string } {
    return { message: getErrorMessage(error) };
  }
}
