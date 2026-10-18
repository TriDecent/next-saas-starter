import type { GlobalOmitConfig } from '@/generated/prisma/internal/prismaNamespace';
import type { InvitationDelegate } from '@/generated/prisma/models';
import { prisma } from '@/lib';
import type { DefaultArgs } from '@prisma/client/runtime/client';

export type IInvitationRepository = object;

export class InvitationRepository implements IInvitationRepository {
  private readonly _delegate = prisma.invitation;
  constructor() {}

  get model(): InvitationDelegate<
    DefaultArgs,
    { omit: GlobalOmitConfig | undefined }
  > {
    return this._delegate;
  }
}
