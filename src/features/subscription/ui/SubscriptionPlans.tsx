import type { SubscriptionPlanDetails } from '@/features/subscription/server';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui';
import type Stripe from 'stripe';
import { PlanItem } from './PlanItem';

export function SubscriptionPlans({
  plans,
  currentPlan,
}: {
  plans: SubscriptionPlanDetails[];
  currentPlan?: {
    name: SubscriptionPlanDetails['name'];
    billingInterval: Stripe.Price.Recurring.Interval;
  };
}) {
  const maxAnnualSavingsPercent = getMaxAnnualSavingsPercent(plans);

  return (
    <Tabs defaultValue={'monthly'} className='w-full space-y-6'>
      <div className='flex flex-col items-center gap-2'>
        <TabsList variant={'line'} className='flex flex-row!'>
          {billingCycles.map(cycle => (
            <TabsTrigger key={cycle.name} value={cycle.name}>
              {cycle.title}
            </TabsTrigger>
          ))}
        </TabsList>

        <p className='text-muted-foreground text-xs'>
          {maxAnnualSavingsPercent > 0
            ? `Save up to ${maxAnnualSavingsPercent}% with annual billing`
            : 'Choose the billing cycle that fits your usage'}
        </p>
      </div>

      {billingCycles.map(cycle => (
        <TabsContent
          key={cycle.name}
          value={cycle.name}
          className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'
        >
          {plans.map(plan => (
            <PlanItem
              key={plan.name}
              plan={plan}
              cycle={cycle.name}
              isSubscribed={
                plan.name === currentPlan?.name &&
                (cycle.name === 'annual'
                  ? plan.prices.annual.interval === currentPlan?.billingInterval
                  : plan.prices.monthly.interval ===
                    currentPlan?.billingInterval)
              }
            />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}

const billingCycles = [
  { name: 'monthly', title: 'Monthly' },
  { name: 'annual', title: 'Annual' },
] as const;

function getMaxAnnualSavingsPercent(plans: SubscriptionPlanDetails[]) {
  return plans.reduce((max, plan) => {
    const monthly = plan.prices.monthly.amount;
    const annual = plan.prices.annual.amount;

    if (monthly <= 0) return max;

    const percent = Math.max(
      0,
      Math.round((1 - annual / (monthly * 12)) * 100)
    );

    return Math.max(max, percent);
  }, 0);
}
