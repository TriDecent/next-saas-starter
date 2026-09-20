'use server';

import { ajLaxAuthenticated, handleDeniedInServerAction } from '@/lib/arcjet';
import { SUBSCRIPTION_PLAN } from '@/lib/auth';
import { getSubscriptionService } from '@/services';
import type { UpgradeSubscriptionResponse } from '@/services/subscription';
import { request } from '@arcjet/next';
import z from 'zod';

export async function upgradeSubscriptionAction(
  input: UpgradeSubscriptionActionInput,
  callbackUrl: string
): Promise<UpgradeSubscriptionResponse> {
  const service = await getSubscriptionService(callbackUrl);

  const decision = await ajLaxAuthenticated.protect(await request(), {
    userId: service.actor.id,
    action: 'upgrade-subscription',
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  const parsed = schema.safeParse(input);
  if (!parsed.success)
    return { type: 'error', payload: { message: 'Invalid input' } };

  const activeSubsResponse = await service.listActiveSubscription({
    referenceId: parsed.data.referenceId,
    customerType: parsed.data.referenceId ? 'organization' : 'user',
  });
  if (activeSubsResponse.type === 'error') return activeSubsResponse;

  const activeSub = activeSubsResponse.payload.at(0);

  console.log(parsed.data);

  return service.upgradeSubscription({
    ...parsed.data,
    successUrl: callbackUrl,
    cancelUrl: callbackUrl,
    returnUrl: callbackUrl,
    scheduleAtPeriodEnd: false,
    disableRedirect: false,

    subscriptionId: activeSub?.stripeSubscriptionId,

    referenceId: parsed.data.referenceId,
    customerType: parsed.data.referenceId ? 'organization' : 'user',
  });
}

const schema = z.object({
  plan: z.enum([
    SUBSCRIPTION_PLAN.standard.name,
    SUBSCRIPTION_PLAN.pro.name,
    SUBSCRIPTION_PLAN.enterprise.name,
  ]),
  annual: z.boolean(),
  referenceId: z.string().optional(),
});
export type UpgradeSubscriptionActionInput = z.infer<typeof schema>;
