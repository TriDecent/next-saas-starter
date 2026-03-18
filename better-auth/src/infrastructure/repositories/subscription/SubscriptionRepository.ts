import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib';
import type { DefaultArgs } from '@prisma/client/runtime/client';
import { IRepository } from '../IRepository';

export type ISubscriptionRepository = IRepository<typeof prisma.subscription>;

export class SubscriptionRepository implements ISubscriptionRepository {
  private readonly _delegate = prisma.subscription;

  constructor() {}
  get model(): Prisma.SubscriptionDelegate<
    DefaultArgs,
    { omit: Prisma.GlobalOmitConfig | undefined }
  > {
    return this._delegate;
  }
}
