import { prisma } from '@/lib';

export type IInvitationRepository = object;

export class InvitationRepository implements IInvitationRepository {
  private readonly _delegate = prisma.invitation;
  constructor() {}
}
