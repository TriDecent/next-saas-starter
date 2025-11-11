'use server';

import {
  getRestrictiveAjForAnonymousUser,
  handleDeniedInServerAction,
} from '@/lib';
import { auth } from '@/lib/auth';
import { request, slidingWindow } from '@arcjet/next';

export async function sendEmailVerificationAction(email: string) {
  const decision = await getRestrictiveAjForAnonymousUser()
    .withRule(slidingWindow({ mode: 'LIVE', interval: '1h', max: 3 }))
    .protect(await request());

  if (decision.isDenied()) handleDeniedInServerAction(decision);

  await auth.api.sendVerificationEmail({ body: { email } });
}
