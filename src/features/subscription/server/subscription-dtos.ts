import type { auth, SubscriptionPlan } from '@/lib/auth';
import type {
  ExtractEndpointBody,
  ExtractEndpointQuery,
  ServiceResult,
} from '@/shared/types';
import type Stripe from 'stripe';

export type UpgradeSubscriptionInput = ExtractEndpointBody<
  typeof auth.api.upgradeSubscription
>;
export type ListActiveSubscriptionsInput = ExtractEndpointQuery<
  typeof auth.api.listActiveSubscriptions
>;
export type CreateBillingPortalInput = ExtractEndpointBody<
  typeof auth.api.createBillingPortal
>;

export type GetSubscriptionOverviewResult = ServiceResult<
  SubscriptionOverview,
  { message: string }
>;
export type SubscriptionOverview = {
  activeSubscriptions: ActiveSubscription;
  plans: SubscriptionPlanDetails[];
  currentPlan:
    | {
        name: SubscriptionPlan;
        billingInterval: Stripe.Price.Recurring.Interval;
      }
    | undefined;
};
export type UpgradeSubscriptionResult = ServiceResult<
  Awaited<ReturnType<typeof auth.api.upgradeSubscription>>,
  { message: string }
>;
export type ListActiveSubscriptionsResult = ServiceResult<
  ActiveSubscription,
  { message: string }
>;
type ActiveSubscription = Awaited<
  ReturnType<typeof auth.api.listActiveSubscriptions>
>;
export type CreateBillingPortalResult = ServiceResult<
  Awaited<ReturnType<typeof auth.api.createBillingPortal>>,
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
export type SubscriptionMutationResult = ServiceResult<
  void,
  { message: string }
>;
