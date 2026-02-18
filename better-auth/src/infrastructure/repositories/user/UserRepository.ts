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
}
