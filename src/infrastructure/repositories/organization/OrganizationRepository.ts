import type { Organization, Prisma, User } from '@/generated/prisma/client';
import type { GlobalOmitConfig } from '@/generated/prisma/internal/prismaNamespace';
import type { OrganizationDelegate } from '@/generated/prisma/models';
import { prisma } from '@/lib';
import type { DefaultArgs } from '@prisma/client/runtime/client';
import type {
  OrgDetails,
  OrgDetailsQuery,
  OrgMembershipSummary,
} from './types';

export interface IOrganizationRepository {
  listOrganizationsForUser(userId: User['id']): Promise<OrgMembershipSummary[]>;
  getAuthorizedUserIdsForOrg(orgId: Organization['id']): Promise<string[]>;
  getOrgDetails(params: OrgDetailsQuery): Promise<OrgDetails | null>;
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
  ): Promise<OrgMembershipSummary[]> {
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
      select: { members: { select: { userId: true } } },
    });

    return org ? org.members.map(member => member.userId) : [];
  }

  async getOrgDetails({
    id,
    slug,
    memberQuery: { skip: memberSkip, take: memberTake, keyword: memberKeyword },
    invitationQuery: {
      skip: invitationSkip,
      take: invitationTake,
      keyword: invitationKeyword,
    },
  }: OrgDetailsQuery): Promise<OrgDetails | null> {
    const memberWhere: Prisma.MemberWhereInput | undefined = memberKeyword
      ? {
          user: {
            OR: [
              { id: { mode: 'insensitive', contains: memberKeyword } },
              { email: { mode: 'insensitive', contains: memberKeyword } },
              { name: { mode: 'insensitive', contains: memberKeyword } },
            ],
          },
        }
      : undefined;

    const invitationWhere: Prisma.InvitationWhereInput | undefined =
      memberKeyword
        ? {
            OR: [
              { id: { mode: 'insensitive', contains: invitationKeyword } },
              { email: { mode: 'insensitive', contains: invitationKeyword } },

              {
                organization: {
                  OR: [
                    {
                      id: { mode: 'insensitive', contains: invitationKeyword },
                      name: {
                        mode: 'insensitive',
                        contains: invitationKeyword,
                      },
                    },
                  ],
                },
              },
            ],
          }
        : undefined;

    const data = await this._delegate.findUnique({
      where: { id, slug },
      include: {
        members: {
          skip: memberSkip,
          take: memberTake,
          where: memberWhere,
          include: {
            user: {
              select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                email: true,
                emailVerified: true,
                name: true,
                image: true,
              },
            },
          },
        },
        invitations: {
          skip: invitationSkip,
          take: invitationTake,
          where: invitationWhere,
        },
        _count: { select: { members: true, invitations: true } },
      },
    });

    if (!data) return null;

    return {
      org: data,
      member: { data: data.members, totalMemberCount: data._count.members },
      invitation: {
        data: data.invitations,
        totalInvitationCount: data._count.invitations,
      },
    };
  }
}
