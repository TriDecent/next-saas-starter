import type {
  IOrganizationRepository,
  OrganizationWithRole,
} from '@/infrastructure/repositories/organization';
import { auth } from '@/lib/auth';
import { defineAbilityFor } from '@/lib/casl';
import type { IServiceExecutor } from '../ServiceExecutor';
import type { ServiceResponse } from '../types';
import type {
  CreateInvitationInput,
  CreateOrgInput,
  GeneralOrgResponse,
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

  get actor() {
    return this._serviceExecutor.actor;
  }
  private get headers() {
    return this._serviceExecutor.headers;
  }
}
