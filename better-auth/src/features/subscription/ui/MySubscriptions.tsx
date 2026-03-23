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
      {subscriptions.length > 0 ? (
        subscriptions.map(subscription => (
          <SubscriptionItem key={subscription.id} subscription={subscription} />
        ))
      ) : (
        <EmptySubscription />
      )}
    </div>
  );
}
