import type { Invitation } from '@/generated/prisma/client';
import { ForbiddenError, type InferSubjects } from '@casl/ability';
import type { AuthSession } from '../../../../lib/auth';
import { defineAbilityFor } from '../ability';

type InvitationWithType = Invitation & { kind: 'Invitation' };
export type InvitationSubject = InferSubjects<InvitationWithType>;
export type InvitationAction = '';

export function getInvitationPolicyFor(user: AuthSession['user']) {
  const ability = defineAbilityFor(user);
  const forbiddenError = ForbiddenError.from(ability);

  return {
    assertCanCreateInvitation: () =>
      forbiddenError
        .setMessage('You are not authorized to create an invitation.')
        .throwUnlessCan('create', 'Invitation'),
  } as const;
}
