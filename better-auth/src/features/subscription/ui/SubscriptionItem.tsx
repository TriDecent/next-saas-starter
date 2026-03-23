import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from '@/shared/components/ui';
import type { MySubscription } from '../types';
import {
  compactId,
  formatDate,
  formatDateRange,
  getStatusVariant,
  toReadableLabel,
  toTitleCase,
} from '../utils';

export function SubscriptionItem({
  subscription,
}: {
  subscription: MySubscription;
}) {
  const limits = subscription.limits ? Object.entries(subscription.limits) : [];
  const periodLabel = subscription.cancelAtPeriodEnd
    ? 'Cancels on'
    : 'Renews on';
  const periodDate = subscription.cancelAtPeriodEnd
    ? (subscription.cancelAt ?? subscription.periodEnd)
    : subscription.periodEnd;

  return (
    <Card key={subscription.id} className='gap-4'>
      <CardHeader className='gap-3'>
        <CardTitle className='flex justify-between text-base'>
          {toTitleCase(subscription.plan)}
          <div className='flex flex-wrap items-center gap-2'>
            {subscription.billingInterval ? (
              <Badge variant='secondary'>
                {toTitleCase(subscription.billingInterval)}
              </Badge>
            ) : null}
            <Badge variant={getStatusVariant(subscription.status)}>
              {toReadableLabel(subscription.status)}
            </Badge>
          </div>
        </CardTitle>

        <CardDescription>
          Subscription {compactId(subscription.id)}
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-3'>
        <dl className='grid grid-cols-1 gap-3 text-sm sm:grid-cols-2'>
          <InfoRow
            label='Reference'
            value={compactId(subscription.referenceId)}
          />
          <InfoRow
            label='Stripe subscription'
            value={compactId(subscription.stripeSubscriptionId)}
          />
          <InfoRow
            label='Period start'
            value={formatDate(subscription.periodStart)}
          />
          <InfoRow label={periodLabel} value={formatDate(periodDate)} />
          <InfoRow
            label='Trial'
            value={formatDateRange(
              subscription.trialStart,
              subscription.trialEnd
            )}
          />
          <InfoRow
            label='Seats'
            value={
              typeof subscription.seats === 'number'
                ? String(subscription.seats)
                : 'N/A'
            }
          />
        </dl>

        {limits.length ? (
          <>
            <Separator />
            <div className='space-y-2'>
              <p className='text-muted-foreground text-xs font-medium'>
                Limits
              </p>
              <div className='flex flex-wrap gap-2'>
                {limits.map(([key, value]) => (
                  <Badge key={key} variant='outline'>
                    {toTitleCase(key)}: {String(value)}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </CardContent>

      <CardFooter className='gap-2 pt-0'>
        <Button type='button' variant='outline' size='sm' disabled>
          Manage plan
        </Button>
        <Button type='button' variant='ghost' size='sm' disabled>
          Open invoices
        </Button>
      </CardFooter>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='space-y-1'>
      <dt className='text-muted-foreground text-xs uppercase'>{label}</dt>
      <dd className='font-medium'>{value}</dd>
    </div>
  );
}
