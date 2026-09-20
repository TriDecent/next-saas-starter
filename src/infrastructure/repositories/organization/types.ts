import type { Organization } from '@/generated/prisma/client';

export type OrganizationWithRole = Organization & {
  memberCounts: number;
  currentUserRole: string;
};
