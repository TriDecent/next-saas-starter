import type { auth } from '@/lib/auth';
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
export type SubscriptionPlan = {
  name: 'standard' | 'pro' | 'enterprise';
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
