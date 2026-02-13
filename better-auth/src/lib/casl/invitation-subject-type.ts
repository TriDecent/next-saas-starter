import type { Invitation } from '@/generated/prisma/client';
import type { InferSubjects } from '@casl/ability';

type InvitationWithType = Invitation & { kind: 'Invitation' };
export type InvitationSubject = InferSubjects<InvitationWithType>;
export type InvitationAction = '';
