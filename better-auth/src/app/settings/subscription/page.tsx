import { MySubscriptions, SubscriptionPlans } from '@/features/subscription';
import type { SubscriptionPlan } from '@/lib/auth';
import { getSubscriptionService } from '@/services';
import { Badge } from '@/shared/components/ui';
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
  const cyclePlan = activeSubscriptions.at(0)?.billingInterval;

  return (
    <div className='space-y-16'>
      <section className='space-y-4'>
        <MySubscriptionsHeader subscriptionCount={activeSubscriptions.length} />
        <MySubscriptions subscriptions={activeSubscriptions} />
      </section>

      <section>
        <SubscriptionPlans
          plans={plans}
          subscribedPlan={
            subscribedPlan && cyclePlan
              ? {
                  name: subscribedPlan as SubscriptionPlan,
                  interval: cyclePlan,
                }
              : undefined
          }
        />
      </section>
    </div>
  );
}

function MySubscriptionsHeader({
  subscriptionCount,
}: {
  subscriptionCount: number;
}) {
  return (
    <div className='flex items-end justify-between gap-3'>
      <div>
        <h3 className='text-lg font-semibold'>My subscriptions</h3>
        <p className='text-muted-foreground text-sm'>
          Track current plans, billing cycle, renewal dates, and status.
        </p>
      </div>
      <Badge variant='secondary'>
        {subscriptionCount}{' '}
        {subscriptionCount > 1 ? 'subscriptions' : 'subscription'}
      </Badge>
    </div>
  );
}

//  <SectionHeader
//     icon={Sparkles}
//     title={'Billing'}
//     description='Pick the plan that matches your team size and governance needs. UI preview only.'
//   />
