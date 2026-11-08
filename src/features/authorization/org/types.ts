import type { Member, Organization, User } from '@/generated/prisma/client';

export type OrgUserContext = { user: User; member: Member; org: Organization };
