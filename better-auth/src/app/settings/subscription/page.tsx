import { MySubscriptions, SubscriptionPlans } from '@/features/subscription';
import { getSubscriptionService } from '@/services';
import { Badge } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { RouteContextProvider } from '@/shared/context';
import type { Metadata } from 'next';

export const metadata: Metadata = ROUTES.settings.nested.subscription.metadata;

export default async function SubscriptionPage() {
  const service = await getSubscriptionService(
    ROUTES.settings.nested.subscription.href
  );
  const response = await service.getSubscriptionOverview();
  if (response.type === 'error') throw new Error(response.payload.message);

  const { activeSubscriptions, plans, currentPlan } = response.payload;

  return (
    <div className='space-y-16'>
      <RouteContextProvider
        value={{
          callbackUrl: ROUTES.settings.nested.subscription.href,
        }}
      >
        <section className='space-y-4'>
          <MySubscriptionsHeader
            subscriptionCount={activeSubscriptions.length}
          />
          <MySubscriptions subscriptions={activeSubscriptions} />
        </section>

        <section>
          <SubscriptionPlans plans={plans} currentPlan={currentPlan} />
        </section>
      </RouteContextProvider>
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
