import type { Prisma, User } from '@/generated/prisma/client';
import { prisma } from '@/lib';
import type { DefaultArgs } from '@prisma/client/runtime/client';
import { IRepository } from '../IRepository';

export interface IUserRepository extends IRepository<typeof prisma.user> {
  getUsers(
    skip: number,
    take: number,
    orderBy?: Prisma.UserOrderByWithRelationInput[],
    keyword?: string
  ): Promise<{ data: User[]; total: number }>;

  getUserById(id: User['stripeCustomerId']): Promise<User | null>;

  iterateUsers({ batchSize }: { batchSize: number }): AsyncGenerator<User>;
}

export class UserRepository implements IUserRepository {
  private readonly _delegate = prisma.user;

  constructor() {}

  get model(): Prisma.UserDelegate<
    DefaultArgs,
    { omit: Prisma.GlobalOmitConfig | undefined }
  > {
    return this._delegate;
  }

  async getUsers(
    skip: number,
    take: number,
    orderBy?: Prisma.UserOrderByWithRelationInput[],
    keyword?: string
  ): Promise<{ data: User[]; total: number }> {
    const where: Prisma.UserWhereInput = keyword
      ? {
          OR: [
            { id: keyword },
            { email: { mode: 'insensitive', contains: keyword } },
            { name: { mode: 'insensitive', contains: keyword } },
          ],
        }
      : {};

    const [data, total] = await prisma.$transaction([
      this._delegate.findMany({ where, skip, take, orderBy }),
      this._delegate.count({ where }),
    ]);

    return { data, total };
  }

  getUserById(id: User['id']): Promise<User | null> {
    return this._delegate.findUnique({ where: { id } });
  }

  async *iterateUsers({
    batchSize,
  }: {
    batchSize: number;
  }): AsyncGenerator<User> {
    let cursorId: string | undefined = undefined;

    while (true) {
      const users: User[] = await prisma.user.findMany({
        take: batchSize,
        skip: cursorId ? 1 : 0,
        cursor: { id: cursorId },
        orderBy: { id: 'asc' },
      });
      if (users.length === 0) break;

      for (const user of users) yield user;

      cursorId = users.at(-1)?.id;
    }
  }
}
