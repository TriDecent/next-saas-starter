import { SubscriptionPlans } from '@/features/subscription';
import type { SubscriptionPlan } from '@/lib/auth';
import { getSubscriptionService } from '@/services';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = ROUTES.settings.nested.subscription.metadata;

export default async function SubscriptionPage() {
  const service = await getSubscriptionService(
    ROUTES.settings.nested.subscription.href
  );
  const [plans, activeSubscriptionsResponse] = await Promise.all([
    service.getSubscriptionPlans(),
    service.listActiveSubscription(),
  ]);

  if (activeSubscriptionsResponse.type === 'error')
    throw new Error(activeSubscriptionsResponse.payload.message);

  const activeSubscriptions = activeSubscriptionsResponse.payload;
  const subscribedPlan = activeSubscriptions.at(0)?.plan;

  return (
    <SubscriptionPlans
      plans={plans}
      subscribedPlan={subscribedPlan as SubscriptionPlan | undefined}
    />
  );
}

//  <SectionHeader
//     icon={Sparkles}
//     title={'Billing'}
//     description='Pick the plan that matches your team size and governance needs. UI preview only.'
//   />
