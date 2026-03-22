import type { SubscriptionPlan } from '@/services/subscription';
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
import { UpgradeSubscriptionAction } from '../upgrade';

export type BillingCycle = 'monthly' | 'annual';

export function PlanItem({
  plan,
  cycle,
}: {
  plan: SubscriptionPlan;
  cycle: BillingCycle;
}) {
  const currentPrice = plan.prices[cycle];
  const monthlyPrice = plan.prices.monthly;
  const annualPrice = plan.prices.annual;

  const annualSavingsPercent =
    monthlyPrice.amount > 0
      ? Math.max(
          0,
          Math.round(
            (1 - annualPrice.amount / (monthlyPrice.amount * 12)) * 100
          )
        )
      : 0;

  return (
    <Card
      className={cn(
        'relative border',
        plan.highlighted
          ? 'border-primary shadow-primary/20 shadow-lg'
          : 'border-border'
      )}
    >
      {plan.highlighted ? (
        <Badge className='absolute -top-2 right-4'>Most popular</Badge>
      ) : null}

      <CardHeader>
        <CardTitle className='text-xl'>{plan.title}</CardTitle>
        <CardDescription>{plan.subtitle}</CardDescription>

        <div className='flex items-end gap-1'>
          <span className='text-3xl leading-none font-bold'>
            {formatPrice(currentPrice.amount, currentPrice.currency)}
          </span>
          <span className='text-muted-foreground text-sm'>
            /{currentPrice.interval}
          </span>
        </div>

        {cycle === 'annual' ? (
          <p className='text-muted-foreground text-xs'>
            {`~${formatPrice(annualPrice.amount / 12, annualPrice.currency)}/month, billed yearly`}
            {annualSavingsPercent > 0 ? ` • Save ${annualSavingsPercent}%` : ''}
          </p>
        ) : (
          <p className='text-muted-foreground text-xs'>
            {`or ${formatPrice(annualPrice.amount, annualPrice.currency)}/year`}
          </p>
        )}
      </CardHeader>

      <CardContent className='space-y-3'>
        <Separator />
        <ul className='space-y-2'>
          {plan.features.map(feature => (
            <li key={feature} className='flex items-start gap-2 text-sm'>
              <Check className='text-primary mt-0.5 size-4 shrink-0' />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className='mt-auto'>
        <Button
          type='button'
          className='w-full'
          variant={plan.highlighted ? 'default' : 'outline'}
          asChild
        >
          <UpgradeSubscriptionAction
            options={{ plan: plan.name, annual: cycle === 'annual' }}
          >
            {`Choose ${plan.title}`}
          </UpgradeSubscriptionAction>
        </Button>
      </CardFooter>
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
