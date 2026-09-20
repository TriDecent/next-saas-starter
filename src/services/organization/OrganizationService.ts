import type { Session } from '@/generated/prisma/client';
import type {
  IOrganizationRepository,
  OrganizationWithRole,
} from '@/infrastructure/repositories';
import { auth } from '@/lib/auth';
import { AppPolicy } from '@/lib/casl';
import type { IAuthenticatedExecutor } from '../executor';
import type { ServiceResponse } from '../types';
import {
  type CreateInvitationInput,
  type CreateOrgInput,
  type GeneralOrgError,
  type GeneralOrgResponse,
  type GeneralOrgSuccess,
  type GetInvitationResponse,
  type GetOrgInput,
  type GetOrgResponse,
  type RemoveUserInput,
  type SetActiveOrgInput,
  type UpdateOrgInput,
  type UpdateRoleInput,
} from './org-dtos';

export class OrganizationService {
  private readonly _orgPolicy = AppPolicy.getOrgPolicyFor(this.actor);

  constructor(
    private readonly _serviceExecutor: IAuthenticatedExecutor,
    private readonly _repo: IOrganizationRepository,
    private readonly _currentSession: Session
  ) {}

  createOrg(params: CreateOrgInput): Promise<GeneralOrgResponse> {
    return this._serviceExecutor.executeProtectedAction<
      GeneralOrgSuccess,
      GeneralOrgError
    >({
      rbac: {
        required: { organization: ['create'] },
        error: { message: 'You are not authorized to create an organization' },
      },
      action: {
        run: async () => {
          await auth.api.createOrganization({
            body: params,
            headers: this.headers,
          });
        },
        toErrorPayload: error => ({ message: error }),
      },
    });
  }

  deleteOrg(organizationId: string): Promise<GeneralOrgResponse> {
    return this._serviceExecutor.runSafely(
      async () => {
        await auth.api.deleteOrganization({
          body: { organizationId },
          headers: this.headers,
        });
      },
      error => ({ message: error })
    );
  }

  updateOrg(params: UpdateOrgInput): Promise<GeneralOrgResponse> {
    return this._serviceExecutor.runSafely(
      async () => {
        await auth.api.updateOrganization({
          body: params,
          headers: this.headers,
        });
      },
      error => ({ message: error })
    );
  }

  getActiveOrgId() {
    return this._currentSession.activeOrganizationId;
  }

  listMyOrgs(): Promise<
    ServiceResponse<OrganizationWithRole[], { message: string }>
  > {
    return this._serviceExecutor.runSafely(
      () => this._repo.listOrganizationsForUser(this.actor.id),
      error => ({ message: error })
    );
  }

  setActiveOrg(params: SetActiveOrgInput): Promise<GeneralOrgResponse> {
    return this._serviceExecutor.runSafely(
      async () => {
        await auth.api.setActiveOrganization({
          body: params,
          headers: this.headers,
        });
      },
      error => ({ message: error })
    );
  }

  async createInvitation(
    params: CreateInvitationInput
  ): Promise<GeneralOrgResponse> {
    return this._serviceExecutor.executeProtectedAction({
      rbac: {
        required: { invitation: ['create'] },
        error: { message: 'You are not authorized to send an invitation' },
      },
      action: {
        run: async () => {
          await auth.api.createInvitation({
            body: params,
            headers: this.headers,
          });
        },
        toErrorPayload: error => ({ message: error }),
      },
    });
  }

  getInvitation(id: string): Promise<GetInvitationResponse> {
    return this._serviceExecutor.runSafely(
      () =>
        auth.api.getInvitation({
          query: { id },
          headers: this.headers,
        }),
      error => ({ message: error })
    );
  }

  acceptInvitation(invitationId: string): Promise<GeneralOrgResponse> {
    return this._serviceExecutor.runSafely(
      async () => {
        await auth.api.acceptInvitation({
          body: { invitationId },
          headers: this.headers,
        });
      },
      error => ({ message: error })
    );
  }

  rejectInvitation(invitationId: string): Promise<GeneralOrgResponse> {
    return this._serviceExecutor.runSafely(
      async () => {
        await auth.api.rejectInvitation({
          body: { invitationId },
          headers: this.headers,
        });
      },
      error => ({ message: error })
    );
  }

  async getFullOrganization(params: GetOrgInput): Promise<GetOrgResponse> {
    return this._serviceExecutor.runSafely(
      async () =>
        auth.api.getFullOrganization({
          query: params,
          headers: this.headers,
        }),
      error => ({ message: error })
    );
  }

  updateRole(params: UpdateRoleInput): Promise<GeneralOrgResponse> {
    return this._serviceExecutor.runSafely(
      async () => {
        await auth.api.updateMemberRole({
          body: params,
          headers: this.headers,
        });
      },
      error => ({ message: error })
    );
  }

  removeMember(params: RemoveUserInput): Promise<GeneralOrgResponse> {
    return this._serviceExecutor.runSafely(
      async () => {
        await auth.api.removeMember({ body: params, headers: this.headers });
      },
      error => ({ message: error })
    );
  }

  cancelInvitation(invitationId: string): Promise<GeneralOrgResponse> {
    return this._serviceExecutor.runSafely(
      async () => {
        await auth.api.cancelInvitation({
          body: { invitationId },
          headers: this.headers,
        });
      },
      error => ({ message: error })
    );
  }

  get actor() {
    return this._serviceExecutor.actor;
  }
  private get headers() {
    return this._serviceExecutor.headers;
  }
}
