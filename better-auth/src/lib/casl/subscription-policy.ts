import { Subscription } from '@better-auth/stripe';
import type { InferSubjects } from '@casl/ability';
import type { AuthSession } from '../auth';
import { defineAbilityFor } from './ability';

type BaseSubscription = Subscription & { owners?: string[] };
type SubscriptionWithType = BaseSubscription & { kind: 'Subscription' };
export type SubscriptionSubject = InferSubjects<SubscriptionWithType>;
export type SubscriptionAction = '';

type SubscriptionRequiredOwners = Subscription & { owners: string[] };
export function getSubscriptionPolicyFor(user: AuthSession['user']) {
  const ability = defineAbilityFor(user);

  return {
    canRead: (subscription?: SubscriptionRequiredOwners) =>
      subscription
        ? ability.can('read', { ...subscription, kind: 'Subscription' })
        : ability.can('read', 'Subscription'),
  } as const;
}
