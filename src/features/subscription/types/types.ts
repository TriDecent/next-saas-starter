import type { ListActiveSubscriptionResponse } from '@/features/subscription/server';

type Subscription = Extract<
  ListActiveSubscriptionResponse,
  { type: 'success' }
>['payload'];
export type MySubscription = Subscription[number];
