import {
  sendSubscriptionCanceledEmail,
  sendSubscriptionCompleteEmail,
  sendTrialEndEmail,
  sendTrialExpireEmail,
  sendTrialStartEmail,
} from '@/features/email';
import { getUserRepo } from '@/infrastructure/repositories';
import { type StripeOptions, type StripePlan } from '@better-auth/stripe';
import { stripeClient } from '../stripe';

const sharedFreeTrialConfig: StripePlan['freeTrial'] = {
  days: 14,
  onTrialStart: async subscription => {
    const user = await getUserRepo().getUserById(subscription.referenceId);
    if (!user) return;

    console.log('Trial started for user:', user.email);
    await sendTrialStartEmail({
      to: user.email,
      subscription,
      userName: user.name,
    });
  },
  onTrialEnd: async ({ subscription }) => {
    const user = await getUserRepo().getUserById(subscription.referenceId);
    if (!user) return;

    console.log('Trial ending soon for user:', user.email);
    await sendTrialEndEmail({
      to: user.email,
      subscription,
      userName: user.name,
    });
  },
  onTrialExpired: async subscription => {
    const user = await getUserRepo().getUserById(subscription.referenceId);
    if (!user) return;

    console.log('Trial expired for user:', user.email);
    await sendTrialExpireEmail({
      to: user.email,
      subscription,
      userName: user.name,
    });
  },
};

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
    freeTrial: sharedFreeTrialConfig,
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
    freeTrial: sharedFreeTrialConfig,
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
    freeTrial: sharedFreeTrialConfig,
  },
} as const satisfies Record<'standard' | 'pro' | 'enterprise', StripePlan>;

export const stripeConfigs = {
  stripeClient,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,

  createCustomerOnSignUp: true,
  subscription: {
    enabled: true,
    plans: Object.values(SUBSCRIPTION_PLAN),

    onSubscriptionComplete: async (data, context) => {
      const session = context.context.session;
      if (!session) return;

      console.log('Subscription completed for user:', session.user.email);

      sendSubscriptionCompleteEmail({
        to: session.user.email,
        userName: session.user.name,
        subscription: data.subscription,
      });
    },
    onSubscriptionCreated: async data => {
      const user = await getUserRepo().getUserById(
        data.subscription.referenceId
      );
      if (!user) return;

      console.log('Subscription created for user:', user.email);

      sendSubscriptionCompleteEmail({
        to: user.email,
        userName: user.name,
        subscription: data.subscription,
      });
    },
    onSubscriptionCancel: async data => {
      const user = await getUserRepo().getUserById(
        data.subscription.referenceId
      );
      if (!user) return;

      console.log('Subscription canceled for user:', user.email);

      sendSubscriptionCanceledEmail({
        to: user.email,
        userName: user.name,
        data: data,
      });
    },
  },
} satisfies StripeOptions;
