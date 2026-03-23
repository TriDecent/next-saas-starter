import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/components/ui';
import { CreditCard } from 'lucide-react';

export function EmptySubscription() {
  return (
    <Empty className='from-card/20 to-card/80 border bg-linear-to-tr'>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <CreditCard />
        </EmptyMedia>
        <EmptyTitle>My subscriptions</EmptyTitle>
        <EmptyDescription>
          You do not have any active subscriptions yet. Pick a plan below to get
          started.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <Button type='button' variant='outline' size='sm' disabled>
          No active subscription
        </Button>
      </EmptyContent>
    </Empty>
  );
}
