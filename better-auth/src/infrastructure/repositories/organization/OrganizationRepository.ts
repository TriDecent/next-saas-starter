import type { User } from '@/generated/prisma/client';
import { prisma } from '@/lib';
import { BaseRepository, type IBaseRepository } from '../BaseRepository';
import type { OrganizationWithRole } from './types';

export interface IOrganizationRepository extends IBaseRepository<
  typeof prisma.organization
> {
  listOrganizationsForUser(userId: User['id']): Promise<OrganizationWithRole[]>;
}

export class OrganizationRepository
  extends BaseRepository<typeof prisma.organization>
  implements IOrganizationRepository
{
  constructor() {
    super(prisma.organization);
  }

  async listOrganizationsForUser(
    userId: User['id']
  ): Promise<OrganizationWithRole[]> {
    const orgs = await this.delegate.findMany({
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
}
