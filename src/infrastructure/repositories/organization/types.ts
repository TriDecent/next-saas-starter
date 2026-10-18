import type {
  Invitation,
  Member,
  Organization,
  User,
} from '@/generated/prisma/client';

export type OrganizationWithRole = Organization & {
  memberCounts: number;
  currentUserRole: string;
};

export type GetFullOrgInput = Partial<Pick<Organization, 'id' | 'slug'>> & {
  memberQuery: { skip: number; take: number; keyword?: string };
  invitationQuery: { skip: number; take: number; keyword?: string };
};
export type FullOrg = { org: Organization } & {
  member: {
    data: (Member & {
      user: Pick<
        User,
        | 'id'
        | 'createdAt'
        | 'updatedAt'
        | 'email'
        | 'emailVerified'
        | 'name'
        | 'image'
      >;
    })[];
    totalMemberCount: number;
  };
  invitation: { data: Invitation[]; totalInvitationCount: number };
};
