import { SubscriptionPlans } from '@/features/subscription';
import { getSubscriptionService } from '@/services';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = ROUTES.settings.nested.subscription.metadata;

export default async function SubscriptionPage() {
  const service = await getSubscriptionService(
    ROUTES.settings.nested.subscription.href
  );
  const plans = await service.getSubscriptionPlans();

  return <SubscriptionPlans plans={plans} />;
}

//  <SectionHeader
//     icon={Sparkles}
//     title={'Billing'}
//     description='Pick the plan that matches your team size and governance needs. UI preview only.'
//   />
