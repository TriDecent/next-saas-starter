import type { AuthorizeReferenceAction } from '@better-auth/stripe';
import type { InferSubjects } from '@casl/ability';
import { defineOrgAbilityFor } from '../org-ability';
import type { OrgUserContext } from '../types';

type SubscriptionSubject = InferSubjects<{ kind: 'Subscription' }>;
type SubscriptionAction = AuthorizeReferenceAction;
export type SubscriptionAbilityTuple = [
  SubscriptionAction,
  SubscriptionSubject,
];

export function getOrgSubscriptionPolicyFor(ctx: OrgUserContext) {
  const ability = defineOrgAbilityFor(ctx);

  return {} as const;
}
