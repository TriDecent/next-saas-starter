import type { auth } from '@/lib/auth';
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

export type ListActiveSubscriptionResponse = ServiceResponse<
  Awaited<ReturnType<typeof auth.api.listActiveSubscriptions>>,
  { message: string }
>;
export type SubscriptionPlan = {
  name: 'standard' | 'pro' | 'enterprise';
  title: string;
  subtitle: string;
  price: string;
  caption: string;
  highlighted?: boolean;
  features: string[];
};

export type GeneralSubscriptionResponse = ServiceResponse<
  void,
  { message: string }
>;
