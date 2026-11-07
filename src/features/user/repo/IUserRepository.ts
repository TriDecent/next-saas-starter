import type { Organization, Prisma, User } from '@/generated/prisma/client';
import type { UserMembership } from './types';

export interface IUserRepository {
  getUsers(
    skip: number,
    take: number,
    orderBy?: Prisma.UserOrderByWithRelationInput[],
    keyword?: string
  ): Promise<{ data: User[]; total: number }>;

  getUserById(id: User['id']): Promise<User | null>;

  iterateUsers({ batchSize }: { batchSize: number }): AsyncGenerator<User>;

  getUserMembership(query: {
    userId: User['id'];
    orgId: Organization['id'];
  }): Promise<UserMembership | null>;
}
