import { prisma } from '@/lib';

export type ISubscriptionRepository = object;

export class SubscriptionRepository implements ISubscriptionRepository {
  private readonly _delegate = prisma.subscription;

  constructor() {}
}
