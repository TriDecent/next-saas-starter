import type { Organization, User } from '@/generated/prisma/client';
import type { GlobalOmitConfig } from '@/generated/prisma/internal/prismaNamespace';
import type { OrganizationDelegate } from '@/generated/prisma/models';
import { prisma } from '@/lib';
import type { DefaultArgs } from '@prisma/client/runtime/client';
import { IRepository } from '../IRepository';
import type { OrganizationWithRole } from './types';

export interface IOrganizationRepository extends IRepository<
  typeof prisma.organization
> {
  listOrganizationsForUser(userId: User['id']): Promise<OrganizationWithRole[]>;
  getAuthorizedUserIdsForOrg(orgId: Organization['id']): Promise<string[]>;
}

export class OrganizationRepository implements IOrganizationRepository {
  private readonly _delegate = prisma.organization;

  constructor() {}

  get model(): OrganizationDelegate<
    DefaultArgs,
    { omit: GlobalOmitConfig | undefined }
  > {
    return prisma.organization;
  }

  async listOrganizationsForUser(
    userId: User['id']
  ): Promise<OrganizationWithRole[]> {
    const orgs = await this._delegate.findMany({
      where: { members: { some: { userId } } },
      include: {
        _count: { select: { members: true } },
        members: { where: { userId }, select: { role: true } },
      },
    });

    return orgs.map(({ _count, members, ...org }) => ({
      ...org,
      memberCounts: _count.members,
      currentUserRole: members.at(0)?.role ?? '',
    }));
  }

  async getAuthorizedUserIdsForOrg(
    orgId: Organization['id']
  ): Promise<string[]> {
    const org = await this._delegate.findUnique({
      where: { id: orgId },
      select: { members: { select: { id: true } } },
    });

    return org ? org.members.map(member => member.id) : [];
  }
}
