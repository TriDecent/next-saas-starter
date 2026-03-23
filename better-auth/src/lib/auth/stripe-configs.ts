import { type StripeOptions, type StripePlan } from '@better-auth/stripe';
import { stripeClient } from '../stripe';

export const SUBSCRIPTION_PLAN = {
  standard: {
    name: 'standard',
    priceId: process.env.STRIPE_STANDARD_SUBSCRIPTION_MONTHLY_PRICE_ID!,
    annualDiscountPriceId:
      process.env.STRIPE_STANDARD_SUBSCRIPTION_YEARLY_PRICE_ID!,
    limits: {
      projects: 1,
      teamMembers: 1,
      storageMB: 1024,
      apiRequests: 1000,
    },
  },
  pro: {
    name: 'pro',
    priceId: process.env.STRIPE_PRO_SUBSCRIPTION_MONTHLY_PRICE_ID!,
    annualDiscountPriceId: process.env.STRIPE_PRO_SUBSCRIPTION_YEARLY_PRICE_ID!,
    limits: {
      projects: 10,
      teamMembers: 5,
      storageMB: 10240,
      apiRequests: 50000,
    },
  },
  enterprise: {
    name: 'enterprise',
    priceId: process.env.STRIPE_ENTERPRISE_SUBSCRIPTION_MONTHLY_PRICE_ID!,
    annualDiscountPriceId:
      process.env.STRIPE_ENTERPRISE_SUBSCRIPTION_YEARLY_PRICE_ID!,
    limits: {
      projects: 9999,
      teamMembers: 100,
      storageMB: 512000,
      apiRequests: 9999999,
    },
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
