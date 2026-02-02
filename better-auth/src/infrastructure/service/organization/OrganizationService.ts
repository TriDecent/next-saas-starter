import type { IOrganizationRepository } from '@/infrastructure/repositories/organization';
import { auth } from '@/lib/auth';
import { defineAbilityFor } from '@/lib/casl';
import type { IServiceExecutor } from '../ServiceExecutor';
import type { CreateOrgInput } from './org-dtos';

export class OrganizationService {
  constructor(
    private readonly _serviceExecutor: IServiceExecutor,
    private readonly _repo: IOrganizationRepository
  ) {}

  createOrg(params: CreateOrgInput) {
    const ability = defineAbilityFor(this.actor);
    if (ability.cannot('create', 'Organization'))
      return { type: 'error', payload: { message: 'Unauthorized' } } as const;

    return this._serviceExecutor.runSafely(async () => {
      await auth.api.createOrganization({
        body: params,
        headers: this.headers,
      });

      return undefined;
    });
  }

  listMyOrgs() {
    return this._serviceExecutor.runSafely(async () =>
      this._repo.listOrganizationsForUser(this.actor.id)
    );
  }

  get actor() {
    return this._serviceExecutor.actor;
  }
  private get headers() {
    return this._serviceExecutor.headers;
  }
}
