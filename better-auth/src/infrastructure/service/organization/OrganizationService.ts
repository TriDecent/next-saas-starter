import type {
  IOrganizationRepository,
  OrganizationWithRole,
} from '@/infrastructure/repositories/organization';
import { auth } from '@/lib/auth';
import type { OrganizationWithMembersSubject } from '@/lib/casl';
import { defineAbilityFor } from '@/lib/casl';
import type { IServiceExecutor } from '../ServiceExecutor';
import type { ServiceResponse } from '../types';
import type {
  CreateInvitationInput,
  CreateOrgInput,
  GeneralOrgResponse,
  GetOrgInput,
  GetOrgResponse,
} from './org-dtos';

export class OrganizationService {
  constructor(
    private readonly _serviceExecutor: IServiceExecutor,
    private readonly _repo: IOrganizationRepository
  ) {}

  createOrg(params: CreateOrgInput): Promise<GeneralOrgResponse> {
    const ability = defineAbilityFor(this.actor);
    if (ability.cannot('create', 'Organization'))
      return Promise.resolve({
        type: 'error',
        payload: {
          message: 'You are not authorized to create an organization',
        },
      });

    return this._serviceExecutor.runSafely(async () => {
      await auth.api.createOrganization({
        body: params,
        headers: this.headers,
      });

      return undefined;
    });
  }

  listMyOrgs(): Promise<
    ServiceResponse<OrganizationWithRole[], { message: string }>
  > {
    return this._serviceExecutor.runSafely(() =>
      this._repo.listOrganizationsForUser(this.actor.id)
    );
  }

  createInvitation(params: CreateInvitationInput): Promise<GeneralOrgResponse> {
    const ability = defineAbilityFor(this.actor);
    if (ability.cannot('create', 'Invitation'))
      return Promise.resolve({
        type: 'error',
        payload: { message: 'You are not authorized to send an invitation' },
      });

    return this._serviceExecutor.runSafely(async () => {
      await auth.api.createInvitation({ body: params, headers: this.headers });

      return undefined;
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

    const ability = defineAbilityFor(this.actor);
    if (!organization) return { type: 'success', payload: organization };

    const organizationWithMemberIds = {
      ...organization,
      members: organization.members.map(member => member.userId),
      metadata: organization.metadata ?? null,
      logo: organization.logo ?? null,
      kind: 'OrganizationWithMembers',
    } satisfies OrganizationWithMembersSubject;

    if (ability.cannot('read', organizationWithMemberIds))
      return {
        type: 'error',
        payload: {
          message: 'You are not authorized to view this organization.',
        },
      };

    return response;
  }

  get actor() {
    return this._serviceExecutor.actor;
  }
  private get headers() {
    return this._serviceExecutor.headers;
  }
}
