import { ToolTipPopover } from '@/shared/components';
import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from '@/shared/components/ui';
import { IoSettingsOutline } from 'react-icons/io5';
import { CreateBillingPortalAction } from '../create-billing-portal/CreateBillingPortalAction';
import type { MySubscription } from '../types';
import {
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
  return (
    <Card key={subscription.id} className='gap-4'>
      <SubscriptionHeader subscription={subscription} />

      <CardContent className='space-y-3'>
        <SubscriptionDetails subscription={subscription} />
        <PlanLimits
          limits={
            subscription.limits ? Object.entries(subscription.limits) : []
          }
        />
      </CardContent>

      <Separator />

      <CardFooter className='flex flex-col gap-4'>
        <span className='text-muted-foreground text-xs'>
          Click the IDs to view the full value.
        </span>
      </CardFooter>
    </Card>
  );
}

function SubscriptionHeader({
  subscription,
}: {
  subscription: MySubscription;
}) {
  return (
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

      <ToolTipPopover message={subscription.id}>
        <CardDescription className='truncate'>
          Subscription {subscription.id}
        </CardDescription>
      </ToolTipPopover>

      <CardAction>
        <Button
          type='button'
          variant='outline'
          className='flex-1 md:flex-none'
          size='sm'
          asChild
        >
          <CreateBillingPortalAction>
            <IoSettingsOutline />
            Manage plan
          </CreateBillingPortalAction>
        </Button>
      </CardAction>
    </CardHeader>
  );
}

function SubscriptionDetails({
  subscription,
}: {
  subscription: MySubscription;
}) {
  const periodLabel = subscription.cancelAtPeriodEnd
    ? 'Cancels on'
    : 'Renews on';
  const periodDate = subscription.cancelAtPeriodEnd
    ? (subscription.cancelAt ?? subscription.periodEnd)
    : subscription.periodEnd;

  return (
    <dl className='grid grid-cols-1 gap-3 text-sm sm:grid-cols-2'>
      <InfoRow label='Reference' value={subscription.referenceId} />
      <InfoRow
        label='Stripe subscription'
        value={subscription.stripeSubscriptionId ?? 'N/A'}
      />
      <InfoRow
        label='Period start'
        value={formatDate(subscription.periodStart)}
      />
      <InfoRow label={periodLabel} value={formatDate(periodDate)} />
      <InfoRow
        label='Trial'
        value={formatDateRange(subscription.trialStart, subscription.trialEnd)}
      />
      <InfoRow
        label='Seats'
        value={subscription.seats ? subscription.seats.toString() : 'N/A'}
      />
    </dl>
  );
}

function PlanLimits({ limits }: { limits: [string, unknown][] }) {
  return limits.length ? (
    <>
      <Separator />
      <div className='space-y-2'>
        <p className='text-muted-foreground text-xs font-medium'>Limits</p>
        <div className='flex flex-wrap gap-2'>
          {limits.map(([key, value]) => (
            <Badge key={key} variant='outline'>
              {toTitleCase(key)}: {String(value)}
            </Badge>
          ))}
        </div>
      </div>
    </>
  ) : null;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='space-y-1'>
      <dt className='text-muted-foreground text-xs uppercase'>{label}</dt>
      <dd className='truncate font-medium'>
        <ToolTipPopover message={value}>
          <span>{value}</span>
        </ToolTipPopover>
      </dd>
    </div>
  );
}
