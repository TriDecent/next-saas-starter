'use server';

import type { CreateBillingPortalResponse } from '@/features/subscription/server';
import { getSubscriptionService } from '@/infrastructure/composition/factory';
import { ajLaxAuthenticated, handleDeniedInServerAction } from '@/lib/arcjet';
import { request } from '@arcjet/next';
import z from 'zod';

export async function createBillingPortalAction(
  options: CreateBillingPortalActionOptions,
  callbackUrl: string
): Promise<CreateBillingPortalResponse> {
  const service = await getSubscriptionService(callbackUrl);

  const decision = await ajLaxAuthenticated.protect(await request(), {
    userId: service.actor.id,
    action: 'create-billing-portal',
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  const parsed = schema.safeParse(options);
  if (!parsed.success)
    return { type: 'error', payload: { message: 'Invalid input' } };

  return service.createBillingPortal({
    returnUrl: callbackUrl,
    disableRedirect: false,

    referenceId: parsed.data.referenceId,
    customerType: parsed.data.referenceId ? 'organization' : 'user',
  });
}

const schema = z.object({
  referenceId: z.string().optional(),
});
export type CreateBillingPortalActionOptions = z.infer<typeof schema>;
