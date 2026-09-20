import { cn } from '@/shared/utils';
import type { MySubscription } from '../types';
import { EmptySubscription } from './EmptySubscription';
import { SubscriptionItem } from './SubscriptionItem';

export function MySubscriptions({
  subscriptions,
}: {
  subscriptions: MySubscription[];
}) {
  return (
    <div className='grid gap-4 lg:grid-cols-2'>
      {subscriptions.length === 0 ? (
        <div className='col-span-full'>
          <EmptySubscription />
        </div>
      ) : (
        subscriptions.map(subscription => (
          <div
            key={subscription.id}
            className={cn(
              subscriptions.length === 1 ? 'col-span-full' : 'col-span-1'
            )}
          >
            <SubscriptionItem subscription={subscription} />
          </div>
        ))
      )}
    </div>
  );
}
