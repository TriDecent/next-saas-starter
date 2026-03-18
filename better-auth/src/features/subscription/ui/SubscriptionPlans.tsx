import type { SubscriptionPlan } from '@/services/subscription';
import { PlanItem } from './PlanItem';

export function SubscriptionPlans({ plans }: { plans: SubscriptionPlan[] }) {
  return (
    <div className='grid gap-4 lg:grid-cols-3'>
      {plans.map(plan => (
        <PlanItem key={`${plan.name}-${plan.price}`} plan={plan} />
      ))}
    </div>
  );
}
