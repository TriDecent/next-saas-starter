import type { ListActiveSubscriptionResponse } from '@/services/subscription';

type Subscription = Extract<
  ListActiveSubscriptionResponse,
  { type: 'success' }
>['payload'];
export type MySubscription = Subscription[number];
