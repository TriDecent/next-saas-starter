import type { Invitation } from '@/generated/prisma/client';
import type { InferSubjects } from '@casl/ability';
import type { AuthSession } from '../../../../lib/auth';
import { defineAbilityFor } from '../ability';

type InvitationWithType = Invitation & { kind: 'Invitation' };
export type InvitationSubject = InferSubjects<InvitationWithType>;
export type InvitationAction = '';

export function getInvitationPolicyFor(user: AuthSession['user']) {
  const ability = defineAbilityFor(user);

  return {} as const;
}
