import type { Member, Organization, User } from '@/generated/prisma/client';

export type UserMembership = { user: User; member: Member; org: Organization };
