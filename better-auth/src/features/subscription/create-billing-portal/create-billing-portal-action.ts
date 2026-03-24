'use server';

import { ajLaxAuthenticated, handleDeniedInServerAction } from '@/lib/arcjet';
import { getSubscriptionService } from '@/services';
import type { CreateBillingPortalResponse } from '@/services/subscription';
import { ROUTES } from '@/shared/constants';
import { request } from '@arcjet/next';

export async function createBillingPortalAction(
  callbackUrl: string
): Promise<CreateBillingPortalResponse> {
  const service = await getSubscriptionService(callbackUrl);

  const decision = await ajLaxAuthenticated.protect(await request(), {
    userId: service.actor.id,
    action: 'create-billing-portal',
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  return service.createBillingPortal({
    returnUrl: ROUTES.settings.nested.subscription.href,
    disableRedirect: false,
  });
}
