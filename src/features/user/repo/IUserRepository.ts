import type { Prisma, User } from '@/generated/prisma/client';

export interface IUserRepository {
  getUsers(
    skip: number,
    take: number,
    orderBy?: Prisma.UserOrderByWithRelationInput[],
    keyword?: string
  ): Promise<{ data: User[]; total: number }>;

  getUserById(id: User['id']): Promise<User | null>;

  iterateUsers({ batchSize }: { batchSize: number }): AsyncGenerator<User>;
}
