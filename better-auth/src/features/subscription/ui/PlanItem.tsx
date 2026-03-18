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

export function PlanItem({ plan }: { plan: SubscriptionPlan }) {
  return (
    <Card
      key={plan.name}
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
          <span className='text-3xl leading-none font-bold'>{plan.price}</span>
          <span className='text-muted-foreground text-sm'>{plan.caption}</span>
        </div>
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
        >
          {plan.name === 'enterprise'
            ? 'Talk to sales'
            : `Choose ${plan.title}`}
        </Button>
      </CardFooter>
    </Card>
  );
}
