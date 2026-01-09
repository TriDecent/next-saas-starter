import type { Prisma, User } from '@/generated/prisma/client';
import { prisma } from '@/lib';
import { BaseRepository, type IBaseRepository } from './BaseRepository';

export interface IUserRepository extends IBaseRepository<typeof prisma.user> {
  getUsers(
    skip: number,
    take: number,
    orderBy?: Prisma.UserOrderByWithRelationInput[],
    keyword?: string
  ): Promise<{ data: User[]; total: number }>;
}

class UserRepository
  extends BaseRepository<typeof prisma.user>
  implements IUserRepository
{
  constructor() {
    super(prisma.user);
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
      this.delegate.findMany({ where, skip, take, orderBy }),
      this.delegate.count({ where }),
    ]);

    return { data, total };
  }
}

export const userRepo = new UserRepository();
