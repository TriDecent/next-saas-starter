import type { Session } from '@/generated/prisma/client';
import type {
  IOrganizationRepository,
  OrganizationWithRole,
} from '@/infrastructure/repositories/organization';
import { auth, hasPermission } from '@/lib/auth';
import type { OrganizationWithMembersSubject } from '@/lib/casl';
import { defineAbilityFor } from '@/lib/casl';
import type { IServiceExecutor } from '../ServiceExecutor';
import type { ServiceResponse } from '../types';
import type {
  CreateInvitationInput,
  CreateOrgInput,
  GeneralOrgResponse,
  GetInvitationResponse,
  GetOrgInput,
  GetOrgResponse,
  RemoveUserInput,
  SetActiveOrgInput,
  UpdateOrgInput,
  UpdateRoleInput,
} from './org-dtos';

export class OrganizationService {
  constructor(
    private readonly _serviceExecutor: IServiceExecutor,
    private readonly _repo: IOrganizationRepository,
    private readonly _currentSession: Session
  ) {}

  async createOrg(params: CreateOrgInput): Promise<GeneralOrgResponse> {
    const canCreateOrg = await hasPermission(this.actor.id, {
      organization: ['create'],
    });
    if (!canCreateOrg)
      return {
        type: 'error',
        payload: {
          message: 'You are not authorized to create an organization',
        },
      };

    return this._serviceExecutor.runSafely(async () => {
      await auth.api.createOrganization({
        body: params,
        headers: this.headers,
      });
    });
  }

  deleteOrg(organizationId: string): Promise<GeneralOrgResponse> {
    return this._serviceExecutor.runSafely(async () => {
      await auth.api.deleteOrganization({
        body: { organizationId },
        headers: this.headers,
      });
    });
  }

  updateOrg(params: UpdateOrgInput): Promise<GeneralOrgResponse> {
    return this._serviceExecutor.runSafely(async () => {
      await auth.api.updateOrganization({
        body: params,
        headers: this.headers,
      });
    });
  }

  getActiveOrgId() {
    return this._currentSession.activeOrganizationId;
  }

  listMyOrgs(): Promise<
    ServiceResponse<OrganizationWithRole[], { message: string }>
  > {
    return this._serviceExecutor.runSafely(() =>
      this._repo.listOrganizationsForUser(this.actor.id)
    );
  }

  setActiveOrg(params: SetActiveOrgInput): Promise<GeneralOrgResponse> {
    return this._serviceExecutor.runSafely(async () => {
      await auth.api.setActiveOrganization({
        body: params,
        headers: this.headers,
      });
    });
  }

  async createInvitation(
    params: CreateInvitationInput
  ): Promise<GeneralOrgResponse> {
    const canCreateInvitation = await hasPermission(this.actor.id, {
      invitation: ['create'],
    });
    if (!canCreateInvitation)
      return {
        type: 'error',
        payload: { message: 'You are not authorized to send an invitation' },
      };

    return this._serviceExecutor.runSafely(async () => {
      await auth.api.createInvitation({ body: params, headers: this.headers });
    });
  }

  getInvitation(id: string): Promise<GetInvitationResponse> {
    return this._serviceExecutor.runSafely(() =>
      auth.api.getInvitation({
        query: { id },
        headers: this.headers,
      })
    );
  }

  acceptInvitation(invitationId: string): Promise<GeneralOrgResponse> {
    return this._serviceExecutor.runSafely(async () => {
      await auth.api.acceptInvitation({
        body: { invitationId },
        headers: this.headers,
      });
    });
  }

  rejectInvitation(invitationId: string): Promise<GeneralOrgResponse> {
    return this._serviceExecutor.runSafely(async () => {
      await auth.api.rejectInvitation({
        body: { invitationId },
        headers: this.headers,
      });
    });
  }

  async getFullOrganization(params: GetOrgInput): Promise<GetOrgResponse> {
    const response = await this._serviceExecutor.runSafely(() =>
      auth.api.getFullOrganization({
        query: params,
        headers: this.headers,
      })
    );
    if (response.type === 'error') return response;
    const organization = response.payload;

    if (!organization) return { type: 'success', payload: organization };

    const organizationWithMemberIds = {
      ...organization,
      members: organization.members.map(member => member.userId),
      metadata: organization.metadata ?? null,
      logo: organization.logo ?? null,
      kind: 'OrganizationWithMembers',
    } satisfies OrganizationWithMembersSubject;

    const ability = defineAbilityFor(this.actor);
    if (ability.cannot('read', organizationWithMemberIds))
      return {
        type: 'error',
        payload: {
          message: 'You are not authorized to view this organization.',
        },
      };

    return response;
  }

  updateRole(params: UpdateRoleInput): Promise<GeneralOrgResponse> {
    return this._serviceExecutor.runSafely(async () => {
      await auth.api.updateMemberRole({ body: params, headers: this.headers });
    });
  }

  removeMember(params: RemoveUserInput): Promise<GeneralOrgResponse> {
    return this._serviceExecutor.runSafely(async () => {
      await auth.api.removeMember({ body: params, headers: this.headers });
    });
  }

  cancelInvitation(invitationId: string): Promise<GeneralOrgResponse> {
    return this._serviceExecutor.runSafely(async () => {
      await auth.api.cancelInvitation({
        body: { invitationId },
        headers: this.headers,
      });
    });
  }

  get actor() {
    return this._serviceExecutor.actor;
  }
  private get headers() {
    return this._serviceExecutor.headers;
  }
}
