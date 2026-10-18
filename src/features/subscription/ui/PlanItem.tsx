import type { SubscriptionPlanDetails } from '@/features/subscription/server';
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
import { cn } from '@/shared/utils';
import { Check } from 'lucide-react';
import { UpgradeSubscriptionAction } from '../upgrade/client';

export type BillingCycle = 'monthly' | 'annual';

export function PlanItem({
  plan,
  cycle,
  isSubscribed,
}: {
  plan: SubscriptionPlanDetails;
  cycle: BillingCycle;
  isSubscribed: boolean;
}) {
  const currentPrice = plan.prices[cycle];
  const monthlyPrice = plan.prices.monthly;
  const annualPrice = plan.prices.annual;

  return (
    <CardStatusIndicator
      isSubscribed={isSubscribed}
      isHighlighted={plan.highlighted}
    >
      <PlanStatusIndicator
        isSubscribed={isSubscribed}
        isHighlighted={plan.highlighted}
        className='absolute -top-2 right-4'
      />

      <CardHeader>
        <CardTitle className='text-xl'>{plan.title}</CardTitle>
        <CardDescription>{plan.subtitle}</CardDescription>
        <PlanPricing
          amount={currentPrice.amount}
          currency={currentPrice.currency}
          interval={currentPrice.interval}
        />
        <PlanPricingHint
          cycle={cycle}
          monthlyAmount={monthlyPrice.amount}
          annualAmount={annualPrice.amount}
          annualCurrency={annualPrice.currency}
        />
      </CardHeader>

      <CardContent className='space-y-3'>
        <Separator />
        <PlanFeatures features={plan.features} />
      </CardContent>

      <CardFooter className='mt-auto'>
        <SubscribeButton
          isSubscribed={isSubscribed}
          isHighlighted={plan.highlighted}
        >
          <UpgradeSubscriptionAction
            options={{
              plan: plan.name,
              annual: cycle === 'annual',
            }}
          >
            {`Choose ${plan.title}`}
          </UpgradeSubscriptionAction>
        </SubscribeButton>
      </CardFooter>
    </CardStatusIndicator>
  );
}

function PlanStatusIndicator({
  isSubscribed,
  isHighlighted,
  className,
}: {
  isSubscribed: boolean;
  isHighlighted?: boolean;
  className?: string;
}) {
  return isSubscribed ? (
    <Badge variant={'success'} className={className}>
      Current plan
    </Badge>
  ) : isHighlighted ? (
    <Badge className={className}>Most popular</Badge>
  ) : null;
}

function PlanPricing({
  amount,
  currency,
  interval,
}: {
  amount: number;
  currency: string;
  interval: string;
}) {
  return (
    <div className='flex items-end gap-1'>
      <span className='text-3xl leading-none font-bold'>
        {formatPrice(amount, currency)}
      </span>
      <span className='text-muted-foreground text-sm'>/{interval}</span>
    </div>
  );
}

function PlanPricingHint({
  cycle,
  monthlyAmount,
  annualAmount,
  annualCurrency,
}: {
  cycle: BillingCycle;
  monthlyAmount: number;
  annualAmount: number;
  annualCurrency: string;
}) {
  const annualSavingsPercent =
    monthlyAmount > 0
      ? Math.max(0, Math.round((1 - annualAmount / (monthlyAmount * 12)) * 100))
      : 0;

  return cycle === 'annual' ? (
    <p className='text-muted-foreground text-xs'>
      {`~${formatPrice(annualAmount / 12, annualCurrency)}/month, billed yearly`}
      {annualSavingsPercent > 0 ? ` • Save ${annualSavingsPercent}%` : ''}
    </p>
  ) : (
    <p className='text-muted-foreground text-xs'>
      {`or ${formatPrice(annualAmount, annualCurrency)}/year`}
    </p>
  );
}

function PlanFeatures({ features }: { features: string[] }) {
  return (
    <ul className='space-y-2'>
      {features.map(feature => (
        <li key={feature} className='flex items-start gap-2 text-sm'>
          <Check className='text-primary mt-0.5 size-4 shrink-0' />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

function SubscribeButton({
  isSubscribed,
  isHighlighted,
  children,
}: {
  isSubscribed: boolean;
  isHighlighted?: boolean;
  children: React.ReactElement;
}) {
  return isSubscribed ? (
    <Button type='button' className='w-full' variant='secondary' disabled>
      Already subscribed
    </Button>
  ) : (
    <Button
      type='button'
      className='w-full'
      variant={isHighlighted ? 'default' : 'outline'}
      nativeButton={true}
      render={children}
    />
  );
}

function CardStatusIndicator({
  isSubscribed,
  isHighlighted,
  children,
}: {
  isSubscribed: boolean;
  isHighlighted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Card
      className={cn(
        'relative overflow-visible border',
        isSubscribed
          ? 'border-emerald-200 shadow-lg shadow-emerald-200 dark:border-emerald-400 dark:shadow-emerald-400'
          : isHighlighted
            ? 'border-primary shadow-primary/20 shadow-lg'
            : 'border-border'
      )}
    >
      {children}
    </Card>
  );
}

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: 2,
  }).format(amount);
}
