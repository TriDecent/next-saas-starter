import { AppPolicy } from '@/features/authorization/global';
import type { Session } from '@/generated/prisma/client';
import type { IAuthenticatedExecutor } from '@/infrastructure/executors';
import { auth } from '@/lib/auth';
import { buildPagination } from '@/shared/pagination';
import type { ServiceResult } from '@/shared/types';
import { getErrorMessage } from '@/shared/utils';
import type { IOrgRepository, OrgMembershipSummary } from '../repo';
import {
  type CreateOrgInput,
  type GetOrgDetailsResult,
  type GetOrgInput,
  type OrgMutationResult,
  type RemoveUserInput,
  type SetActiveOrgInput,
  type UpdateOrgInput,
  type UpdateRoleInput,
} from './org-dtos';

export class OrganizationService {
  private readonly _orgPolicy = AppPolicy.getOrgPolicyFor(this.actor);

  constructor(
    private readonly _serviceExecutor: IAuthenticatedExecutor,
    private readonly _repo: IOrgRepository,
    private readonly _currentSession: Session,
    private readonly _headers: Headers
  ) {}

  createOrg(params: CreateOrgInput): Promise<OrgMutationResult> {
    return this._serviceExecutor.runSafely(async () => {
      this._orgPolicy.assertCanCreateOrg();

      await auth.api.createOrganization({
        body: params,
        headers: this._headers,
      });
    }, this.handleError);
  }

  deleteOrg(organizationId: string): Promise<OrgMutationResult> {
    return this._serviceExecutor.runSafely(async () => {
      await auth.api.deleteOrganization({
        body: { organizationId },
        headers: this._headers,
      });
    }, this.handleError);
  }

  updateOrg(params: UpdateOrgInput): Promise<OrgMutationResult> {
    return this._serviceExecutor.runSafely(async () => {
      await auth.api.updateOrganization({
        body: params,
        headers: this._headers,
      });
    }, this.handleError);
  }

  getActiveOrgId() {
    return this._currentSession.activeOrganizationId;
  }

  listMyOrgs(): Promise<
    ServiceResult<OrgMembershipSummary[], { message: string }>
  > {
    return this._serviceExecutor.runSafely(
      () => this._repo.listOrganizationsForUser(this.actor.id),
      this.handleError
    );
  }

  toggleOrgStatus(params: SetActiveOrgInput): Promise<OrgMutationResult> {
    return this._serviceExecutor.runSafely(async () => {
      const currentActiveOrgId = this.getActiveOrgId();
      const isSameOrg = currentActiveOrgId === params.organizationId;

      await auth.api.setActiveOrganization({
        body: isSameOrg
          ? { organizationId: null, organizationSlug: undefined }
          : params,
        headers: this._headers,
      });
    }, this.handleError);
  }

  getOrgDetails({
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
  }: GetOrgInput): Promise<GetOrgDetailsResult> {
    return this._serviceExecutor.runSafely(async () => {
      const memberOffset = (memberPage - 1) * memberLimit;
      const invitationOffset = (invitationPage - 1) * invitationLimit;

      const data = await this._repo.getOrgDetails({
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
    }, this.handleError);
  }

  updateRole(params: UpdateRoleInput): Promise<OrgMutationResult> {
    return this._serviceExecutor.runSafely(async () => {
      await auth.api.updateMemberRole({
        body: params,
        headers: this._headers,
      });
    }, this.handleError);
  }

  removeMember(params: RemoveUserInput): Promise<OrgMutationResult> {
    return this._serviceExecutor.runSafely(async () => {
      await auth.api.removeMember({ body: params, headers: this._headers });
    }, this.handleError);
  }

  get actor() {
    return this._serviceExecutor.actor;
  }

  private handleError(error: unknown): { message: string } {
    return { message: getErrorMessage(error) };
  }
}
