import type { Invitation, User } from '@/generated/prisma/client';
import { ForbiddenError, type InferSubjects } from '@casl/ability';
import { defineGlobalAbilityFor } from '../global-ability';

type InvitationWithType = Invitation & { kind: 'Invitation' };
export type InvitationSubject = InferSubjects<InvitationWithType>;
export type InvitationAction = '';

export function getGlobalInvPolicyFor(user: User) {
  const ability = defineGlobalAbilityFor(user);
  const forbiddenError = ForbiddenError.from(ability);

  return {
    assertCanCreateInvitation: () =>
      forbiddenError
        .setMessage('You are not authorized to create an invitation.')
        .throwUnlessCan('create', 'Invitation'),
  } as const;
}
