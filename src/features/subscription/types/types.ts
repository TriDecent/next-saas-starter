import type { ListActiveSubscriptionsResult } from '@/features/subscription/server';

type Subscription = Extract<
  ListActiveSubscriptionsResult,
  { type: 'success' }
>['payload'];
export type MySubscription = Subscription[number];
