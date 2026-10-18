import { MySubscriptions, SubscriptionPlans } from '@/features/subscription';
import { getSubscriptionService } from '@/infrastructure/composition/factory';
import { Badge } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { RouteContextProvider } from '@/shared/context';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = ROUTES.settings.nested.subscription.metadata;

export default async function SubscriptionPage() {
  return (
    <div className='space-y-16'>
      <RouteContextProvider
        value={{
          callbackUrl: ROUTES.settings.nested.subscription.href,
        }}
      >
        <Suspense fallback={<Skeleton />}>
          <SubscriptionOverview />
        </Suspense>
      </RouteContextProvider>
    </div>
  );
}

async function SubscriptionOverview() {
  const service = await getSubscriptionService(
    ROUTES.settings.nested.subscription.href
  );
  const response = await service.getSubscriptionOverview();
  if (response.type === 'error') throw new Error(response.payload.message);

  const { activeSubscriptions, plans, currentPlan } = response.payload;

  return (
    <>
      <section className='space-y-4'>
        <MySubscriptionsHeader subscriptionCount={activeSubscriptions.length} />
        <MySubscriptions subscriptions={activeSubscriptions} />
      </section>

      <section>
        <SubscriptionPlans plans={plans} currentPlan={currentPlan} />
      </section>
    </>
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

function Skeleton() {
  return (
    <div className='space-y-12' aria-hidden='true'>
      <section className='space-y-4'>
        <div className='flex items-end justify-between gap-3'>
          <div className='space-y-2'>
            <div className='bg-muted h-6 w-40 animate-pulse rounded' />
            <div className='bg-muted h-4 w-72 max-w-full animate-pulse rounded' />
          </div>
          <div className='bg-muted h-6 w-24 animate-pulse rounded-full' />
        </div>

        <div className='space-y-3'>
          {[0, 1].map(item => (
            <div
              key={item}
              className='border-border space-y-3 rounded-lg border p-4'
            >
              <div className='flex justify-between gap-4'>
                <div className='bg-muted h-5 w-36 animate-pulse rounded' />
                <div className='bg-muted h-5 w-20 animate-pulse rounded-full' />
              </div>
              <div className='bg-muted h-4 w-52 max-w-full animate-pulse rounded' />
            </div>
          ))}
        </div>
      </section>

      <section className='space-y-4'>
        <div className='bg-muted h-6 w-36 animate-pulse rounded' />

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {[0, 1, 2].map(item => (
            <div
              key={item}
              className='border-border space-y-4 rounded-lg border p-5'
            >
              <div className='bg-muted h-5 w-28 animate-pulse rounded' />
              <div className='bg-muted h-8 w-32 animate-pulse rounded' />
              <div className='space-y-2'>
                <div className='bg-muted h-4 w-full animate-pulse rounded' />
                <div className='bg-muted h-4 w-4/5 animate-pulse rounded' />
              </div>
              <div className='bg-muted h-9 w-full animate-pulse rounded' />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
