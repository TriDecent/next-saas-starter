import { type StripeOptions, type StripePlan } from '@better-auth/stripe';
import { stripeClient } from '../stripe';

export const SUBSCRIPTION_PLAN = {
  standard: {
    name: 'standard',
    priceId: process.env.STRIPE_STANDARD_SUBSCRIPTION_MONTHLY_PRICE_ID!,
    annualDiscountPriceId:
      process.env.STRIPE_STANDARD_SUBSCRIPTION_YEARLY_PRICE_ID!,
    limits: {},
  },
  pro: {
    name: 'pro',
    priceId: process.env.STRIPE_PRO_SUBSCRIPTION_MONTHLY_PRICE_ID!,
    annualDiscountPriceId: process.env.STRIPE_PRO_SUBSCRIPTION_YEARLY_PRICE_ID!,
    limits: {},
  },
  enterprise: {
    name: 'enterprise',
    priceId: process.env.STRIPE_ENTERPRISE_SUBSCRIPTION_MONTHLY_PRICE_ID!,
    annualDiscountPriceId:
      process.env.STRIPE_ENTERPRISE_SUBSCRIPTION_YEARLY_PRICE_ID!,
    limits: {},
  },
} as const satisfies Record<'standard' | 'pro' | 'enterprise', StripePlan>;
export type SubscriptionPlan =
  (typeof SUBSCRIPTION_PLAN)[keyof typeof SUBSCRIPTION_PLAN]['name'];

export const stripeConfigs = {
  stripeClient,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,

  createCustomerOnSignUp: true,
  subscription: {
    enabled: true,
    plans: Object.values(SUBSCRIPTION_PLAN),
  },
} satisfies StripeOptions;
