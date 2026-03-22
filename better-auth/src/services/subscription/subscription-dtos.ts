import type { auth, SubscriptionPlan } from '@/lib/auth';
import type Stripe from 'stripe';
import type {
  ExtractEndpointBody,
  ExtractEndpointQuery,
  ServiceResponse,
} from '../types';

export type UpgradeSubscriptionInput = ExtractEndpointBody<
  typeof auth.api.upgradeSubscription
>;
export type ListActiveSubscriptionsInput = ExtractEndpointQuery<
  typeof auth.api.listActiveSubscriptions
>;

export type UpgradeSubscriptionResponse = ServiceResponse<
  Awaited<ReturnType<typeof auth.api.upgradeSubscription>>,
  { message: string }
>;
export type ListActiveSubscriptionResponse = ServiceResponse<
  Awaited<ReturnType<typeof auth.api.listActiveSubscriptions>>,
  { message: string }
>;
export type SubscriptionPlanDetails = {
  name: SubscriptionPlan;
  title: string;
  subtitle: string;
  highlighted?: boolean;
  features: string[];
  prices: { monthly: PriceDetails; annual: PriceDetails };
};
type PriceDetails = {
  amount: number;
  interval: Stripe.Price.Recurring.Interval;
  currency: string;
};
export type GeneralSubscriptionResponse = ServiceResponse<
  void,
  { message: string }
>;
