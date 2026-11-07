import type { Organization, Prisma, User } from '@/generated/prisma/client';
import { prisma } from '@/lib';
import type { IUserRepository } from './IUserRepository';
import type { UserMembership } from './types';

export class PrismaUserRepository implements IUserRepository {
  private readonly _delegate = prisma.user;

  constructor() {}

  async getUserMembership({
    userId,
    orgId,
  }: {
    userId: User['id'];
    orgId: Organization['id'];
  }): Promise<UserMembership | null> {
    const result = await this._delegate.findUnique({
      where: { id: userId, members: { some: { organizationId: orgId } } },
      include: {
        members: {
          where: { organizationId: orgId },
          take: 1,
          include: { organization: true },
        },
      },
    });

    //  there should be at most one member in the result.
    const member = result?.members.at(0);

    return result && member
      ? {
          user: result,
          member,
          org: member.organization,
        }
      : null;
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
            { id: { mode: 'insensitive', contains: keyword } },
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
      const users: User[] = await this._delegate.findMany({
        take: batchSize,
        skip: cursorId ? 1 : 0,
        cursor: cursorId ? { id: cursorId } : undefined,
        orderBy: { id: 'asc' },
      });
      if (users.length === 0) break;

      yield* users;

      cursorId = users.at(-1)?.id;
    }
  }
}
