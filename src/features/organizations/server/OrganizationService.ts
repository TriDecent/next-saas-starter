import { AppPolicy } from '@/features/authorization/core';
import type { Session } from '@/generated/prisma/client';
import type { IAuthenticatedExecutor } from '@/infrastructure/executors';
import type {
  IOrganizationRepository,
  OrganizationWithRole,
} from '@/infrastructure/repositories';
import { auth } from '@/lib/auth';
import { buildPagination } from '@/shared/pagination';
import type { ServiceResponse } from '@/shared/types';
import {
  type CreateInvitationInput,
  type CreateOrgInput,
  type GeneralOrgError,
  type GeneralOrgResponse,
  type GeneralOrgSuccess,
  type GetFullOrgResponse,
  type GetInvitationResponse,
  type GetOrgInput,
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

  getFullOrg({
    id,
    slug,
    memberQuery: {
      page: memberPage,
      limit: memberLimit,
      keyword: memberKeyword,
    },
    invitationQuery: {
      page: invitationPage,
      limit: invitationLimit,
      keyword: invitationKeyword,
    },
  }: GetOrgInput): Promise<GetFullOrgResponse> {
    return this._serviceExecutor.runSafely(
      async () => {
        const memberOffset = (memberPage - 1) * memberLimit;
        const invitationOffset = (invitationPage - 1) * invitationLimit;

        const data = await this._repo.getFullOrg({
          id,
          slug,
          memberQuery: {
            skip: memberOffset,
            take: memberLimit,
            keyword: memberKeyword,
          },
          invitationQuery: {
            skip: invitationOffset,
            take: invitationLimit,
            keyword: invitationKeyword,
          },
        });

        if (!data) throw new Error('Organization not found');

        return {
          org: data.org,
          member: {
            data: data.member.data,
            pagination: buildPagination({
              currentPage: memberPage,
              limit: memberLimit,
              totalItems: data.member.totalMemberCount,
            }),
          },
          invitation: {
            data: data.invitation.data,
            pagination: buildPagination({
              currentPage: invitationPage,
              limit: invitationLimit,
              totalItems: data.invitation.totalInvitationCount,
            }),
          },
        };
      },
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
